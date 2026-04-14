'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, FileDown } from 'lucide-react'
import { useToast } from '@/components/ui/toast-notification'

export interface FileUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  label?: string
  accept?: string
}

export default function FileUpload({ onUpload, currentImage, label = 'Upload afbeelding', accept }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = accept
      ? accept.split(',').map(t => t.trim())
      : ['image/*']
    const isAllowed = allowedTypes.some(t => {
      if (t.endsWith('/*')) return file.type.startsWith(t.replace('/*', '/'))
      if (t.startsWith('.')) return file.name.toLowerCase().endsWith(t)
      return file.type === t
    })
    if (!isAllowed) {
      showToast('Dit bestandstype is niet toegestaan', 'warning')
      return
    }
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      const url = isPdf ? data.original : data.medium
      setPreview(url)
      onUpload(url)
    } catch (error) {
      console.error('Upload error:', error)
      showToast('Upload mislukt. Probeer het opnieuw.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">{label}</label>
      
      {preview ? (
        <div className="relative group">
          {preview.toLowerCase().endsWith('.pdf') ? (
            <div className="w-full h-32 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <FileDown className="w-10 h-10 text-[#30A8FF] mb-2" />
              <p className="text-white/60 text-sm truncate max-w-[200px]">{preview.split('/').pop()}</p>
            </div>
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-contain rounded-xl border border-white/10 bg-white/5 p-2"
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-[#A34BFF]/50 hover:bg-white/5 transition-all cursor-pointer"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-[#A34BFF] border-t-transparent rounded-full animate-spin" />
              <p className="text-white/60">Uploaden...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-12 h-12 text-white/40" />
              <p className="text-white/60">Klik om een afbeelding te uploaden</p>
              <p className="text-white/40 text-sm">Max 10MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept || 'image/*'}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
