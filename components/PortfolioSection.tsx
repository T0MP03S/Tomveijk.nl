'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Smartphone, Palette, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface PortfolioItem {
  id: string
  title: string
  description: string
  thumbnail: string
  type: string
  embedUrl?: string | null
  slug: string
}

// Vormgeving staat standaard open; websites zitten achter de tweede tab.
const MAX_VORMGEVING = 6
const MAX_WEBSITES = 3

const SOORT: Record<string, string> = {
  WEBSITE: 'Website',
  PROJECT: 'Branding',
  DESIGN: 'Design',
  VIDEO: 'Motion',
}

function Tegel({ item, idx, onClick }: { item: PortfolioItem; idx: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-square rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#A34BFF]/20">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={`${item.title}, ontwerp door Tom van Eijk`}
            fill
            className="object-cover rounded-3xl"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2A2A3E] to-[#1A1A2E] rounded-3xl">
            <Smartphone className="w-20 h-20 text-white/40" />
          </div>
        )}
      </div>
      {/* Altijd zichtbaar, niet alleen bij hover: zonder uitleg is het een
          muur met plaatjes, en op een telefoon bestaat hover niet. */}
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h4 className="truncate text-lg font-bold text-white group-hover:text-[#30A8FF] transition-colors">{item.title}</h4>
        <span className="shrink-0 text-xs uppercase tracking-wider text-white/40">{SOORT[item.type] ?? ''}</span>
      </div>
    </motion.div>
  )
}

function MeerLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="text-center mt-12">
      <Link
        href={href}
        className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:border-[#A34BFF]/40 hover:bg-white/10 transition-all duration-300"
      >
        <span className="text-white font-medium">{children}</span>
        <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-[#A34BFF] group-hover:translate-x-1 transition-all duration-300" />
      </Link>
    </div>
  )
}

export default function PortfolioSection({ items }: { items: PortfolioItem[] }) {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const vormgeving = items.filter((i) => i.type !== 'WEBSITE')
  const websites = items.filter((i) => i.type === 'WEBSITE')

  const tabs = [
    { sleutel: 'VORMGEVING', label: 'Vormgeving', anker: 'vormgeving', meer: 'Bekijk alle vormgeving', max: MAX_VORMGEVING, items: vormgeving },
    { sleutel: 'WEBSITES', label: 'Websites', anker: 'websites', meer: 'Bekijk alle websites', max: MAX_WEBSITES, items: websites },
  ].filter((t) => t.items.length > 0)
  const [actief, setActief] = useState('VORMGEVING')
  const huidig = tabs.find((t) => t.sleutel === actief) ?? tabs[0]

  const handleItemClick = (item: PortfolioItem) => {
    if (item.type === 'WEBSITE' && item.embedUrl) {
      setSelectedItem(item)
      setIsModalOpen(true)
    } else {
      router.push(`/portfolio/${item.slug}`)
    }
  }

  return (
    <>
      <section id="portfolio" className="pt-12 pb-20 md:pt-16 md:pb-24 relative">
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h2>
            <p className="text-white/50 text-base max-w-2xl mx-auto">
              Logo&apos;s, huisstijlen, posters, thumbnails en motion design. En websites, zoals Klasflix: een zoekmachine voor het onderwijs.
            </p>
          </motion.div>

          {items.length === 0 && (
            <div className="text-center text-white/40 py-32 col-span-full">
              <Palette className="w-16 h-16 mx-auto mb-6 text-white/30" />
              <p className="text-xl mb-2">Portfolio items worden binnenkort toegevoegd</p>
              <p className="text-sm text-white/30">Check terug voor nieuwe projecten</p>
            </div>
          )}

          {items.length > 0 && (
            <div className="max-w-6xl mx-auto">
              {/* Eén blok met tabs in plaats van twee losse secties onder elkaar. */}
              <div role="tablist" aria-label="Soort werk" className="mb-10 flex justify-center gap-3">
                {tabs.map((t) => {
                  const aan = t.sleutel === actief
                  return (
                    <button
                      key={t.sleutel}
                      type="button"
                      role="tab"
                      aria-selected={aan}
                      onClick={() => setActief(t.sleutel)}
                      className={`rounded-full border px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                        aan
                          ? 'border-transparent bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>

              <div key={huidig.sleutel} role="tabpanel" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {huidig.items.slice(0, huidig.max).map((item, idx) => (
                  <Tegel key={item.id} item={item} idx={idx} onClick={() => handleItemClick(item)} />
                ))}
              </div>
              {huidig.items.length > huidig.max && (
                <MeerLink href={`/portfolio#${huidig.anker}`}>{huidig.meer}</MeerLink>
              )}
            </div>
          )}
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {/*
          grid-rows met een expliciete tweede rij is hier nodig. DialogContent
          is een grid met automatische rijhoogtes, en dan verwijst h-full op de
          iframe naar een rij zonder vaste hoogte: die klapt in en de rest van
          de modal blijft zwart.
        */}
        <DialogContent className="grid max-w-6xl grid-rows-[auto_1fr] gap-3 h-[85vh] p-4 sm:p-5">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
          </DialogHeader>
          {selectedItem?.embedUrl && (
            <iframe
              src={selectedItem.embedUrl}
              className="h-full min-h-0 w-full rounded-lg border-0 bg-white"
              title={selectedItem.title}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
