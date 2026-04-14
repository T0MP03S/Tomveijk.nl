'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import ConfirmDialog from '@/components/ui/confirm-dialog'

interface DeletePortfolioButtonProps {
  itemId: string
  itemTitle: string
}

export default function DeletePortfolioButton({ itemId, itemTitle }: DeletePortfolioButtonProps) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/portfolio/${itemId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Delete failed')
      }

      setShowConfirm(false)
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </button>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Project verwijderen?"
        description={`Weet je zeker dat je "${itemTitle}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`}
        confirmText="Verwijderen"
        cancelText="Annuleren"
        onConfirm={handleDelete}
        variant="danger"
        loading={loading}
      />
    </>
  )
}
