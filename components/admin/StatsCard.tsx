import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color?: string
}

export default function StatsCard({ title, value, icon: Icon, color = '#A34BFF' }: StatsCardProps) {
  return (
    <div className="bg-[#1E1E2E] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, border: `1px solid ${color}30` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-white/60 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  )
}
