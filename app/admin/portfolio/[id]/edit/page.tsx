import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PortfolioForm from '@/components/admin/PortfolioForm'

export default async function EditPortfolioPage({ params }: { params: { id: string } }) {
  const item = await prisma.portfolioItem.findUnique({
    where: { id: params.id },
    include: {
      media: {
        orderBy: { order: 'asc' }
      },
      blocks: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!item) {
    notFound()
  }

  const formData = {
    ...item,
    embedUrl: item.embedUrl || undefined,
    embeds: item.media.filter((m) => m.type === 'EMBED').map((m) => m.url),
    projectDate: item.projectDate ? new Date(item.projectDate).toISOString().split('T')[0] : '',
    blocks: item.blocks.map((b) => ({
      id: b.id,
      type: b.type as any,
      order: b.order,
      content: typeof b.content === 'string' ? JSON.parse(b.content) : b.content
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] bg-clip-text text-transparent">
          Portfolio Item Bewerken
        </h1>
        <p className="text-white/60">Pas je project aan</p>
      </div>

      <div className="bg-[#1E1E2E] border border-white/10 rounded-2xl p-8">
        <PortfolioForm initialData={formData} />
      </div>
    </div>
  )
}
