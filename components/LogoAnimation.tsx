'use client'

import { useEffect, useState } from 'react'

/**
 * De logo-animatie, in drie gewichten.
 *
 * Het origineel was een GIF van 6,6 MB die met `priority` op de homepage stond.
 * Dat is vervangen door:
 *
 *   logo-animation.webm         355 KB  VP9 met transparantie
 *   logo-animation.webp       1.505 KB  geanimeerd, werkt overal
 *   logo-animation-poster.webp   17 KB  stilstaand laatste beeldje
 *
 * Safari kan geen transparantie in VP9-WebM. Het speelt de video wél af, maar
 * zonder alphakanaal — het logo zou dan op een zwart blok staan. Daarom draaien
 * we de logica om: iedereen begint met de poster van 17 KB, en pas als een
 * browser aantoonbaar VP9-WebM aankan én geen Safari is, laden we de video.
 * Gaat de detectie mis, dan is het gevolg een zwaardere WebP — niet een kapot
 * ogende hero.
 */

interface Props {
  className?: string
  /** Zet aan voor de hero: laadt de video meteen in plaats van op aanvraag. */
  priority?: boolean
}

type Modus = 'poster' | 'video' | 'webp'

export function LogoAnimation({ className = '', priority = false }: Props) {
  const [modus, setModus] = useState<Modus>('poster')

  useEffect(() => {
    const ua = navigator.userAgent
    const isSafari = /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(ua)
    const kanWebm =
      document.createElement('video').canPlayType('video/webm; codecs="vp9"') !== ''

    setModus(kanWebm && !isSafari ? 'video' : 'webp')
  }, [])

  if (modus === 'video') {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/logo-animation-poster.webp"
        preload={priority ? 'auto' : 'metadata'}
        width={1344}
        height={756}
        className={className}
        aria-label="tomveijk logo"
      >
        <source src="/logo-animation.webm" type="video/webm" />
      </video>
    )
  }

  return (
    // Bewust een gewone <img>: next/image slaat geanimeerde bestanden over, dus
    // het zou hier alleen een extra laag zonder winst opleveren.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={modus === 'webp' ? '/logo-animation.webp' : '/logo-animation-poster.webp'}
      alt="tomveijk logo"
      width={1344}
      height={756}
      className={className}
    />
  )
}
