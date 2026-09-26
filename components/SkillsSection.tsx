'use client'

import { motion } from 'framer-motion'
import { PenTool, Image as ImageIcon, Film, Newspaper } from 'lucide-react'

/**
 * Wat ik doe: disciplines met werk als voorbeeld, in plaats van losse
 * programma's. Photoshop kan elke vormgever; wat iemand ermee maakt zegt meer.
 */

const disciplines = [
  {
    titel: 'Logo & huisstijl',
    tekst: 'Een beeldmerk en een stijl die klopt bij wie je bent, van logo tot visitekaartje.',
    voorbeelden: 'GG Shields, Past Pursuits, Stilo Design',
    icoon: PenTool,
    kleur: '#A34BFF',
  },
  {
    titel: 'Social & thumbnails',
    tekst: 'Beeld dat in een tijdlijn opvalt en ervoor zorgt dat mensen doorklikken.',
    voorbeelden: 'StukTV, Xander Houtman, Kalvijn',
    icoon: ImageIcon,
    kleur: '#30A8FF',
  },
  {
    titel: 'Motion design',
    tekst: 'Animaties en visuals die beweging geven aan een merk of video.',
    voorbeelden: 'NOS, Radio 538, Talpa Social',
    icoon: Film,
    kleur: '#00D752',
  },
  {
    titel: 'Print & poster',
    tekst: 'Posters, kaarten en drukwerk met een eigen idee erachter.',
    voorbeelden: 'Freaky Food Festival, IDTV',
    icoon: Newspaper,
    kleur: '#FF9A3C',
  },
]

const gereedschap = [
  { src: '/icons/photoshop.svg', naam: 'Photoshop' },
  { src: '/icons/illustrator.svg', naam: 'Illustrator' },
  { src: '/icons/after-effects.svg', naam: 'After Effects' },
  { src: '/icons/indesign.svg', naam: 'InDesign' },
]

export default function SkillsSection() {
  return (
    <section id="wat-ik-doe" className="py-20 md:py-24 relative">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Wat ik doe</h2>
          <p className="text-white/50 text-sm uppercase tracking-widest">Grafisch ontwerp in vier vormen</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {disciplines.map((d, idx) => (
            <motion.div
              key={d.titel}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12 }}
              className="group"
            >
              <div className="relative h-full p-8 rounded-3xl border border-white/5 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-white/10 bg-gradient-to-br from-white/5 to-transparent flex flex-col">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${d.kleur}15 0%, transparent 100%)` }}
                />
                <div className="relative z-10 flex flex-col flex-1">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${d.kleur}20`, color: d.kleur }}
                  >
                    <d.icoon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{d.titel}</h3>
                  <p className="text-white/60 leading-relaxed text-sm flex-1">{d.tekst}</p>
                  <p className="mt-6 text-xs text-white/40">
                    <span className="uppercase tracking-wider text-white/30">Bijvoorbeeld </span>
                    {d.voorbeelden}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          <span className="text-xs uppercase tracking-widest text-white/30">Ik werk met</span>
          {gereedschap.map((g) => (
            <span key={g.naam} className="flex items-center gap-2 text-sm text-white/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt="" className="w-6 h-6" />
              {g.naam}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Waar ik heb gewerkt</h3>
            <p className="text-white/40 text-sm uppercase tracking-widest">Baan en stages</p>
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {[
              { src: '/logos/nos.svg', alt: 'NOS' },
              { src: '/logos/talpa.svg', alt: 'Talpa Network' },
              { src: '/logos/idtv.svg', alt: 'IDTV' },
            ].map((logo, i) => (
              <motion.div
                key={logo.alt}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="flex items-center justify-center h-28 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/10 transition-all duration-500">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="max-h-12 w-auto object-contain opacity-50 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
