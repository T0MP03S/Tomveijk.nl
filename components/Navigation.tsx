'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ContactModal from './ContactModal'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
              alt="Tom Veijk"
              className="h-10 w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(163,75,255,0.5)]"
            />
          </motion.div>
        </Link>

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
      </div>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </motion.nav>
  )
}
