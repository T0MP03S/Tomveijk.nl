'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface MorphingButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  icon?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export default function MorphingButton({ 
  children, 
  variant = 'primary', 
  icon = true,
  className = '',
  onClick,
  type = 'button'
}: MorphingButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-[#00D752] to-[#00B844] text-[#030310] shadow-[0_0_20px_rgba(0,215,82,0.3)]',
    secondary: 'bg-gradient-to-r from-[#A34BFF] to-[#8a3eff] text-white shadow-[0_0_20px_rgba(163,75,255,0.3)]',
    outline: 'bg-transparent border-2 border-white/30 text-white hover:border-white/50 hover:bg-white/5'
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`
        relative px-8 py-4 rounded-xl font-semibold text-base
        cursor-pointer overflow-hidden
        transition-all duration-300 ease-out
        flex items-center gap-3 justify-center
        ${variants[variant]}
        ${className}
      `}
      whileHover={{ 
        scale: 1.02,
        borderRadius: '24px',
        y: -2
      }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      {icon && (
        <motion.div
          className="relative z-10"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      )}
    </motion.button>
  )
}
