import PortfolioForm from '@/components/admin/PortfolioForm'

export default function NewPortfolioPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] bg-clip-text text-transparent">
          Nieuw Portfolio Item
        </h1>
        <p className="text-white/60">Voeg een nieuw project toe aan je portfolio</p>
      </div>

      <div className="bg-[#1E1E2E] border border-white/10 rounded-2xl p-8">
        <PortfolioForm />
      </div>
    </div>
  )
}
