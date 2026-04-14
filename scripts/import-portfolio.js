const { PrismaClient } = require('@prisma/client')
const data = require('./migration/data.json')
const improvedTexts = require('./improved-texts.js')

const prisma = new PrismaClient()

/**
 * Strip HTML tags and decode entities to get plain text.
 */
function htmlToText(html) {
  if (!html) return ''
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Parse WordPress HTML into ordered content blocks.
 * Uses multi-pass extraction sorted by position to maintain correct order.
 */
function parseContentBlocks(html) {
  if (!html) return []

  // Cut off everything from "Meer bekijken?" onwards (related posts carousel)
  const meerIdx = html.indexOf('Meer bekijken?')
  if (meerIdx !== -1) {
    html = html.substring(0, meerIdx)
  }

  // Collect all content items with their position in the HTML
  const items = []

  // --- Pass 1: Videos (<source src="...mp4/webm">) ---
  let m
  const videoRe = /<source[^>]*src=["']([^"']*\.(mp4|webm))["'][^>]*>/gi
  while ((m = videoRe.exec(html)) !== null) {
    items.push({ pos: m.index, type: 'VIDEO', content: { url: m[1], layout: 'full' } })
  }

  // --- Pass 2: Images (<img> tags) ---
  const imgRe = /<img[^>]*>/gi
  while ((m = imgRe.exec(html)) !== null) {
    const tag = m[0]
    // Skip carousel/related images (only if it's a post thumbnail in a carousel)
    if (tag.includes('wp-post-image')) continue
    // Get image source — prefer data-orig-src
    const origSrc = tag.match(/data-orig-src=["']([^"']+)["']/i)
    const src = tag.match(/\ssrc=["']([^"']+)["']/i)
    let imgSrc = origSrc ? origSrc[1] : (src && !src[1].startsWith('data:') ? src[1] : null)
    if (!imgSrc) continue
    // Skip resized variants
    if (imgSrc.match(/-\d+x\d+\./)) continue
    // Skip SVG placeholders
    if (imgSrc.includes('svg+xml')) continue
    items.push({ pos: m.index, type: 'PHOTO', content: { url: imgSrc, caption: '', layout: 'full' } })
  }

  // --- Pass 3: Headings ---
  const headingRe = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi
  while ((m = headingRe.exec(html)) !== null) {
    const text = htmlToText(m[1])
    if (text && text.length > 1) {
      items.push({ pos: m.index, type: 'TITLE', content: { text, layout: 'full' } })
    }
  }

  // --- Pass 4: Paragraphs ---
  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi
  while ((m = pRe.exec(html)) !== null) {
    const inner = m[1]
    // Skip paragraphs that only contain images or videos (already handled)
    if (inner.match(/^[\s]*<(img|video|source|div)/i)) continue
    const text = htmlToText(inner)
    if (text && text.length > 15 && !text.startsWith('Sorry, your browser')) {
      items.push({ pos: m.index, type: 'TEXT', content: { text, layout: 'full' } })
    }
  }

  // Sort by position in HTML to maintain correct order
  items.sort((a, b) => a.pos - b.pos)

  // Deduplicate: remove items whose text content is a substring of another nearby item
  const blocks = []
  for (const item of items) {
    const isDupe = blocks.some(b => {
      if (b.type !== item.type) return false
      if (item.type === 'TEXT' && b.content.text && item.content.text) {
        return b.content.text.includes(item.content.text) || item.content.text.includes(b.content.text)
      }
      if (item.type === 'VIDEO' || item.type === 'PHOTO') {
        return b.content.url === item.content.url
      }
      return false
    })
    if (!isDupe) blocks.push(item)
  }

  return blocks
}

async function main() {
  console.log('Starting WordPress portfolio import...\n')

  // First, delete all existing portfolio items and their blocks
  console.log('Clearing existing portfolio data...')
  await prisma.contentBlock.deleteMany({})
  await prisma.portfolioMedia.deleteMany({})
  await prisma.portfolioItem.deleteMany({})
  console.log('Done.\n')

  const portfolioItems = data.items.filter(item => item.type === 'avada_portfolio')
  console.log(`Found ${portfolioItems.length} portfolio items to import\n`)

  for (let i = 0; i < portfolioItems.length; i++) {
    const item = portfolioItems[i]
    const order = portfolioItems.length - i // newest first

    // Determine type
    let type = 'DESIGN'
    const excerptLower = (item.excerpt || '').toLowerCase()
    const htmlLower = (item.content_html || '').toLowerCase()
    if (htmlLower.includes('<video') || htmlLower.includes('.mp4') || htmlLower.includes('.webm') ||
        excerptLower.includes('video') || excerptLower.includes('motion') || excerptLower.includes('showreel')) {
      type = 'VIDEO'
    } else if (excerptLower.includes('website') || excerptLower.includes('site')) {
      type = 'WEBSITE'
    } else if (excerptLower.includes('logo') || excerptLower.includes('huisstijl') || excerptLower.includes('branding')) {
      type = 'PROJECT'
    }

    // Use improved text if available, otherwise use excerpt
    const override = improvedTexts[item.slug]
    const description = override
      ? override.description
      : (item.excerpt ? item.excerpt.replace(/Sorry, your browser.*?\./, '').trim() : '')

    // Create portfolio item
    const created = await prisma.portfolioItem.create({
      data: {
        title: item.title,
        description: description,
        thumbnail: item.featured_image || '/placeholder.jpg',
        type: type,
        slug: item.slug,
        published: true,
        order: order,
        projectDate: new Date(item.date),
      }
    })

    // Use improved blocks if available, otherwise parse from HTML
    const contentBlocks = override ? override.blocks : parseContentBlocks(item.content_html)

    for (let b = 0; b < contentBlocks.length; b++) {
      const block = contentBlocks[b]
      await prisma.contentBlock.create({
        data: {
          portfolioItemId: created.id,
          type: block.type,
          order: b,
          content: JSON.stringify(block.content),
        }
      })
    }

    const types = contentBlocks.map(b => b.type)
    const videoCount = types.filter(t => t === 'VIDEO').length
    const photoCount = types.filter(t => t === 'PHOTO').length
    const textCount = types.filter(t => t === 'TEXT').length
    const titleCount = types.filter(t => t === 'TITLE').length

    console.log(`Imported "${item.title}" (${type}) — ${videoCount} videos, ${photoCount} photos, ${textCount} texts, ${titleCount} titles`)
  }

  // Import new items (not from WordPress) from improved-texts
  const newItems = Object.entries(improvedTexts).filter(([_, v]) => v.isNew)
  if (newItems.length > 0) {
    console.log(`\nFound ${newItems.length} new (non-WordPress) items to import\n`)

    for (let ni = 0; ni < newItems.length; ni++) {
      const [slug, item] = newItems[ni]
      const created = await prisma.portfolioItem.create({
        data: {
          title: item.title,
          description: item.description,
          thumbnail: item.thumbnail || '/placeholder.jpg',
          type: item.type || 'DESIGN',
          slug: slug,
          published: true,
          order: portfolioItems.length + ni + 1,
          projectDate: new Date(item.date || '2024-01-01'),
        }
      })

      for (let b = 0; b < item.blocks.length; b++) {
        const block = item.blocks[b]
        await prisma.contentBlock.create({
          data: {
            portfolioItemId: created.id,
            type: block.type,
            order: b,
            content: JSON.stringify(block.content),
          }
        })
      }

      const types = item.blocks.map(b => b.type)
      const videoCount = types.filter(t => t === 'VIDEO').length
      const photoCount = types.filter(t => t === 'PHOTO').length
      const textCount = types.filter(t => t === 'TEXT').length

      console.log(`Imported NEW "${item.title}" (${item.type}) — ${videoCount} videos, ${photoCount} photos, ${textCount} texts`)
    }
  }

  console.log('\nImport complete!')
  const count = await prisma.portfolioItem.count()
  console.log(`Total portfolio items in database: ${count}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
