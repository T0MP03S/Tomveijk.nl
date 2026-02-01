import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SkillsSection from '@/components/SkillsSection'
import PortfolioSection from '@/components/PortfolioSection'
import AnimatedBackground from '@/components/AnimatedBackground'
import PageLoader from '@/components/PageLoader'

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
          <p>&copy; 2025 Tom Veijk. Alle rechten voorbehouden.</p>
        </footer>
      </div>
    </>
  )
}
