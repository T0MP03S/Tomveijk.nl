'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// Nieuwste bovenaan. Jaartallen komen uit Toms cv en arbeidsovereenkomst.
const tijdlijn = [
  { wanneer: '2026 tot nu', wat: 'Student Creative Business', waar: 'Hogeschool van Amsterdam' },
  { wanneer: '2024 tot nu', wat: 'AV vormgever', waar: 'NOS Paintbox' },
  { wanneer: '2024', wat: 'Diploma Grafisch vormgever', waar: 'Grafisch Lyceum Utrecht' },
  { wanneer: '2023 tot 2024', wat: 'Stage graphic design', waar: 'IDTV' },
  { wanneer: '2023', wat: 'Stage motion graphics', waar: 'Talpa Network' },
]

export default function AboutSection() {
  return (
    <section id="over-mij" className="pt-20 pb-10 md:pt-24 md:pb-12 relative">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Over mij</h2>
          <p className="text-white/50 text-sm uppercase tracking-widest">Grafisch vormgever &amp; webdeveloper</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
              <Image
                src="/images/tom-profile.jpg"
                alt="Portretfoto van Tom van Eijk, grafisch vormgever"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
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
                Hallo, ik ben Tom van Eijk
              </h3>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  Ik houd ontwerpen eenvoudig, zodat ze in een paar seconden overkomen, en let op de details die het af maken. Met klanten schakel ik kort en direct, en ik leer graag iets nieuws als een project daarom vraagt. Op dit moment is dat 3D.
                </p>
                <p>
                  Zin om samen te werken? Mail me op{' '}
                  <a href="mailto:info@tomveijk.nl" className="text-white underline decoration-[#A34BFF]/60 underline-offset-4 hover:decoration-[#A34BFF]">
                    info@tomveijk.nl
                  </a>
                  .
                </p>
              </div>
            </div>

            <ol className="relative ml-2 space-y-5 border-l border-white/10 pl-6">
              {tijdlijn.map((stap, i) => (
                <li key={stap.waar} className="relative">
                  <span
                    className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full ring-4 ring-[#0a0515] ${
                      i === 0 ? 'bg-gradient-to-r from-[#A34BFF] to-[#30A8FF]' : 'bg-white/25'
                    }`}
                  />
                  <p className="text-xs uppercase tracking-widest text-white/40">{stap.wanneer}</p>
                  <p className="text-white">
                    <span className="font-semibold">{stap.wat}</span>
                    <span className="text-white/50">, {stap.waar}</span>
                  </p>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
