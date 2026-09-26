'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

/**
 * Raster voor de overzichtspagina, in twee delen: vormgeving en websites.
 *
 * De items komen al gesorteerd binnen vanaf de server, nieuwste eerst. Alles
 * wat geen website is (design, video, logo's) valt onder vormgeving.
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
  WEBSITE: 'Website',
  PROJECT: 'Branding',
  DESIGN: 'Design',
  VIDEO: 'Motion',
}

function Raster({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: Math.min(i % 3, 8) * 0.06 }}
        >
          <Link href={`/portfolio/${item.slug}`} className="group block">
            <div className="relative aspect-square overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#A34BFF]/20">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={`${item.title}, ontwerp door Tom van Eijk`}
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

            </div>
            <p className="mt-4 mb-1 text-xs font-semibold tracking-wide text-[#30A8FF] uppercase">
              {LABELS[item.type] ?? item.type}
            </p>
            <h3 className="truncate text-lg font-bold text-white transition-colors group-hover:text-[#30A8FF]">{item.title}</h3>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

export default function PortfolioOverzicht({ items }: { items: PortfolioItem[] }) {
  const vormgeving = items.filter((i) => i.type !== 'WEBSITE')
  const websites = items.filter((i) => i.type === 'WEBSITE')

  const delen = [
    { id: 'vormgeving', titel: 'Vormgeving', tekst: "Logo's, huisstijlen, posters, thumbnails en motion design.", items: vormgeving },
    { id: 'websites', titel: 'Websites', tekst: 'Websites die ik heb ontworpen en gebouwd.', items: websites },
  ].filter((d) => d.items.length > 0)

  if (delen.length === 0) {
    return (
      <div className="py-24 text-center text-white/40">
        <p className="text-lg">Nog geen projecten</p>
      </div>
    )
  }

  return (
    <>
      <nav aria-label="Portfolio-onderdelen" className="mb-16 flex flex-wrap gap-3">
        {delen.map((d) => (
          <a
            key={d.id}
            href={`#${d.id}`}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition-all duration-300 hover:border-white/20 hover:text-white"
          >
            {d.titel}
            <span className="ml-2 text-xs text-white/30">{d.items.length}</span>
          </a>
        ))}
      </nav>

      <div className="space-y-24">
        {delen.map((d) => (
          <section key={d.id} id={d.id} className="scroll-mt-28">
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">{d.titel}</h2>
            <p className="mb-10 text-white/50">{d.tekst}</p>
            <Raster items={d.items} />
          </section>
        ))}
      </div>
    </>
  )
}
