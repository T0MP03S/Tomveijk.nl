'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutSection() {
  return (
    <section id="over-mij" className="py-32 relative">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Over mij</h2>
          <p className="text-white/50 text-sm uppercase tracking-widest">Wie ben ik?</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
              <Image
                src="/images/tom-profile.jpg"
                alt="Tom van Eijk"
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = '<div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#A34BFF]/20 to-[#30A8FF]/20"><div class="text-6xl">👤</div></div>'
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e]/50 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="relative p-8 rounded-3xl border border-white/5 backdrop-blur-sm bg-gradient-to-br from-white/5 to-transparent">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] bg-clip-text text-transparent">
                Hallo, ik ben Tom.
              </h3>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  Als Grafisch Vormgever met veel ervaring en een passie voor innovatie, heb ik mijn diploma behaald aan het GLU. Mijn ontwerpen kenmerken zich door eenvoud en effectiviteit.
                </p>
                <p>
                  In mijn portfolio vind je een breed scala aan werk, van logo's tot complete huisstijlen. Heb je vragen of wil je samenwerken? Neem gerust contact met me op.
                </p>
                <p className="text-white/90 font-medium">
                  Samen kunnen we geweldige visuele verhalen creëren.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
