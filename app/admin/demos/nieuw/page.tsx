import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import DemoFormulier from '@/components/admin/DemoFormulier'

export default function NieuweDemoPagina() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/demos"
          className="mb-4 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar demo&apos;s
        </Link>
        <h1 className="bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] bg-clip-text text-4xl font-bold text-transparent">
          Nieuwe demo
        </h1>
      </div>

      <DemoFormulier />
    </div>
  )
}
