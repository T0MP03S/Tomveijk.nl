import { FolderOpen, Award, Eye, CheckCircle } from 'lucide-react'
import StatsCard from '@/components/admin/StatsCard'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [totalPortfolio, publishedPortfolio, totalSkills] = await Promise.all([
    prisma.portfolioItem.count(),
    prisma.portfolioItem.count({ where: { published: true } }),
    prisma.skill.count(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-white/60">Overzicht van je portfolio website</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Totaal Portfolio Items"
          value={totalPortfolio}
          icon={FolderOpen}
          color="#A34BFF"
        />
        <StatsCard
          title="Gepubliceerd"
          value={publishedPortfolio}
          icon={CheckCircle}
          color="#00D752"
        />
        <StatsCard
          title="Concept"
          value={totalPortfolio - publishedPortfolio}
          icon={Eye}
          color="#30A8FF"
        />
        <StatsCard
          title="Skills"
          value={totalSkills}
          icon={Award}
          color="#FF9A00"
        />
      </div>

      <div className="bg-[#1E1E2E] border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Snelle acties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/portfolio/new"
            className="p-4 bg-gradient-to-r from-[#A34BFF]/20 to-[#30A8FF]/20 border border-[#A34BFF]/30 rounded-xl hover:border-[#A34BFF]/50 transition-all duration-200"
          >
            <h3 className="text-lg font-semibold text-white mb-1">Nieuw Portfolio Item</h3>
            <p className="text-white/60 text-sm">Voeg een nieuw project toe aan je portfolio</p>
          </a>
          <a
            href="/admin/skills"
            className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all duration-200"
          >
            <h3 className="text-lg font-semibold text-white mb-1">Skills Beheren</h3>
            <p className="text-white/60 text-sm">Bewerk je vaardigheden en expertise</p>
          </a>
        </div>
      </div>
    </div>
  )
}
