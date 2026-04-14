import Link from 'next/link'
import { Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import PortfolioList from '@/components/admin/PortfolioList'

export const dynamic = 'force-dynamic'

export default async function PortfolioListPage() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { media: true }
      }
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] bg-clip-text text-transparent">
            Portfolio Items
          </h1>
          <p className="text-white/60">Beheer je portfolio projecten — sleep items om de volgorde aan te passen</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] text-white rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Nieuw Item
        </Link>
      </div>

      <PortfolioList initialItems={JSON.parse(JSON.stringify(items))} />
    </div>
  )
}
