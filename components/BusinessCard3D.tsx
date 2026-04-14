'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'

interface BusinessCard3DProps {
  frontImage: string
  backImage: string
}

export default function BusinessCard3D({ frontImage, backImage }: BusinessCard3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation (max ±20 degrees)
    const rotateX = ((y - centerY) / centerY) * -20
    const rotateY = ((x - centerX) / centerX) * 20

    setRotation({ x: rotateX, y: rotateY })
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    })
  }, [])

  const handleMouseEnter = () => setIsHovering(true)

  const handleMouseLeave = () => {
    setIsHovering(false)
    setRotation({ x: 0, y: 0 })
  }

  const handleClick = () => setIsFlipped(prev => !prev)

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="relative cursor-pointer"
        style={{
          perspective: '1200px',
          width: '100%',
          maxWidth: '425px',
          aspectRatio: '85 / 55',
        }}
      >
        <div
          className="relative w-full h-full transition-transform duration-700 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `
              rotateX(${rotation.x}deg) 
              rotateY(${isFlipped ? 180 + rotation.y : rotation.y}deg)
            `,
            transition: isHovering
              ? 'transform 0.1s ease-out'
              : 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Image
              src={frontImage}
              alt="Visitekaartje voorkant"
              fill
              className="object-cover"
              sizes="425px"
              priority
            />
            {/* Glare effect */}
            {isHovering && (
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
                }}
              />
            )}
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <Image
              src={backImage}
              alt="Visitekaartje achterkant"
              fill
              className="object-cover"
              sizes="425px"
            />
            {/* Glare effect */}
            {isHovering && (
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
                }}
              />
            )}
          </div>
        </div>

        {/* Shadow underneath */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 rounded-full blur-2xl transition-opacity duration-300"
          style={{
            background: 'rgba(163, 75, 255, 0.2)',
            opacity: isHovering ? 1 : 0.4,
          }}
        />
      </div>

      <p className="text-white/40 text-sm text-center">
        Klik om te draaien • Beweeg je muis voor 3D effect
      </p>
    </div>
  )
}
