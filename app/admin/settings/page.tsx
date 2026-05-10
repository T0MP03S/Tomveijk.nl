'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast-notification'

interface SiteSettings {
  siteTitle: string
  siteDescription: string
  contactEmail: string
  socialInstagram: string
  socialLinkedin: string
  socialTiktok: string
  socialTwitch: string
  socialYoutube: string
  metaTitle: string
  metaDescription: string
}

export default function AdminSettingsPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: 'Tom van Eijk - Creative Designer',
    siteDescription: 'Grafisch vormgever met passie voor innovatie. Gespecialiseerd in logo design, huisstijlen en creatieve designs.',
    contactEmail: 'info@tomveijk.nl',
    socialInstagram: 'https://www.instagram.com/tompoeso',
    socialLinkedin: 'https://www.linkedin.com/in/tomveijknl/',
    socialTiktok: 'https://www.tiktok.com/@tompoeso',
    socialTwitch: 'https://www.twitch.tv/t0mp03s',
    socialYoutube: 'https://www.youtube.com/@Tompoeso',
    metaTitle: 'Tom van Eijk - Creative Designer & Grafisch Vormgever',
    metaDescription: 'Portfolio van Tom van Eijk - Creative Designer. Gespecialiseerd in logo design, huisstijlen, branding en grafische vormgeving.',
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (!response.ok) throw new Error('Failed to save settings')

      showToast('Instellingen opgeslagen!', 'success')
    } catch (error) {
      console.error('Settings save error:', error)
      showToast('Opslaan mislukt', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] bg-clip-text text-transparent">
          Instellingen
        </h1>
        <p className="text-white/60">Beheer de algemene instellingen van je website</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Algemene Instellingen */}
        <div className="bg-[#1E1E2E] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Algemeen</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="siteTitle">Site Titel</Label>
              <Input
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
                className="bg-[#0f0a1a] border-white/10"
              />
            </div>
            
            <div>
              <Label htmlFor="contactEmail">Contact E-mail</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="bg-[#0f0a1a] border-white/10"
              />
            </div>
          </div>

          <div className="mt-6">
            <Label htmlFor="siteDescription">Site Beschrijving</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              rows={3}
              className="bg-[#0f0a1a] border-white/10"
            />
          </div>
        </div>

        {/* SEO Instellingen */}
        <div className="bg-[#1E1E2E] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">SEO</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="metaTitle">Meta Titel</Label>
              <Input
                id="metaTitle"
                value={settings.metaTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="bg-[#0f0a1a] border-white/10"
              />
              <p className="text-sm text-white/40 mt-1">Maximaal 60 karakters aanbevolen</p>
            </div>
            
            <div>
              <Label htmlFor="metaDescription">Meta Beschrijving</Label>
              <Textarea
                id="metaDescription"
                value={settings.metaDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
                rows={3}
                className="bg-[#0f0a1a] border-white/10"
              />
              <p className="text-sm text-white/40 mt-1">Maximaal 160 karakters aanbevolen</p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-[#1E1E2E] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Social Media</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="socialInstagram">Instagram</Label>
              <Input
                id="socialInstagram"
                value={settings.socialInstagram}
                onChange={(e) => setSettings(prev => ({ ...prev, socialInstagram: e.target.value }))}
                className="bg-[#0f0a1a] border-white/10"
              />
            </div>
            
            <div>
              <Label htmlFor="socialLinkedin">LinkedIn</Label>
              <Input
                id="socialLinkedin"
                value={settings.socialLinkedin}
                onChange={(e) => setSettings(prev => ({ ...prev, socialLinkedin: e.target.value }))}
                className="bg-[#0f0a1a] border-white/10"
              />
            </div>
            
            <div>
              <Label htmlFor="socialTiktok">TikTok</Label>
              <Input
                id="socialTiktok"
                value={settings.socialTiktok}
                onChange={(e) => setSettings(prev => ({ ...prev, socialTiktok: e.target.value }))}
                className="bg-[#0f0a1a] border-white/10"
              />
            </div>
            
            <div>
              <Label htmlFor="socialTwitch">Twitch</Label>
              <Input
                id="socialTwitch"
                value={settings.socialTwitch}
                onChange={(e) => setSettings(prev => ({ ...prev, socialTwitch: e.target.value }))}
                className="bg-[#0f0a1a] border-white/10"
              />
            </div>
            
            <div>
              <Label htmlFor="socialYoutube">YouTube</Label>
              <Input
                id="socialYoutube"
                value={settings.socialYoutube}
                onChange={(e) => setSettings(prev => ({ ...prev, socialYoutube: e.target.value }))}
                className="bg-[#0f0a1a] border-white/10"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#A34BFF] to-[#30A8FF]"
          >
            {loading ? 'Opslaan...' : 'Instellingen Opslaan'}
          </Button>
        </div>
      </form>
    </div>
  )
}
