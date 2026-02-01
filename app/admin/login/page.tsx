'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Lock, Mail, Shield } from 'lucide-react'
import AnimatedBackground from '@/components/AnimatedBackground'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError('Email of wachtwoord klopt niet')
        } else {
          setError('Inloggen mislukt')
        }
      } else {
        router.push(result?.url || callbackUrl)
      }
    } catch (error) {
      setError('Er ging iets mis')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-[#1E1E2E]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#A34BFF]/20 to-[#30A8FF]/20 border border-[#A34BFF]/30 flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] bg-clip-text text-transparent">
              Admin Login
            </h1>
            <p className="text-center text-white/60 mb-8">
              Log in om je portfolio te beheren
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 bg-[#0f0a1a]/60 border-white/10 focus:border-[#A34BFF]/50 h-12 rounded-xl"
                    placeholder="Je email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Wachtwoord</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-12 bg-[#0f0a1a]/60 border-white/10 focus:border-[#A34BFF]/50 h-12 rounded-xl"
                    placeholder="Je wachtwoord"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] text-white font-semibold hover:opacity-95"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Inloggen...' : 'Inloggen'}</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-center text-white/40 text-xs">
                Je wordt doorgestuurd naar: {callbackUrl}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
