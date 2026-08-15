'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

/**
 * Filterbalk plus raster voor de overzichtspagina.
 *
 * De items komen al gesorteerd binnen vanaf de server, nieuwste eerst. Hier
 * wordt alleen gefilterd, zodat de volgorde nooit door elkaar loopt als je van
 * filter wisselt.
 */

export interface PortfolioItem {
  id: string
  slug: string
  title: string
  description: string
  thumbnail: string | null
  type: string
  jaar: number | null
}

const LABELS: Record<string, string> = {
  WEBSITE: 'Websites',
  PROJECT: 'Projecten',
  DESIGN: 'Design',
  VIDEO: 'Video',
}

export default function PortfolioFilters({ items }: { items: PortfolioItem[] }) {
  const [actief, setActief] = useState<string>('ALLES')

  // Alleen filters tonen voor types die er ook echt zijn, met hun aantal.
  const filters = useMemo(() => {
    const telling = new Map<string, number>()
    for (const item of items) {
      telling.set(item.type, (telling.get(item.type) ?? 0) + 1)
    }
    const volgorde = ['WEBSITE', 'PROJECT', 'DESIGN', 'VIDEO']
    return [
      { sleutel: 'ALLES', label: 'Alles', aantal: items.length },
      ...volgorde
        .filter((t) => telling.has(t))
        .map((t) => ({ sleutel: t, label: LABELS[t] ?? t, aantal: telling.get(t)! })),
    ]
  }, [items])

  const zichtbaar = actief === 'ALLES' ? items : items.filter((i) => i.type === actief)

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-3">
        {filters.map((f) => {
          const aan = f.sleutel === actief
          return (
            <button
              key={f.sleutel}
              type="button"
              onClick={() => setActief(f.sleutel)}
              aria-pressed={aan}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                aan
                  ? 'border-transparent bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] text-white'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
              }`}
            >
              {f.label}
              <span className={`ml-2 text-xs ${aan ? 'text-white/70' : 'text-white/30'}`}>
                {f.aantal}
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {zichtbaar.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.04 }}
          >
            <Link href={`/portfolio/${item.slug}`} className="group block">
              <div className="relative aspect-square overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#A34BFF]/20">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="rounded-3xl object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-gradient-to-br from-[#2A2A3E] to-[#1A1A2E]">
                    <span className="text-lg text-white/40">{item.title}</span>
                  </div>
                )}

                {item.jaar && (
                  <span className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                    {item.jaar}
                  </span>
                )}

                <div className="absolute inset-0 flex items-end rounded-3xl bg-gradient-to-t from-black/75 via-black/0 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-wide text-[#30A8FF] uppercase">
                      {LABELS[item.type]?.replace(/s$/, '') ?? item.type}
                    </p>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-white/60">{item.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {zichtbaar.length === 0 && (
        <div className="py-24 text-center text-white/40">
          <p className="text-lg">Geen items in deze categorie</p>
        </div>
      )}
    </>
  )
}
