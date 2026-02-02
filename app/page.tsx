import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SkillsSection from '@/components/SkillsSection'
import PortfolioSection from '@/components/PortfolioSection'
import AnimatedBackground from '@/components/AnimatedBackground'
import PageLoader from '@/components/PageLoader'
import ScrollToTop from '@/components/ScrollToTop'

export default function Home() {
  return (
    <>
      <PageLoader />
      <AnimatedBackground />
      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <PortfolioSection />
        </main>
        <footer className="py-12 text-center text-white/40 text-sm border-t border-white/5">
          <p>&copy; {new Date().getFullYear()} Tom van Eijk. Alle rechten voorbehouden.</p>
        </footer>
      </div>
      <ScrollToTop />
    </>
  )
}
