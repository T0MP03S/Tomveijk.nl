'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Smartphone, Palette } from 'lucide-react'
import Link from 'next/link'

interface PortfolioItem {
  id: string
  title: string
  description: string
  thumbnail: string
  type: 'PROJECT' | 'WEBSITE'
  embedUrl?: string
  slug: string
}

export default function PortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Failed to load portfolio:', err))
  }, [])

  const handleItemClick = (item: PortfolioItem) => {
    if (item.type === 'WEBSITE' && item.embedUrl) {
      setSelectedItem(item)
      setIsModalOpen(true)
    } else {
      window.location.href = `/portfolio/${item.slug}`
    }
  }

  return (
    <>
      <section id="portfolio" className="py-32 relative">
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h2>
            <p className="text-white/50 text-base max-w-2xl mx-auto">
              Van concept tot werkelijkheid - bekijk mijn recente projecten en websites die ik heb gemaakt.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleItemClick(item)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#A34BFF]/20">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover rounded-3xl"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2A2A3E] to-[#1A1A2E] rounded-3xl">
                      <Smartphone className="w-20 h-20 text-white/40" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center text-white/40 py-32 col-span-full">
              <Palette className="w-16 h-16 mx-auto mb-6 text-white/30" />
              <p className="text-xl mb-2">Portfolio items worden binnenkort toegevoegd</p>
              <p className="text-sm text-white/30">Check terug voor nieuwe projecten</p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
          </DialogHeader>
          {selectedItem?.embedUrl && (
            <iframe
              src={selectedItem.embedUrl}
              className="w-full h-full rounded-lg"
              title={selectedItem.title}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
