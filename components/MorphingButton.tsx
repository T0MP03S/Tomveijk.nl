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
    primary: 'bg-gradient-to-r from-[#00D752] via-[#30A8FF] to-[#A34BFF] text-white shadow-lg shadow-[#30A8FF]/20 hover:shadow-[#30A8FF]/40',
    secondary: 'bg-gradient-to-r from-[#A34BFF] to-[#8a3eff] text-white shadow-[0_0_20px_rgba(163,75,255,0.3)]',
    outline: 'bg-transparent border-2 border-white/30 text-white hover:border-white/50 hover:bg-white/5'
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`
        relative px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider
        cursor-pointer overflow-hidden
        transition-all duration-300 ease-out
        flex items-center gap-3 justify-center
        ${variants[variant]}
        ${className}
      `}
      whileHover={{ scale: 1.03 }}
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
