'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { PhotoshopIcon, AfterEffectsIcon, IllustratorIcon } from './AdobeIcons'

interface Skill {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.error('Failed to load skills:', err))
  }, [])

  const visibleSkills = skills.length > 0 ? [
    skills[currentIndex],
    skills[(currentIndex + 1) % skills.length],
    skills[(currentIndex + 2) % skills.length],
  ].filter(Boolean) : []

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % skills.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + skills.length) % skills.length)
  }

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

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleSkills.map((skill, idx) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="group"
              >
                <div 
                  className="relative p-10 rounded-3xl border border-white/5 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-white/10 bg-gradient-to-br from-white/5 to-transparent h-full min-h-[400px] flex flex-col"
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
                      {!(skill.title.toLowerCase().includes('photoshop') || 
                         skill.title.toLowerCase().includes('photo') ||
                         skill.title.toLowerCase().includes('after effects') || 
                         skill.title.toLowerCase().includes('motion') ||
                         skill.title.toLowerCase().includes('illustrator') ||
                         skill.title.toLowerCase().includes('logo')) && (
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

          {skills.length > 3 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                →
              </button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <div className="text-center mb-12">
            <p className="text-white/40 text-sm uppercase tracking-widest">Samenwerkingen</p>
          </div>
          <div className="relative p-10 rounded-3xl border border-white/5 backdrop-blur-sm overflow-hidden bg-gradient-to-br from-white/5 to-transparent max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="flex items-center justify-center h-20 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <img 
                  src="/logos/idtv.svg" 
                  alt="IDTV" 
                  className="max-h-16 w-auto object-contain"
                />
              </div>
              <div className="flex items-center justify-center h-20 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <img 
                  src="/logos/defensie.svg" 
                  alt="Ministerie van Defensie" 
                  className="max-h-16 w-auto object-contain"
                />
              </div>
              <div className="flex items-center justify-center h-20 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <img 
                  src="/logos/nos.svg" 
                  alt="NOS" 
                  className="max-h-9 w-auto object-contain"
                  style={{ maxHeight: '2.25rem' }}
                />
              </div>
              <div className="flex items-center justify-center h-20 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <img 
                  src="/logos/talpa.svg" 
                  alt="Talpa Network" 
                  className="max-h-16 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
