'use client'

import { useEffect, useState } from 'react'
import { telHref } from '@/lib/demo-kleur'

/**
 * Jouw verkoopbalk onderaan de demo.
 *
 * Bewust een balk en geen pop-up: het moment dat iemand overtuigd raakt is
 * terwijl hij de pagina bekijkt, niet later in zijn inbox. Deze balk vangt
 * precies dat moment af zonder de pagina zelf in de weg te zitten.
 *
 * Zet `pitch.actief` uit zodra iemand klant wordt; dan is het een gewone site.
 */
export default function PitchBalk({
  bedrijf,
  slug,
  prijs,
  perMaand,
  jouwEmail,
  jouwTelefoon,
}: {
  bedrijf: string
  slug: string
  prijs: number
  perMaand: number
  jouwEmail: string
  jouwTelefoon: string
}) {
  const [zichtbaar, setZichtbaar] = useState(false)
  const sleutel = `pitchbalk:${slug}`

  useEffect(() => {
    if (sessionStorage.getItem(sleutel) === 'verborgen') return
    // Even wachten, zodat de balk niet tegelijk met de pagina binnenknalt.
    const t = setTimeout(() => setZichtbaar(true), 900)
    return () => clearTimeout(t)
  }, [sleutel])

  const onderwerp = `Ja, ik wil deze website — ${bedrijf}`
  const bericht = `Hoi Tom,

Ik heb het voorbeeld voor ${bedrijf} bekeken en wil graag verder.

Je kunt me bereiken op:
Telefoon:
E-mail:

Groet,`

  const mailto = `mailto:${jouwEmail}?subject=${encodeURIComponent(onderwerp)}&body=${encodeURIComponent(bericht)}`

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-[60] transition-transform duration-500 ease-out print:hidden ${
          zichtbaar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="border-t border-white/10 bg-neutral-900/95 backdrop-blur-md">
          <div className="demo-omhulsel">
            <div className="relative flex flex-col gap-3 py-3.5 md:flex-row md:items-center md:justify-between md:gap-6">
              <p className="pr-10 text-[0.9375rem] leading-snug text-white/75 md:pr-0">
                <span className="font-bold text-white">Dit is een voorbeeld</span> dat ik voor{' '}
                {bedrijf} heb gemaakt.
                <span className="hidden sm:inline">
                  {' '}
                  De complete site — 5 pagina&apos;s, klaar binnen een week — kost{' '}
                  <span className="font-bold text-white">€{prijs} eenmalig</span>, daarna €
                  {perMaand} per maand voor hosting en onderhoud.
                </span>
              </p>

              <div className="flex shrink-0 items-center gap-2">
                {jouwTelefoon && (
                  <a
                    href={telHref(jouwTelefoon)}
                    className="demo-knop demo-knop--rand hidden px-5 py-2.5 text-[0.9375rem] text-white sm:inline-flex"
                  >
                    Bel me
                  </a>
                )}
                <a
                  href={mailto}
                  className="demo-knop w-full bg-white px-5 py-2.5 text-[0.9375rem] text-neutral-900 hover:bg-neutral-200 md:w-auto"
                >
                  Ja, ik wil dit
                </a>
              </div>

              <button
                type="button"
                aria-label="Balk verbergen"
                onClick={() => {
                  setZichtbaar(false)
                  sessionStorage.setItem(sleutel, 'verborgen')
                }}
                className="absolute top-2 right-0 flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white md:static md:h-9 md:w-9"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zorgt dat de balk de voettekst nooit afdekt. */}
      <div aria-hidden className="h-24 md:h-20" />
    </>
  )
}
