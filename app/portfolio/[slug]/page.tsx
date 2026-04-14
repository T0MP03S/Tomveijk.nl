import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, AlertTriangle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import AnimatedBackground from '@/components/AnimatedBackground'
import ContentBlockRenderer from '@/components/ContentBlockRenderer'
import Footer from '@/components/Footer'

const siteUrl = process.env.NEXTAUTH_URL || 'https://tomveijk.nl'

function getYouTubeThumbnail(url: string): string | null {
  let videoId: string | null = null
  if (url.includes('youtube.com/watch')) {
    try { videoId = new URL(url).searchParams.get('v') } catch {}
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || null
  }
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await prisma.portfolioItem.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true, thumbnail: true, blocks: { orderBy: { order: 'asc' } } },
  })

  if (!item) return { title: 'Project niet gevonden' }

  // Try to get a good image: thumbnail first, then YouTube thumbnail from first video block
  let ogImage = item.thumbnail
  if (!ogImage || ogImage === '/placeholder.jpg') {
    for (const block of item.blocks) {
      const content = typeof block.content === 'string' ? JSON.parse(block.content) : block.content
      if (block.type === 'VIDEO' && content.url) {
        const ytThumb = getYouTubeThumbnail(content.url)
        if (ytThumb) { ogImage = ytThumb; break }
      }
    }
  }

  return {
    title: `${item.title} | Tom van Eijk`,
    description: item.description || `Portfolio project: ${item.title} door Tom van Eijk`,
    openGraph: {
      title: `${item.title} - Tom van Eijk`,
      description: item.description || `Portfolio project: ${item.title}`,
      url: `${siteUrl}/portfolio/${params.slug}`,
      images: ogImage ? [{ url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`, width: 1200, height: 630 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.title} - Tom van Eijk`,
      description: item.description || `Portfolio project: ${item.title}`,
      images: ogImage ? [ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`] : [],
    },
  }
}

export default async function PortfolioDetailPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }
  searchParams: { preview?: string } 
}) {
  const item = await prisma.portfolioItem.findUnique({
    where: { slug: params.slug },
    include: {
      media: {
        orderBy: { order: 'asc' }
      },
      blocks: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!item) {
    notFound()
  }

  // If item is not published, only allow viewing in preview mode when logged in
  const isPreview = searchParams.preview === 'true'
  if (!item.published && !isPreview) {
    notFound()
  }
  if (!item.published && isPreview) {
    const session = await getServerSession(authOptions)
    if (!session) {
      notFound()
    }
  }

  // Fetch related projects (other published items, max 4)
  const relatedItems = await prisma.portfolioItem.findMany({
    where: {
      published: true,
      slug: { not: params.slug },
    },
    select: {
      title: true,
      slug: true,
      thumbnail: true,
    },
    orderBy: { order: 'asc' },
    take: 4,
  })

  const typeLabels: Record<string, string> = {
    PROJECT: 'Project',
    WEBSITE: 'Website',
    DESIGN: 'Design',
    VIDEO: 'Video'
  }

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10">
        <Navigation />
        
        <main className="min-h-screen pt-24">
          {/* Draft Preview Banner */}
          {isPreview && !item.published && (
            <div className="bg-yellow-500/10 border-b border-yellow-500/20 py-3 px-6">
              <div className="container mx-auto max-w-4xl flex items-center gap-3 text-yellow-400 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Dit is een <strong>draft preview</strong> — dit project is nog niet gepubliceerd en alleen zichtbaar voor ingelogde admins.</span>
              </div>
            </div>
          )}

          {/* Hero Section */}
          <section className="relative py-16 overflow-hidden">
            <div className="container mx-auto px-6 max-w-4xl">
              {/* Back Button */}
              <Link 
                href="/#portfolio" 
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Terug naar portfolio</span>
              </Link>

              {/* Text Content - Centered */}
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#A34BFF]/20 to-[#30A8FF]/20 border border-[#A34BFF]/30 text-sm font-medium">
                    <Tag className="w-3.5 h-3.5 inline mr-1.5" />
                    {typeLabels[item.type] || item.type}
                  </span>
                  {item.createdAt && (
                    <span className="text-white/40 text-sm flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date((item as any).projectDate || item.createdAt).toLocaleDateString('nl-NL', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {item.title}
                </h1>
                
                {item.description && (
                  <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-16">
            <div className="container mx-auto px-6 max-w-4xl">
              {/* Media Items */}
              {item.media.length > 0 && (
                <div className="space-y-8 mb-16">
                  {item.media.map((media) => (
                    <div 
                      key={media.id} 
                      className="rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm shadow-xl"
                    >
                      {media.type === 'IMAGE' && (
                        <div className="relative w-full aspect-video">
                          <Image
                            src={media.url}
                            alt={media.caption || item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      {media.type === 'VIDEO' && (
                        <video controls className="w-full aspect-video bg-black">
                          <source src={media.url} />
                        </video>
                      )}
                      {media.type === 'EMBED' && (
                        <div className="relative w-full aspect-video bg-black">
                          <iframe
                            src={media.url}
                            className="w-full h-full"
                            title={media.caption || item.title}
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                      )}
                      {media.caption && (
                        <p className="p-6 text-white/60 text-sm border-t border-white/5">
                          {media.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Content Blocks */}
              <ContentBlockRenderer blocks={item.blocks} />
            </div>
          </section>

          {/* Related Projects */}
          {relatedItems.length > 0 && (
            <section className="py-20">
              <div className="container mx-auto px-6 max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-12">
                  Meer bekijken?
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {relatedItems.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/portfolio/${related.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                        <Image
                          src={related.thumbnail}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <h3 className="text-white text-sm font-semibold">
                            {related.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

        </main>
        <Footer />
      </div>
    </>
  )
}
