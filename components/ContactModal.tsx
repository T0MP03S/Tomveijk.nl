'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Mail, User, MessageSquare } from 'lucide-react'
import MorphingButton from './MorphingButton'

interface ContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '' // Honeypot field - should stay empty
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '', website: '' })
        setTimeout(() => {
          onOpenChange(false)
          setSubmitStatus('idle')
        }, 2000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-transparent border-none shadow-none p-0" onInteractOutside={() => onOpenChange(false)}>
        <div className="glass-form-container relative rounded-3xl overflow-hidden">
          {/* Glass effect layers */}
          <div className="absolute inset-0 backdrop-blur-xl bg-white/10 border border-white/20" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="absolute inset-0 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2)]" />
          
          {/* Content */}
          <div className="relative z-10 p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-3xl font-bold text-white text-center">
                Contact
              </DialogTitle>
              <p className="text-white/60 text-center text-sm mt-2">
                Heb je een vraag of wil je samenwerken?
              </p>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Jouw naam"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="jouw@email.nl"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all"
                />
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-white/60" />
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Vertel me over je project..."
                  rows={5}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all resize-none"
                />
              </div>

              {/* Honeypot field - hidden from users, bots will fill it */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="absolute -left-[9999px] opacity-0 pointer-events-none"
                tabIndex={-1}
                autoComplete="off"
              />

              {submitStatus === 'success' && (
                <div className="p-4 bg-[#00D752]/20 border border-[#00D752]/30 rounded-xl text-[#00D752] text-sm">
                  Bedankt voor je bericht! Ik neem zo snel mogelijk contact met je op.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  Er is iets misgegaan. Probeer het later opnieuw.
                </div>
              )}

              <MorphingButton
                type="submit"
                variant="primary"
                className="w-full"
                icon={false}
              >
                {isSubmitting ? 'Verzenden...' : 'Verstuur Bericht'}
              </MorphingButton>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
