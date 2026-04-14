import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SkillsSection from '@/components/SkillsSection'
import PortfolioSection from '@/components/PortfolioSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
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
          <CTASection />
        </main>
        <Footer />
      </div>
      <ScrollToTop />
    </>
  )
}
