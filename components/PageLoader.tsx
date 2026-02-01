'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0b2e]"
        >
          {/* Animated blur balls in background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute w-96 h-96 rounded-full blur-[120px] bg-[#A34BFF] opacity-30"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ top: '20%', left: '20%' }}
            />
            <motion.div
              className="absolute w-96 h-96 rounded-full blur-[120px] bg-[#30A8FF] opacity-30"
              animate={{
                x: [0, -100, 0],
                y: [0, 100, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              style={{ bottom: '20%', right: '20%' }}
            />
          </div>

          {/* Logo with animation */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                duration: 1
              }}
              className="mb-8"
            >
              <Image
                src="/logo.svg"
                alt="Logo"
                width={120}
                height={120}
                className="w-32 h-32"
              />
            </motion.div>

            {/* Loading bar */}
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#A34BFF] via-[#30A8FF] to-[#00D752]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-white/60 text-sm tracking-widest"
            >
              LADEN...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
