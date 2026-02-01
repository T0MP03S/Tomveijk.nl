'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
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
      alert('Opslaan mislukt. Probeer het opnieuw.')
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
              className="w-full px-4 py-2 bg-[#1E1E2E] border border-white/10 rounded-lg text-white"
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="w-4 h-4 rounded"
            />
            <Label htmlFor="published" className="cursor-pointer">Publiceren</Label>
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
