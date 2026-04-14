'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import ContactModal from './ContactModal'

export default function CTASection() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <section className="py-32 relative">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Heb je een project{' '}
              <span className="bg-gradient-to-r from-[#00D752] via-[#30A8FF] to-[#A34BFF] bg-clip-text text-transparent">
                <br />in gedachten?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Laten we samen iets moois maken. Of het nu gaat om een compleet nieuw merk, 
              een video productie of een creatief concept, ik help je graag.
            </p>
            <motion.button
              onClick={() => setContactOpen(true)}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#00D752] to-[#00B844] text-[#030310] font-semibold text-lg shadow-lg shadow-[#00D752]/20 hover:shadow-[#00D752]/40 transition-all duration-300"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Neem contact op
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </>
  )
}
