'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// Seeded pseudo-random number generator (deterministic per page)
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function hashString(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
  }
  return Math.abs(hash)
}

// Base orb color palette
const orbColors = [
  { r: 163, g: 75, b: 255 },  // purple
  { r: 48, g: 168, b: 255 },  // blue
  { r: 120, g: 60, b: 220 },  // deep purple
  { r: 0, g: 215, b: 82 },    // green
  { r: 80, g: 120, b: 255 },  // light blue
]

export default function AnimatedBackground() {
  const [pageHeight, setPageHeight] = useState(1000)
  const pathname = usePathname()

  useEffect(() => {
    const update = () => setPageHeight(document.documentElement.scrollHeight)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(document.documentElement)

    window.addEventListener('resize', update)
    window.addEventListener('load', update)
    const interval = setInterval(update, 2000)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('load', update)
      clearInterval(interval)
    }
  }, [])

  // Use pathname to create a unique seed, so orbs look different on every page
  const seed = hashString(pathname || '/')
  const rand = seededRandom(seed)

  // 1 orb per ~500px of page height, minimum 5
  const orbCount = Math.max(5, Math.ceil(pageHeight / 500))

  const orbs = Array.from({ length: orbCount }, (_, i) => {
    const colorBase = orbColors[Math.floor(rand() * orbColors.length)]
    // Vary opacity between 0.06 and 0.16
    const opacity = 0.06 + rand() * 0.10
    // Vary size between 300 and 800
    const size = 300 + rand() * 500
    // Vary blur between 60 and 120
    const blur = 60 + rand() * 60
    // Random x position (-10% to 90%)
    const xPercent = -10 + rand() * 100
    // Distribute y positions across page height with some jitter
    const baseY = (i / (orbCount - 1 || 1)) * pageHeight
    const jitter = (rand() - 0.5) * 200
    const yPx = Math.max(0, baseY + jitter)

    const color = `rgba(${colorBase.r},${colorBase.g},${colorBase.b},${opacity.toFixed(2)})`

    return { key: i, color, size, blur, xPercent, yPx }
  })

  return (
    <>
      {/* Fixed dark base that always covers the viewport */}
      <div className="fixed inset-0 bg-[#0a0515] pointer-events-none z-0" />

      {/* Absolute orb layer that stretches to match full page height */}
      <div
        className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none z-0"
        style={{ height: `${pageHeight}px` }}
      >
        {orbs.map((orb) => (
          <div
            key={orb.key}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              left: `${orb.xPercent}%`,
              top: `${orb.yPx}px`,
              filter: `blur(${orb.blur}px)`,
            }}
          />
        ))}
      </div>
    </>
  )
}
