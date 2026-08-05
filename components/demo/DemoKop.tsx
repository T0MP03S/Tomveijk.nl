'use client'

import { useEffect, useState } from 'react'
import { telHref } from '@/lib/demo-kleur'

/** Vaste koptekst: doorzichtig boven de hero, wit zodra je scrolt. */
export default function DemoKop({
  bedrijf,
  telefoon,
  logo,
  links,
}: {
  bedrijf: string
  telefoon: string
  logo?: string
  links: { label: string; href: string }[]
}) {
  const [boven, setBoven] = useState(true)

  useEffect(() => {
    const bijwerken = () => setBoven(window.scrollY < 60)
    bijwerken()
    window.addEventListener('scroll', bijwerken, { passive: true })
    return () => window.removeEventListener('scroll', bijwerken)
  }, [])

  return (
    <header
      className="demo-kop fixed inset-x-0 top-0 z-50 transition-all duration-300"
      data-boven={boven ? 'true' : 'false'}
    >
      <div className="demo-omhulsel">
        <div className="flex items-center justify-between gap-4 py-3">
          <a href="#" className="flex shrink-0 items-center gap-3">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={bedrijf} className="h-9 w-auto object-contain md:h-11" />
            ) : (
              <span className="demo-kop-tekst text-lg font-extrabold tracking-tight md:text-xl">
                {bedrijf}
              </span>
            )}
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Hoofdmenu">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="demo-kop-tekst text-[0.9375rem] font-semibold opacity-85 transition hover:opacity-100"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={telHref(telefoon)}
              className="demo-kop-tekst hidden text-[0.9375rem] font-bold sm:block"
            >
              {telefoon}
            </a>
            <a href="#contact" className="demo-knop demo-knop--primair px-5 py-2.5 text-[0.9375rem]">
              Offerte aanvragen
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
