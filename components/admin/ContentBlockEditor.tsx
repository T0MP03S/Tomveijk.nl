'use client'

import { useState } from 'react'
import { Plus, GripVertical, Trash2, Image, Video, Link as LinkIcon, Type, FileText, Globe, Grid, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import FileUpload from './FileUpload'

export type BlockType = 
  | 'PHOTO' 
  | 'VIDEO' 
  | 'LINK' 
  | 'TITLE' 
  | 'SUBTITLE' 
  | 'TEXT' 
  | 'WEBSITE' 
  | 'GALLERY' 
  | 'SLIDER'

export interface ContentBlock {
  id?: string
  type: BlockType
  order: number
  content: any
}

interface ContentBlockEditorProps {
  portfolioItemId: string
  initialBlocks?: ContentBlock[]
  onChange?: (blocks: ContentBlock[]) => void
}

const blockTypes = [
  { type: 'PHOTO' as BlockType, icon: Image, label: 'Foto' },
  { type: 'VIDEO' as BlockType, icon: Video, label: 'Video' },
  { type: 'LINK' as BlockType, icon: LinkIcon, label: 'Link' },
  { type: 'TITLE' as BlockType, icon: Type, label: 'Titel' },
  { type: 'SUBTITLE' as BlockType, icon: Type, label: 'Subtitel' },
  { type: 'TEXT' as BlockType, icon: FileText, label: 'Bericht' },
  { type: 'WEBSITE' as BlockType, icon: Globe, label: 'Website' },
  { type: 'GALLERY' as BlockType, icon: Grid, label: 'Gallerij' },
  { type: 'SLIDER' as BlockType, icon: Layers, label: 'Slider' },
]

export default function ContentBlockEditor({ portfolioItemId, initialBlocks = [], onChange }: ContentBlockEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const updateBlocks = (newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks)
    onChange?.(newBlocks)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const updated = [...blocks]
      const [removed] = updated.splice(draggedIndex, 1)
      updated.splice(dragOverIndex, 0, removed)
      updated.forEach((block, i) => {
        block.order = i
      })
      updateBlocks(updated)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      type,
      order: blocks.length,
      content: getDefaultContent(type)
    }
    updateBlocks([...blocks, newBlock])
    setShowAddMenu(false)
  }

  const updateBlock = (index: number, content: any) => {
    const updated = [...blocks]
    updated[index].content = content
    updateBlocks(updated)
  }

  const removeBlock = (index: number) => {
    updateBlocks(blocks.filter((_, i) => i !== index))
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return
    }

    const updated = [...blocks]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]]
    
    updated.forEach((block, i) => {
      block.order = i
    })
    
    updateBlocks(updated)
  }

  const getDefaultContent = (type: BlockType) => {
    switch (type) {
      case 'PHOTO':
      case 'VIDEO':
        return { url: '', caption: '' }
      case 'LINK':
        return { url: '', text: '' }
      case 'TITLE':
      case 'SUBTITLE':
      case 'TEXT':
        return { text: '' }
      case 'WEBSITE':
        return { url: '', type: 'embed' }
      case 'GALLERY':
      case 'SLIDER':
        return { images: [] }
      default:
        return {}
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg">Content Blokken</Label>
        <div className="relative">
          <Button
            type="button"
            onClick={() => setShowAddMenu(!showAddMenu)}
            size="sm"
            className="bg-gradient-to-r from-[#A34BFF] to-[#30A8FF]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Blok toevoegen
          </Button>
          
          {showAddMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1E1E2E] border border-white/10 rounded-xl shadow-xl z-50 p-2">
              <div className="grid grid-cols-2 gap-2">
                {blockTypes.map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addBlock(type)}
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/80">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
          <p className="text-white/40">Nog geen content blokken toegevoegd</p>
          <p className="text-sm text-white/30 mt-2">Klik op "Blok toevoegen" om te beginnen</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-[#1E1E2E] border rounded-xl p-4 transition-all cursor-move ${
                draggedIndex === index 
                  ? 'opacity-50 border-[#A34BFF]' 
                  : dragOverIndex === index 
                    ? 'border-[#30A8FF] bg-[#30A8FF]/10' 
                    : 'border-white/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 pt-2">
                  <div className="p-1 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4 text-white/40" />
                  </div>
                </div>

                <div className="flex-1">
                  <BlockEditor
                    block={block}
                    onChange={(content) => updateBlock(index, content)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        type="hidden"
        name="blocks"
        value={JSON.stringify(blocks)}
      />
    </div>
  )
}

function BlockEditor({ block, onChange }: { block: ContentBlock; onChange: (content: any) => void }) {
  const { type, content } = block

  const blockType = blockTypes.find(b => b.type === type)
  const Icon = blockType?.icon || Type

  switch (type) {
    case 'PHOTO':
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Icon className="w-4 h-4" />
            <span>Foto</span>
          </div>
          <FileUpload
            label="Afbeelding"
            currentImage={content.url}
            onUpload={(url) => onChange({ ...content, url })}
          />
          <Input
            placeholder="Onderschrift (optioneel)"
            value={content.caption || ''}
            onChange={(e) => onChange({ ...content, caption: e.target.value })}
          />
        </div>
      )

    case 'VIDEO':
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Icon className="w-4 h-4" />
            <span>Video</span>
          </div>
          <Input
            placeholder="Video URL (YouTube, Vimeo, of directe link)"
            value={content.url || ''}
            onChange={(e) => onChange({ ...content, url: e.target.value })}
          />
          <p className="text-xs text-white/40">
            Ondersteund: YouTube, Vimeo, of directe video URL
          </p>
          <Input
            placeholder="Onderschrift (optioneel)"
            value={content.caption || ''}
            onChange={(e) => onChange({ ...content, caption: e.target.value })}
          />
        </div>
      )

    case 'LINK':
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Icon className="w-4 h-4" />
            <span>Link</span>
          </div>
          <Input
            placeholder="Linktekst"
            value={content.text || ''}
            onChange={(e) => onChange({ ...content, text: e.target.value })}
          />
          <Input
            placeholder="URL"
            value={content.url || ''}
            onChange={(e) => onChange({ ...content, url: e.target.value })}
          />
        </div>
      )

    case 'TITLE':
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Icon className="w-4 h-4" />
            <span>Titel</span>
          </div>
          <Input
            placeholder="Titel tekst"
            value={content.text || ''}
            onChange={(e) => onChange({ ...content, text: e.target.value })}
            className="text-lg font-bold"
          />
        </div>
      )

    case 'SUBTITLE':
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Icon className="w-4 h-4" />
            <span>Subtitel</span>
          </div>
          <Input
            placeholder="Subtitel tekst"
            value={content.text || ''}
            onChange={(e) => onChange({ ...content, text: e.target.value })}
          />
        </div>
      )

    case 'TEXT':
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Icon className="w-4 h-4" />
            <span>Bericht</span>
          </div>
          <Textarea
            placeholder="Bericht tekst"
            value={content.text || ''}
            onChange={(e) => onChange({ ...content, text: e.target.value })}
            rows={4}
          />
        </div>
      )

    case 'WEBSITE':
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Icon className="w-4 h-4" />
            <span>Website</span>
          </div>
          <Input
            placeholder="Website URL"
            value={content.url || ''}
            onChange={(e) => onChange({ ...content, url: e.target.value })}
          />
          <select
            value={content.type || 'embed'}
            onChange={(e) => onChange({ ...content, type: e.target.value })}
            className="w-full px-4 py-2 bg-[#0f0a1a]/60 border border-white/10 rounded-lg text-white"
          >
            <option value="embed">Embed</option>
            <option value="popup">Popup</option>
          </select>
        </div>
      )

    case 'GALLERY':
    case 'SLIDER':
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Icon className="w-4 h-4" />
            <span>{type === 'GALLERY' ? 'Gallerij' : 'Slider'}</span>
          </div>
          <MultipleImageUpload
            images={content.images || []}
            onChange={(images) => onChange({ ...content, images })}
          />
        </div>
      )

    default:
      return null
  }
}

function MultipleImageUpload({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const [uploading, setUploading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        if (data.original) {
          newUrls.push(data.original)
        }
      } catch (err) {
        console.error('Upload failed:', err)
      }
    }

    onChange([...images, ...newUrls])
    setUploading(false)
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const updated = [...images]
      const [removed] = updated.splice(draggedIndex, 1)
      updated.splice(dragOverIndex, 0, removed)
      onChange(updated)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group cursor-move rounded-lg overflow-hidden border-2 transition-all ${
                draggedIndex === index
                  ? 'opacity-50 border-[#A34BFF]'
                  : dragOverIndex === index
                    ? 'border-[#30A8FF]'
                    : 'border-transparent'
              }`}
            >
              <img src={url} alt="" className="w-full h-24 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="text-white/60 text-xs">{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-red-500/80 rounded-full hover:bg-red-500"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
              <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploading ? (
            <span className="text-sm text-white/60">Uploaden...</span>
          ) : (
            <>
              <Plus className="w-6 h-6 text-white/40 mb-1" />
              <span className="text-sm text-white/60">Klik om afbeeldingen toe te voegen</span>
              <span className="text-xs text-white/40">Meerdere selecteren mogelijk</span>
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleMultipleUpload}
          disabled={uploading}
        />
      </label>
      
      {images.length > 1 && (
        <p className="text-xs text-white/40 text-center">
          Sleep afbeeldingen om de volgorde aan te passen
        </p>
      )}
    </div>
  )
}
