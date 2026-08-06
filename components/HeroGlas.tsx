'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

/**
 * Matglas over een gekleurde gloed.
 *
 * De kleurvelden staan achter het glas, zodat `backdrop-filter` iets heeft om
 * te vervagen, en dat is wat het als glas laat lezen. Bij de eerdere three.js-
 * poging ontbrak precies dat: daar had het glas een egale donkere achtergrond
 * en dus niets om te breken.
 *
 * Elke vorm volgt de muis met een eigen afstand én een eigen vertraging.
 * Alleen de afstand variëren is niet genoeg: dan bewegen ze nog steeds precies
 * gelijk op, alleen verder. Door ook de naijling te verschillen lopen ze uit de
 * pas, en dat is wat ze los van elkaar laat voelen.
 */

/** Hoe snel een laag zijn doel inhaalt. Lager = zwaarder en trager. */
const NAIJLING = [0.035, 0.065, 0.11] as const

/** Hoeveel pixels een vorm maximaal meebeweegt. Hoger = dichter bij de kijker. */
const DIEPTE = {
  groen: 7,
  blauw: 11,
  paars: 8,
  plaat: 18,
  driehoek: 27,
  schijf: 38,
} as const

const diepte = (d: number) => ({ '--d': d }) as CSSProperties

export default function HeroGlas({ className = '' }: { className?: string }) {
  const wortel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wortel.current
    if (!el) return

    // Geen muis om op te reageren, of beweging uitgezet: dan niets doen.
    const stil = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fijneAanwijzer = window.matchMedia('(pointer: fine)').matches
    if (stil || !fijneAanwijzer) return

    let frame = 0
    let doelX = 0
    let doelY = 0
    const huidig = NAIJLING.map(() => ({ x: 0, y: 0 }))

    const opMuis = (e: PointerEvent) => {
      const vak = el.getBoundingClientRect()
      // -1 tot 1, gemeten vanaf het midden van het vlak.
      doelX = (e.clientX - (vak.left + vak.width / 2)) / (window.innerWidth / 2)
      doelY = (e.clientY - (vak.top + vak.height / 2)) / (window.innerHeight / 2)
    }

    const teken = () => {
      NAIJLING.forEach((snelheid, i) => {
        const laag = huidig[i]
        laag.x += (doelX - laag.x) * snelheid
        laag.y += (doelY - laag.y) * snelheid
        el.style.setProperty(`--px${i + 1}`, laag.x.toFixed(4))
        el.style.setProperty(`--py${i + 1}`, laag.y.toFixed(4))
      })
      frame = requestAnimationFrame(teken)
    }

    window.addEventListener('pointermove', opMuis, { passive: true })
    frame = requestAnimationFrame(teken)

    return () => {
      window.removeEventListener('pointermove', opMuis)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={wortel} className={`hero-glas ${className}`} aria-hidden="true">
      <span className="hero-glas__kleur hero-glas__kleur--groen" style={diepte(DIEPTE.groen)} />
      <span className="hero-glas__kleur hero-glas__kleur--blauw" style={diepte(DIEPTE.blauw)} />
      <span className="hero-glas__kleur hero-glas__kleur--paars" style={diepte(DIEPTE.paars)} />

      <span className="hero-glas__vorm hero-glas__plaat" style={diepte(DIEPTE.plaat)} />
      <span className="hero-glas__vorm hero-glas__driehoek" style={diepte(DIEPTE.driehoek)} />
      <span className="hero-glas__vorm hero-glas__schijf" style={diepte(DIEPTE.schijf)} />
    </div>
  )
}
