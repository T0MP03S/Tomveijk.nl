 'use client'

 import { usePathname } from 'next/navigation'
 import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname.startsWith('/admin/login')) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-[#1a0b2e]">
      <Sidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
