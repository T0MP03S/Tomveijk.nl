'use client'

import Image from 'next/image'
import Link from 'next/link'
import MasonryGallery from './MasonryGallery'
import ImageSlider from './ImageSlider'
import BusinessCard3D from './BusinessCard3D'

interface ContentBlock {
  id: string
  type: string
  content: string
  order: number
  layout?: string
}

interface ContentBlockRendererProps {
  blocks: ContentBlock[]
}

function getEmbedUrl(url: string): string {
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v')
    if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0`
  }
  if (url.includes('youtube.com/shorts/')) {
    const videoId = url.split('youtube.com/shorts/')[1]?.split('?')[0]
    if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0`
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]
    if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0`
  }
  if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
    if (videoId) return `https://player.vimeo.com/video/${videoId}`
  }
  return url
}

function renderBlock(block: ContentBlock) {
  const content = typeof block.content === 'string' ? JSON.parse(block.content) : block.content

  switch (block.type) {
    case 'PHOTO':
      return (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
          <div className="relative w-full">
            <Image
              src={content.url}
              alt={content.caption || 'Photo'}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
          {content.caption && (
            <p className="p-4 text-white/60 text-sm">{content.caption}</p>
          )}
        </div>
      )

    case 'VIDEO': {
      const isEmbedVideo = content.url?.includes('youtube.com') || content.url?.includes('youtu.be') || content.url?.includes('vimeo.com')
      const isShorts = content.url?.includes('youtube.com/shorts/')
      const embedUrl = isEmbedVideo ? getEmbedUrl(content.url) : content.url
      return (
        <div className="rounded-2xl overflow-hidden border border-white/10">
          {isEmbedVideo ? (
            <div className={`relative w-full ${isShorts ? 'aspect-[9/16]' : 'aspect-video'}`}>
              <iframe
                src={embedUrl}
                className="w-full h-full"
                title={content.caption || 'Video'}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            <video controls className="w-full">
              <source src={content.url} />
              Your browser does not support the video tag.
            </video>
          )}
          {content.caption && (
            <p className="p-4 text-white/60 text-sm">{content.caption}</p>
          )}
        </div>
      )
    }

    case 'LINK':
      return (
        <Link
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] text-white rounded-xl hover:opacity-90 transition-opacity"
        >
          {content.text || content.url}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      )

    case 'TITLE':
      return (
        <h2 className="text-2xl md:text-3xl font-bold text-white/90">
          {content.text}
        </h2>
      )

    case 'SUBTITLE':
      return (
        <h3 className="text-2xl md:text-3xl font-semibold text-white/90">
          {content.text}
        </h3>
      )

    case 'TEXT':
      return (
        <div className="prose prose-invert max-w-none">
          <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
            {content.text}
          </p>
        </div>
      )

    case 'WEBSITE':
      if (content.type === 'popup') {
        return (
          <div>
            <Link
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-colors"
            >
              Open website
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        )
      }
      return (
        <div className="rounded-2xl overflow-hidden border border-white/10">
          <div className="relative w-full aspect-video">
            <iframe
              src={content.url}
              className="w-full h-full"
              title="Website embed"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )

    case 'PDF':
      return (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
          <div className="relative w-full" style={{ height: '80vh', minHeight: '500px' }}>
            <iframe
              src={content.url}
              className="w-full h-full"
              title={content.title || 'PDF Document'}
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            {content.title && (
              <p className="text-white/60 text-sm">{content.title}</p>
            )}
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </a>
          </div>
        </div>
      )

    case 'BUSINESSCARD':
      return (
        <div className="py-8 flex justify-center">
          <BusinessCard3D
            frontImage={content.frontImage}
            backImage={content.backImage}
          />
        </div>
      )

    case 'GALLERY':
      return <MasonryGallery images={content.images || []} />

    case 'SLIDER':
      return <ImageSlider images={content.images || []} />

    default:
      return null
  }
}

export default function ContentBlockRenderer({ blocks }: ContentBlockRendererProps) {
  if (!blocks || blocks.length === 0) return null

  // Group blocks: consecutive 'half' blocks are paired into rows
  const rows: { blocks: ContentBlock[]; isRow: boolean }[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]
    const content = typeof block.content === 'string' ? JSON.parse(block.content) : block.content
    const layout = content.layout || block.layout || 'full'

    if (layout === 'half' && i + 1 < blocks.length) {
      const nextBlock = blocks[i + 1]
      const nextContent = typeof nextBlock.content === 'string' ? JSON.parse(nextBlock.content) : nextBlock.content
      const nextLayout = nextContent.layout || nextBlock.layout || 'full'

      if (nextLayout === 'half') {
        rows.push({ blocks: [block, nextBlock], isRow: true })
        i += 2
        continue
      }
    }

    rows.push({ blocks: [block], isRow: false })
    i++
  }

  return (
    <div className="space-y-8">
      {rows.map((row, rowIndex) => {
        if (row.isRow) {
          return (
            <div key={`row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {row.blocks.map((block) => (
                <div key={block.id}>{renderBlock(block)}</div>
              ))}
            </div>
          )
        }

        const block = row.blocks[0]
        return <div key={block.id}>{renderBlock(block)}</div>
      })}
    </div>
  )
}
