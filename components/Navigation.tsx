'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ContactModal from './ContactModal'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#0a0515]/90 backdrop-blur-xl py-4 border-b border-white/5' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img
              src="/logo.svg"
              alt="Tom van Eijk"
              className="h-10 w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(163,75,255,0.5)]"
            />
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <button
            onClick={() => scrollToSection('over-mij')}
            className="relative text-white/70 hover:text-white transition-all duration-300 uppercase tracking-wider font-medium group"
          >
            <span className="relative z-10">over mij</span>
            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </button>
          <button
            onClick={() => scrollToSection('portfolio')}
            className="relative text-white/70 hover:text-white transition-all duration-300 uppercase tracking-wider font-medium group"
          >
            <span className="relative z-10">portfolio</span>
            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#30A8FF] to-[#00D752] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </button>
          <button
            onClick={() => setContactOpen(true)}
            className="relative px-6 py-2 rounded-full bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] text-white font-medium uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-[#A34BFF]/50 hover:scale-105"
          >
            contact
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0a0515]/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              <button
                onClick={() => {
                  scrollToSection('over-mij')
                  setMobileMenuOpen(false)
                }}
                className="text-left text-white/70 hover:text-white transition-colors uppercase tracking-wider font-medium py-2"
              >
                Over mij
              </button>
              <button
                onClick={() => {
                  scrollToSection('portfolio')
                  setMobileMenuOpen(false)
                }}
                className="text-left text-white/70 hover:text-white transition-colors uppercase tracking-wider font-medium py-2"
              >
                Portfolio
              </button>
              <button
                onClick={() => {
                  setContactOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] text-white font-medium uppercase tracking-wider transition-all duration-300"
              >
                Contact
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </motion.nav>
  )
}
