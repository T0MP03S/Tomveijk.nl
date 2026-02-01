import Link from 'next/link'
import { Plus, Eye, EyeOff, Edit, Trash2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'

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
          <p className="text-white/60">Beheer je portfolio projecten</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] text-white rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Nieuw Item
        </Link>
      </div>

      <div className="bg-[#1E1E2E] border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-white/60 font-medium">Thumbnail</th>
              <th className="text-left p-4 text-white/60 font-medium">Titel</th>
              <th className="text-left p-4 text-white/60 font-medium">Type</th>
              <th className="text-left p-4 text-white/60 font-medium">Media</th>
              <th className="text-left p-4 text-white/60 font-medium">Status</th>
              <th className="text-right p-4 text-white/60 font-medium">Acties</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
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
                    >
                      <Edit className="w-4 h-4 text-white/60" />
                    </Link>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
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
    </div>
  )
}
