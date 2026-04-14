'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GripVertical, Eye, EyeOff, Edit } from 'lucide-react'
import DeletePortfolioButton from './DeletePortfolioButton'

interface PortfolioItem {
  id: string
  title: string
  slug: string
  thumbnail: string
  type: string
  published: boolean
  order: number
  _count: { media: number }
}

interface PortfolioListProps {
  initialItems: PortfolioItem[]
}

export default function PortfolioList({ initialItems }: PortfolioListProps) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 0, 0)
    }
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragEnd = async () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const updated = [...items]
      const [removed] = updated.splice(draggedIndex, 1)
      updated.splice(dragOverIndex, 0, removed)

      // Update order values
      const reordered = updated.map((item, i) => ({ ...item, order: i }))
      setItems(reordered)

      // Save to database
      setSaving(true)
      try {
        const res = await fetch('/api/admin/portfolio/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: reordered.map((item, i) => ({ id: item.id, order: i }))
          })
        })
        if (!res.ok) throw new Error('Reorder failed')
      } catch (err) {
        console.error('Failed to save order:', err)
        // Revert on error
        setItems(initialItems)
      } finally {
        setSaving(false)
      }
    }

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="bg-[#1E1E2E] border border-white/10 rounded-2xl overflow-hidden">
      {saving && (
        <div className="px-4 py-2 bg-[#A34BFF]/10 border-b border-[#A34BFF]/20 text-sm text-[#A34BFF] text-center">
          Volgorde opslaan...
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="w-10 p-4"></th>
            <th className="text-left p-4 text-white/60 font-medium">Thumbnail</th>
            <th className="text-left p-4 text-white/60 font-medium">Titel</th>
            <th className="text-left p-4 text-white/60 font-medium">Type</th>
            <th className="text-left p-4 text-white/60 font-medium">Media</th>
            <th className="text-left p-4 text-white/60 font-medium">Status</th>
            <th className="text-right p-4 text-white/60 font-medium">Acties</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`border-b border-white/5 transition-all cursor-move ${
                draggedIndex === index
                  ? 'opacity-40 bg-[#A34BFF]/5'
                  : dragOverIndex === index
                    ? 'bg-[#30A8FF]/10 border-[#30A8FF]/30'
                    : 'hover:bg-white/5'
              }`}
            >
              <td className="p-4">
                <div className="cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4 text-white/30" />
                </div>
              </td>
              <td className="p-4">
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </td>
              <td className="p-4">
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-white/40 text-sm">{item.slug}</p>
                </div>
              </td>
              <td className="p-4">
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">
                  {item.type}
                </span>
              </td>
              <td className="p-4 text-white/60">{item._count.media} files</td>
              <td className="p-4">
                {item.published ? (
                  <span className="flex items-center gap-2 text-green-400">
                    <Eye className="w-4 h-4" />
                    Gepubliceerd
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-white/40">
                    <EyeOff className="w-4 h-4" />
                    Concept
                  </span>
                )}
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/portfolio/${item.id}/edit`}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit className="w-4 h-4 text-white/60" />
                  </Link>
                  <DeletePortfolioButton itemId={item.id} itemTitle={item.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {items.length === 0 && (
        <div className="p-12 text-center text-white/40">
          <p>Nog geen portfolio items. Maak je eerste item aan!</p>
        </div>
      )}
    </div>
  )
}
