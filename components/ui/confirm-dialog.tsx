'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash2, Info } from 'lucide-react'

type DialogVariant = 'danger' | 'warning' | 'info'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  variant?: DialogVariant
  loading?: boolean
}

const variantStyles = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    confirmBg: 'bg-red-500 hover:bg-red-600',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    confirmBg: 'bg-amber-500 hover:bg-amber-600',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    confirmBg: 'bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] hover:opacity-90',
  },
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Bevestigen',
  cancelText = 'Annuleren',
  onConfirm,
  onCancel,
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const styles = variantStyles[variant]
  const Icon = styles.icon

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-transparent border-none shadow-none p-0">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Glass effect layers */}
          <div className="absolute inset-0 backdrop-blur-xl bg-[#1E1E2E]/95 border border-white/10" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 p-6">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-full ${styles.iconBg} flex items-center justify-center mb-4`}>
                <Icon className={`w-8 h-8 ${styles.iconColor}`} />
              </div>

              <DialogHeader className="space-y-2">
                <DialogTitle className="text-xl font-bold text-white">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-white/60 text-sm">
                  {description}
                </DialogDescription>
              </DialogHeader>

              {/* Actions */}
              <div className="flex gap-3 mt-6 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 border-white/20 hover:bg-white/10"
                >
                  {cancelText}
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  className={`flex-1 text-white border-none ${styles.confirmBg}`}
                >
                  {loading ? 'Bezig...' : confirmText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
