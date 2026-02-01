'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface Skill {
  id: string
  title: string
  description: string
  icon: string
  color: string
  order: number
}

const ADOBE_ICONS = [
  { value: 'Ps', label: 'Photoshop', color: '#31A8FF' },
  { value: 'Ae', label: 'After Effects', color: '#9999FF' },
  { value: 'Ai', label: 'Illustrator', color: '#FF9A00' },
  { value: 'Pr', label: 'Premiere Pro', color: '#9999FF' },
  { value: 'Xd', label: 'XD', color: '#FF61F6' },
  { value: 'Id', label: 'InDesign', color: '#FF3366' },
]

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Ps',
    color: '#31A8FF',
    order: 0,
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/admin/skills')
      const data = await response.json()
      setSkills(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingSkill
        ? `/api/admin/skills/${editingSkill.id}`
        : '/api/admin/skills'
      
      const method = editingSkill ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save')

      await fetchSkills()
      setShowModal(false)
      resetForm()
    } catch (error) {
      console.error('Error saving skill:', error)
      alert('Opslaan mislukt')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze skill wilt verwijderen?')) return

    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete')

      await fetchSkills()
    } catch (error) {
      console.error('Error deleting skill:', error)
      alert('Verwijderen mislukt')
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      title: skill.title,
      description: skill.description,
      icon: skill.icon,
      color: skill.color,
      order: skill.order,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingSkill(null)
    setFormData({
      title: '',
      description: '',
      icon: 'Ps',
      color: '#31A8FF',
      order: skills.length,
    })
  }

  const handleIconChange = (iconValue: string) => {
    const icon = ADOBE_ICONS.find(i => i.value === iconValue)
    if (icon) {
      setFormData(prev => ({
        ...prev,
        icon: icon.value,
        color: icon.color
      }))
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] bg-clip-text text-transparent">
            Skills Beheren
          </h1>
          <p className="text-white/60">Beheer je vaardigheden en expertise</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-gradient-to-r from-[#A34BFF] to-[#30A8FF]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nieuwe Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-[#1E1E2E] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
                style={{
                  backgroundColor: `${skill.color}20`,
                  border: `2px solid ${skill.color}40`,
                  color: skill.color
                }}
              >
                {skill.icon}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(skill)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-white/60" />
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{skill.title}</h3>
            <p className="text-white/60 text-sm line-clamp-3">{skill.description}</p>
          </div>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-[#1E1E2E] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingSkill ? 'Skill Bewerken' : 'Nieuwe Skill'}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {editingSkill ? 'Pas de gegevens van deze skill aan.' : 'Maak een nieuwe skill aan.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="icon">Adobe Icon</Label>
              <select
                id="icon"
                value={formData.icon}
                onChange={(e) => handleIconChange(e.target.value)}
                className="w-full px-4 py-2 bg-[#0f0a1a] border border-white/10 rounded-lg text-white"
              >
                {ADOBE_ICONS.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.value} - {icon.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="description">Beschrijving</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                required
              />
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

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#A34BFF] to-[#30A8FF]"
              >
                {loading ? 'Opslaan...' : 'Opslaan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Annuleren
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
