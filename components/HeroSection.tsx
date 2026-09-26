'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MorphingButton from './MorphingButton'
import ContactModal from './ContactModal'

// Rechts in de hero staat eigen werk in plaats van een abstracte vorm: wie hier
// binnenkomt ziet meteen wat ik maak. Komt er een eigen showreel, dan vervangt
// die de video hieronder.
const video = {
  src: '/assets/images/hero-talpa-loop.mp4',
  poster: '/assets/images/hero-talpa-poster.jpg',
  bijschrift: 'Motion graphics voor Talpa Social',
  href: '/portfolio/talpa-social-2',
}

const tegels = [
  { src: '/assets/images/klasflix-logo.png', bijschrift: 'Klasflix, zoekmachine voor het onderwijs', href: '/portfolio/klasflix' },
  { src: '/assets/images/Freaky-Food-Festival.png', bijschrift: 'Posters voor Freaky Food Festival', href: '/portfolio/freaky-food-festival' },
]

function Bijschrift({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute left-3 bottom-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
      {children}
    </span>
  )
}

export default function HeroSection() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Wie minder beweging wil, krijgt het stilstaande beeld.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      videoRef.current?.pause()
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-28 pb-16">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <p className="text-sm md:text-base text-[#A34BFF] font-medium uppercase tracking-widest mb-4">
                Tom van Eijk • Grafisch vormgever
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Ontwerp dat blijft hangen
              </h1>
              <p className="text-base md:text-lg text-white/60 max-w-lg leading-relaxed">
                Ik ben <strong className="text-white">Tom van Eijk</strong>. Ik ontwerp logo&apos;s, huisstijlen, posters en thumbnails, en maak motion design. Ik werk als AV vormgever bij de NOS en studeer Creative Business aan de HvA.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <MorphingButton
                variant="primary"
                onClick={() => setIsContactOpen(true)}
              >
                CONTACT
              </MorphingButton>
              {/* Wijst naar het werk, niet naar de biografie: eerst laten zien
                  wat ik gemaakt heb. */}
              <MorphingButton
                variant="outline"
                onClick={() => scrollToSection('portfolio')}
              >
                BEKIJK MIJN WERK
              </MorphingButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <Link
              href={video.href}
              className="group relative col-span-2 aspect-video overflow-hidden rounded-3xl border border-white/10"
            >
              <video
                ref={videoRef}
                src={video.src}
                poster={video.poster}
                autoPlay
                muted
                loop
                playsInline
                aria-label={video.bijschrift}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <Bijschrift>{video.bijschrift}</Bijschrift>
            </Link>
            {tegels.map((t, i) => (
              <Link
                key={t.href}
                href={t.href}
                className="group relative aspect-square overflow-hidden rounded-3xl border border-white/10"
              >
                <Image
                  src={t.src}
                  alt={t.bijschrift}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <Bijschrift>{t.bijschrift}</Bijschrift>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <ContactModal open={isContactOpen} onOpenChange={setIsContactOpen} />
    </>
  )
}
