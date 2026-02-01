'use client'

import { useEffect, useState } from 'react'
import { Mail, Trash2, Check, Clock, User, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/confirm-dialog'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const openDeleteDialog = (id: string) => {
    setMessageToDelete(id)
    setDeleteDialogOpen(true)
  }

  const deleteMessage = async () => {
    if (!messageToDelete) return
    
    setDeleting(true)
    try {
      await fetch(`/api/admin/messages/${messageToDelete}`, { method: 'DELETE' })
      setMessages(messages.filter(m => m.id !== messageToDelete))
      if (selectedMessage?.id === messageToDelete) {
        setSelectedMessage(null)
      }
      setDeleteDialogOpen(false)
      setMessageToDelete(null)
    } catch (error) {
      console.error('Failed to delete message:', error)
    } finally {
      setDeleting(false)
    }
  }

  const unreadCount = messages.filter(m => !m.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A34BFF]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Berichten</h1>
          <p className="text-white/60 mt-1">
            {unreadCount > 0 ? `${unreadCount} ongelezen bericht${unreadCount > 1 ? 'en' : ''}` : 'Geen ongelezen berichten'}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <Mail className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <p className="text-white/40">Nog geen berichten ontvangen</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Message List */}
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message)
                  if (!message.read) markAsRead(message.id)
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedMessage?.id === message.id
                    ? 'bg-[#A34BFF]/20 border-[#A34BFF]/50'
                    : message.read
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-[#A34BFF]/10 border-[#A34BFF]/30 hover:bg-[#A34BFF]/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!message.read && (
                        <span className="w-2 h-2 rounded-full bg-[#A34BFF]" />
                      )}
                      <span className="font-medium truncate">{message.name}</span>
                    </div>
                    <p className="text-white/60 text-sm truncate">{message.email}</p>
                    <p className="text-white/40 text-sm mt-1 line-clamp-2">{message.message}</p>
                  </div>
                  <div className="text-white/40 text-xs whitespace-nowrap">
                    {new Date(message.createdAt).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Detail */}
          {selectedMessage ? (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sticky top-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <User className="w-5 h-5 text-[#A34BFF]" />
                    {selectedMessage.name}
                  </h2>
                  <a 
                    href={`mailto:${selectedMessage.email}`}
                    className="text-[#30A8FF] hover:underline text-sm"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(selectedMessage.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
                <Clock className="w-4 h-4" />
                {new Date(selectedMessage.createdAt).toLocaleString('nl-NL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {selectedMessage.read && (
                  <span className="flex items-center gap-1 text-green-400 ml-2">
                    <Check className="w-4 h-4" />
                    Gelezen
                  </span>
                )}
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/80 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: Contact via portfolio&body=%0A%0A---%0AOrigineel bericht van ${selectedMessage.name}:%0A${encodeURIComponent(selectedMessage.message)}`}
                  className="bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Beantwoorden
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://mail.google.com/mail/?view=cm&to=${selectedMessage.email}&su=Re: Contact via portfolio`, '_blank')}
                  className="border-white/20 hover:bg-white/10"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Gmail
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 flex items-center justify-center text-white/40">
              <p>Selecteer een bericht om te lezen</p>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Bericht verwijderen"
        description="Weet je zeker dat je dit bericht wilt verwijderen? Dit kan niet ongedaan worden gemaakt."
        confirmText="Verwijderen"
        cancelText="Annuleren"
        onConfirm={deleteMessage}
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}
