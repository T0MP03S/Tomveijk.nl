import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import Navigation from '@/components/Navigation'
import AnimatedBackground from '@/components/AnimatedBackground'
import ContentBlockRenderer from '@/components/ContentBlockRenderer'

export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
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

          {/* Footer */}
          <footer className="py-12 text-center text-white/40 text-sm border-t border-white/5">
            <p>&copy; {new Date().getFullYear()} Tom van Eijk. Alle rechten voorbehouden.</p>
          </footer>
        </main>
      </div>
    </>
  )
}
