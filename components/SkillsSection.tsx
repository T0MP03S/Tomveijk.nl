'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { PhotoshopIcon, AfterEffectsIcon, IllustratorIcon, AIIcon } from './AdobeIcons'

interface Skill {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.error('Failed to load skills:', err))
  }, [])

  if (skills.length === 0) {
    return null
  }

  return (
    <section id="vaardigheden" className="py-32 relative">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Vaardigheden</h2>
          <p className="text-white/50 text-sm uppercase tracking-widest">Expertise Overzicht</p>
        </motion.div>

        <div className="relative max-w-7xl mx-auto">
          {/* Alle vaardigheden in één keer, niet een carrousel van drie: bij
              vier stond de nieuwste altijd verstopt achter een pijltje. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, idx) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="group"
              >
                <div
                  className="relative p-8 rounded-3xl border border-white/5 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-white/10 bg-gradient-to-br from-white/5 to-transparent h-full min-h-[360px] flex flex-col"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${skill.color}15 0%, transparent 100%)`
                    }}
                  />
                  
                  <div className="relative z-10 flex flex-col items-center text-center space-y-6 flex-1">
                    <div className="w-20 h-20 flex items-center justify-center">
                      {(skill.title.toLowerCase().includes('photoshop') || skill.title.toLowerCase().includes('photo')) && <PhotoshopIcon />}
                      {(skill.title.toLowerCase().includes('after effects') || skill.title.toLowerCase().includes('motion')) && <AfterEffectsIcon />}
                      {(skill.title.toLowerCase().includes('illustrator') || skill.title.toLowerCase().includes('logo')) && <IllustratorIcon />}
                      {/* Matcht op het icon-veld ('AI') en niet op de titel: een
                          titel-trefwoord zoals 'ai' zou te makkelijk per ongeluk
                          ook andere skills kunnen raken. */}
                      {skill.icon === 'AI' && <AIIcon />}
                      {!(skill.title.toLowerCase().includes('photoshop') ||
                         skill.title.toLowerCase().includes('photo') ||
                         skill.title.toLowerCase().includes('after effects') ||
                         skill.title.toLowerCase().includes('motion') ||
                         skill.title.toLowerCase().includes('illustrator') ||
                         skill.title.toLowerCase().includes('logo') ||
                         skill.icon === 'AI') && (
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black shadow-2xl"
                          style={{ 
                            backgroundColor: `${skill.color}`,
                            color: '#000',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                          }}
                        >
                          {skill.icon}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{skill.title}</h3>
                      <p className="text-white/60 leading-relaxed text-sm">{skill.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Samenwerkingen</h3>
            <p className="text-white/40 text-sm uppercase tracking-widest">Merken waar ik mee heb gewerkt</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { src: '/logos/idtv.svg', alt: 'IDTV' },
              { src: '/logos/defensie.svg', alt: 'Ministerie van Defensie' },
              { src: '/logos/nos.svg', alt: 'NOS' },
              { src: '/logos/talpa.svg', alt: 'Talpa Network' },
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
