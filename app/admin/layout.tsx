 'use client'

 import { usePathname } from 'next/navigation'
 import Sidebar from '@/components/admin/Sidebar'
 import { ToastProvider } from '@/components/ui/toast-notification'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname.startsWith('/admin/login')) {
    return <ToastProvider>{children}</ToastProvider>
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#1a0b2e]">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}
