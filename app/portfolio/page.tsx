import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navigation from '@/components/Navigation'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

const siteUrl = process.env.NEXTAUTH_URL || 'https://tomveijk.nl'

export const metadata: Metadata = {
  title: 'Portfolio | Tom van Eijk',
  description: 'Bekijk al mijn projecten — van video editing en branding tot websites en design.',
  openGraph: {
    title: 'Portfolio — Tom van Eijk',
    description: 'Bekijk al mijn projecten — van video editing en branding tot websites en design.',
    url: `${siteUrl}/portfolio`,
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const items = await prisma.portfolioItem.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  })

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10">
        <Navigation />

        <main className="min-h-screen pt-24 pb-20">
          <div className="container mx-auto px-6 max-w-7xl">
            {/* Header */}
            <div className="mb-16">
              <Link
                href="/#portfolio"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Terug naar home</span>
              </Link>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Alle Projecten
              </h1>
              <p className="text-white/50 text-lg max-w-2xl">
                Van concept tot werkelijkheid — bekijk al mijn projecten, websites, branding en video werk.
              </p>
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/portfolio/${item.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-square rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#A34BFF]/20">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover rounded-3xl"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2A2A3E] to-[#1A1A2E] rounded-3xl">
                        <span className="text-white/40 text-lg">{item.title}</span>
                      </div>
                    )}
                    {/* Hover overlay with title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 rounded-3xl">
                      <div>
                        <h3 className="text-white font-bold text-lg">{item.title}</h3>
                        <p className="text-white/60 text-sm mt-1 line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {items.length === 0 && (
              <div className="text-center text-white/40 py-32">
                <p className="text-xl mb-2">Nog geen portfolio items gepubliceerd</p>
                <p className="text-sm text-white/30">Check binnenkort terug voor nieuwe projecten</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
      <ScrollToTop />
    </>
  )
}
