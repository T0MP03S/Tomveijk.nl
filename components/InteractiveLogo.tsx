'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    Two: any
  }
}

export default function InteractiveLogo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let cleanup: (() => void) | null = null

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/two.js/0.7.7/two.min.js'
    script.async = true
    
    script.onload = () => {
      setTimeout(() => {
        try {
          cleanup = initializeLogo()
          setIsLoaded(true)
        } catch (err) {
          console.error('Failed to initialize logo:', err)
          setLoadError(true)
        }
      }, 100)
    }
    
    script.onerror = () => {
      setLoadError(true)
    }
    
    document.head.appendChild(script)

    return () => {
      if (cleanup) cleanup()
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const initializeLogo = () => {
    if (!containerRef.current || !window.Two) return null

    const Two = window.Two
    const two = new Two({
      type: Two.Types.canvas,
      width: 600,
      height: 400,
      autostart: true
    }).appendTo(containerRef.current)

    // Simpel pad voor demo
    const path = two.makePath(
      100, 100,
      200, 50,
      300, 100,
      300, 200,
      200, 250,
      100, 200
    )
    
    path.fill = 'transparent'
    path.stroke = '#A34BFF'
    path.linewidth = 4
    path.closed = true

    // Center it
    const bounds = path.getBoundingClientRect()
    path.translation.set(
      two.width / 2 - bounds.width / 2,
      two.height / 2 - bounds.height / 2
    )

    // Maak punten sleepbaar
    const points: any[] = []
    path.vertices.forEach((v: any, i: number) => {
      const circle = two.makeCircle(v.x, v.y, 8)
      circle.fill = '#30A8FF'
      circle.stroke = '#A34BFF'
      circle.linewidth = 2
      
      points.push({ vertex: v, circle, isDragging: false })
    })

    let draggedPoint: any = null

    const onPointerDown = (e: PointerEvent) => {
      const rect = containerRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      points.forEach(p => {
        const dx = p.circle.translation.x - x
        const dy = p.circle.translation.y - y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 20) {
          draggedPoint = p
        }
      })
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = containerRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (draggedPoint) {
        draggedPoint.vertex.x = x - path.translation.x
        draggedPoint.vertex.y = y - path.translation.y
        draggedPoint.circle.translation.set(x, y)
        containerRef.current!.style.cursor = 'grabbing'
      } else {
        let hovering = false
        points.forEach(p => {
          const dx = p.circle.translation.x - x
          const dy = p.circle.translation.y - y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 20) hovering = true
        })
        containerRef.current!.style.cursor = hovering ? 'pointer' : 'default'
      }
    }

    const onPointerUp = () => {
      draggedPoint = null
      containerRef.current!.style.cursor = 'default'
    }

    containerRef.current.addEventListener('pointerdown', onPointerDown)
    containerRef.current.addEventListener('pointermove', onPointerMove)
    containerRef.current.addEventListener('pointerup', onPointerUp)
    containerRef.current.addEventListener('pointerleave', onPointerUp)

    // Sync circles with vertices on each frame
    two.bind('update', () => {
      points.forEach(p => {
        if (!draggedPoint || draggedPoint !== p) {
          p.circle.translation.set(
            p.vertex.x + path.translation.x,
            p.vertex.y + path.translation.y
          )
        }
      })
    })

    two.update()

    return () => {
      containerRef.current?.removeEventListener('pointerdown', onPointerDown)
      containerRef.current?.removeEventListener('pointermove', onPointerMove)
      containerRef.current?.removeEventListener('pointerup', onPointerUp)
      containerRef.current?.removeEventListener('pointerleave', onPointerUp)
    }
  }

  if (loadError) {
    return (
      <div className="w-full flex items-center justify-center">
        <img 
          src="/logo-animation.gif"
          alt="Logo"
          className="w-full max-w-2xl h-auto"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <div 
        ref={containerRef} 
        className="w-full flex items-center justify-center bg-transparent"
        style={{ minHeight: '400px' }}
      >
        {!isLoaded && (
          <img 
            src="/logo-animation.gif"
            alt="Logo"
            className="w-full max-w-2xl h-auto"
          />
        )}
      </div>
      {isLoaded && (
        <p className="text-center text-white/50 text-sm mt-4">
          Sleep de punten om de vorm te veranderen
        </p>
      )}
    </div>
  )
}
