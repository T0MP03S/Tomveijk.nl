import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SkillsSection from '@/components/SkillsSection'
import PortfolioSection from '@/components/PortfolioSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import AnimatedBackground from '@/components/AnimatedBackground'
import ScrollToTop from '@/components/ScrollToTop'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Op de server ophalen in plaats van in de browser: dan staat het werk al in
  // de HTML en ziet een zoekmachine het meteen.
  const items = await prisma.portfolioItem
    .findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      select: { id: true, title: true, description: true, thumbnail: true, type: true, embedUrl: true, slug: true },
    })
    .catch(() => [])

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <PortfolioSection items={items} />
          <SkillsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
      <ScrollToTop />
    </>
  )
}
