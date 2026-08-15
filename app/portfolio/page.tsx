import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PortfolioFilters from '@/components/PortfolioFilters'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navigation from '@/components/Navigation'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

const siteUrl = process.env.NEXTAUTH_URL || 'https://tomveijk.nl'

export const metadata: Metadata = {
  title: 'Portfolio | Tom van Eijk',
  description: 'Bekijk al mijn projecten: van videowerk en branding tot websites en design.',
  openGraph: {
    title: 'Portfolio | Tom van Eijk',
    description: 'Bekijk al mijn projecten: van videowerk en branding tot websites en design.',
    url: `${siteUrl}/portfolio`,
    type: 'website',
  },
}

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const rijen = await prisma.portfolioItem.findMany({
    where: { published: true },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      thumbnail: true,
      type: true,
      projectDate: true,
      createdAt: true,
    },
  })

  // Nieuwste eerst. Niet elk item heeft een projectdatum, dus dan valt hij
  // terug op de aanmaakdatum; sorteren in de database kan dat niet in één
  // opdracht, en bij dit aantal items maakt dat niets uit.
  const items = rijen
    .map((r) => {
      const datum = r.projectDate ?? r.createdAt
      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        description: r.description,
        thumbnail: r.thumbnail,
        type: r.type,
        jaar: datum ? new Date(datum).getFullYear() : null,
        sorteer: datum ? new Date(datum).getTime() : 0,
      }
    })
    .sort((a, b) => b.sorteer - a.sorteer)

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
                Al mijn projecten, websites, branding en videowerk, nieuwste eerst.
              </p>
            </div>

            <PortfolioFilters items={items} />
          </div>
        </main>

        <Footer />
      </div>
      <ScrollToTop />
    </>
  )
}
