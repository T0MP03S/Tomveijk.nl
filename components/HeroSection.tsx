'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import MorphingButton from './MorphingButton'
import ContactModal from './ContactModal'

export default function HeroSection() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x * 2)
    mouseY.set(y * 2)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Jouw merk, mijn creativiteit!
              </h1>
              <p className="text-base md:text-lg text-white/60 max-w-lg leading-relaxed">
                Laat mij jouw ideeën tot leven brengen met creatieve designs en websites die écht opvallen. Samen maken we iets bijzonders!
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <MorphingButton
                variant="primary"
                onClick={() => setIsContactOpen(true)}
              >
                CONTACT
              </MorphingButton>
              <MorphingButton
                variant="outline"
                onClick={() => scrollToSection('over-mij')}
              >
                OVER MIJ
              </MorphingButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex justify-center items-center"
            style={{ perspective: '1000px' }}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full max-w-2xl"
              transition={{ type: 'spring', stiffness: 150, damping: 25 }}
            >
              <motion.div 
                className="flex items-center justify-center w-full"
                style={{
                  transform: 'translateZ(50px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src="/logo-animation.gif"
                  alt="tomveijk Logo"
                  className="w-full max-w-2xl h-auto"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <ContactModal open={isContactOpen} onOpenChange={setIsContactOpen} />
    </>
  )
}
