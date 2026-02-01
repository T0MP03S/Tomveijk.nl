'use client'

export default function AnimatedBackground() {
  const balls = [
    { size: 900, color: '#A34BFF', opacity: 0.35, initialX: -25, initialY: -15 },
    { size: 850, color: '#30A8FF', opacity: 0.32, initialX: 105, initialY: -10 },
    { size: 950, color: '#00D752', opacity: 0.28, initialX: -30, initialY: 95 },
    { size: 900, color: '#A34BFF', opacity: 0.3, initialX: 110, initialY: 100 },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#1a0b2e]" />
      
      {balls.map((ball, index) => (
        <div
          key={index}
          className="absolute rounded-full blur-[150px]"
          style={{
            width: ball.size,
            height: ball.size,
            backgroundColor: ball.color,
            opacity: ball.opacity,
            left: `${ball.initialX}%`,
            top: `${ball.initialY}%`,
          }}
        />
      ))}
    </div>
  )
}
