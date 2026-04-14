'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Eye } from 'lucide-react'
import { useToast } from '@/components/ui/toast-notification'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import FileUpload from './FileUpload'
import ContentBlockEditor, { ContentBlock } from './ContentBlockEditor'

interface PortfolioFormProps {
  initialData?: {
    id?: string
    title: string
    description: string
    thumbnail: string
    type: string
    embedUrl?: string
    embeds?: string[]
    blocks?: ContentBlock[]
    slug: string
    published: boolean
    order: number
    projectDate?: string
  }
}

export default function PortfolioForm({ initialData }: PortfolioFormProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    thumbnail: initialData?.thumbnail || '',
    type: initialData?.type || 'PROJECT',
    embedUrl: initialData?.embedUrl || '',
    embeds: initialData?.embeds || [],
    blocks: initialData?.blocks || [],
    slug: initialData?.slug || '',
    published: initialData?.published || false,
    order: initialData?.order || 0,
    projectDate: initialData?.projectDate || '',
  })

  const addEmbed = () => {
    setFormData((prev) => ({
      ...prev,
      embeds: [...prev.embeds, ''],
    }))
  }

  const removeEmbed = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      embeds: prev.embeds.filter((_, i) => i !== index),
    }))
  }

  const updateEmbed = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      embeds: prev.embeds.map((v, i) => (i === index ? value : v)),
    }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData?.id
        ? `/api/admin/portfolio/${initialData.id}`
        : '/api/admin/portfolio'
      
      const method = initialData?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save')
      }

      router.push('/admin/portfolio')
      router.refresh()
    } catch (error) {
      console.error('Save error:', error)
      showToast('Opslaan mislukt. Probeer het opnieuw.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
            />
            <p className="text-sm text-white/40 mt-1">
              URL: /portfolio/{formData.slug || 'slug'}
            </p>
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-2.5 bg-[#0f0a1a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A34BFF]/50 focus:border-[#A34BFF]/50 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '40px' }}
            >
              <option value="PROJECT">Project</option>
              <option value="WEBSITE">Website</option>
              <option value="DESIGN">Design</option>
              <option value="VIDEO">Video</option>
            </select>
          </div>

          <div>
            <Label htmlFor="projectDate">Project Datum</Label>
            <Input
              id="projectDate"
              type="date"
              value={formData.projectDate}
              onChange={(e) => setFormData(prev => ({ ...prev, projectDate: e.target.value }))}
            />
            <p className="text-sm text-white/40 mt-1">Wordt getoond op de detail pagina</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Embeds (optioneel)</Label>
              <button
                type="button"
                onClick={addEmbed}
                className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
              >
                <Plus className="w-4 h-4" />
                Embed toevoegen
              </button>
            </div>

            {formData.embeds.length === 0 ? (
              <p className="text-sm text-white/40">Geen embeds toegevoegd</p>
            ) : (
              <div className="space-y-3">
                {formData.embeds.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="url"
                      value={url}
                      onChange={(e) => updateEmbed(index, e.target.value)}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeEmbed(index)}
                      className="p-2 rounded-lg border border-white/10 hover:bg-white/5"
                      aria-label="Verwijder embed"
                    >
                      <X className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="order">Volgorde</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={formData.published}
              onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A34BFF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0a1a] ${
                formData.published
                  ? 'bg-gradient-to-r from-[#00D752] to-[#30A8FF]'
                  : 'bg-white/10'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                  formData.published ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <Label
              htmlFor="published"
              className="cursor-pointer select-none"
              onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
            >
              {formData.published ? (
                <span className="text-green-400 font-medium">Gepubliceerd</span>
              ) : (
                <span className="text-white/50">Concept</span>
              )}
            </Label>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="description">Beschrijving</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={6}
              required
            />
          </div>

          <FileUpload
            label="Thumbnail"
            currentImage={formData.thumbnail}
            onUpload={(url) => setFormData(prev => ({ ...prev, thumbnail: url }))}
          />
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <ContentBlockEditor
          portfolioItemId={initialData?.id || ''}
          initialBlocks={formData.blocks}
          onChange={(blocks) => setFormData(prev => ({ ...prev, blocks }))}
        />
      </div>

      <div className="flex gap-4 pt-6 border-t border-white/10">
        <Button
          type="submit"
          disabled={loading || !formData.thumbnail}
          className="bg-gradient-to-r from-[#A34BFF] to-[#30A8FF]"
        >
          {loading ? 'Opslaan...' : initialData?.id ? 'Bijwerken' : 'Aanmaken'}
        </Button>
        {initialData?.slug && (
          <Button
            type="button"
            variant="outline"
            onClick={() => window.open(`/portfolio/${initialData.slug}?preview=true`, '_blank')}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/portfolio')}
        >
          Annuleren
        </Button>
      </div>
    </form>
  )
}
