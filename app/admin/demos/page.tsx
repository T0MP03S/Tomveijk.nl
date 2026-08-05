import Link from 'next/link'
import { Plus, Eye, ExternalLink } from 'lucide-react'

import { prisma } from '@/lib/prisma'
import DemoLijst from '@/components/admin/DemoLijst'

export const dynamic = 'force-dynamic'

export default async function DemosPagina() {
  const prospects = await prisma.prospect.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: { select: { weergaves: true } },
      weergaves: { orderBy: { bekekenOp: 'desc' }, take: 1, select: { bekekenOp: true } },
    },
  })

  const klanten = prospects.filter((p) => p.status === 'KLANT')
  const omzet = klanten.reduce((t, p) => t + (p.bedrag ?? 0), 0)
  const perMaand = klanten.reduce((t, p) => t + (p.perMaand ?? 0), 0)

  // Wie zijn demo bekeek maar nog niet reageerde: dit is je belllijst, en de
  // hoogste conversie in het hele traject.
  const teBellen = prospects.filter(
    (p) => p._count.weergaves > 0 && ['GEMAILD', 'BEKEKEN'].includes(p.status),
  ).length

  const tegels = [
    { label: 'Prospects', waarde: String(prospects.length) },
    { label: 'Demo bekeken, nog geen reactie', waarde: String(teBellen), nadruk: teBellen > 0 },
    { label: 'Klanten', waarde: String(klanten.length) },
    { label: 'Omzet', waarde: `€${omzet.toLocaleString('nl-NL')}` },
    { label: 'Per maand', waarde: `€${perMaand.toLocaleString('nl-NL')}` },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] bg-clip-text text-4xl font-bold text-transparent">
            Demo&apos;s
          </h1>
          <p className="text-white/60">
            Je prospects, hun demopagina en waar het gesprek staat
          </p>
        </div>
        <Link
          href="/admin/demos/nieuw"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] px-6 py-3 text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-5 w-5" />
          Nieuwe demo
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {tegels.map((t) => (
          <div
            key={t.label}
            className={`rounded-xl border p-5 ${
              t.nadruk ? 'border-[#00D752]/40 bg-[#00D752]/5' : 'border-white/10 bg-white/[0.03]'
            }`}
          >
            <p className="text-sm text-white/50">{t.label}</p>
            <p
              className={`mt-1 text-2xl font-bold ${t.nadruk ? 'text-[#00D752]' : 'text-white'}`}
            >
              {t.waarde}
            </p>
          </div>
        ))}
      </div>

      {prospects.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <Eye className="mx-auto mb-4 h-10 w-10 text-white/25" />
          <p className="font-semibold text-white">Nog geen prospects</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
            Voeg een bedrijf toe, vul de demopagina en publiceer 'm. De link die je
            daarna krijgt zet je in je mail.
          </p>
          <Link
            href="/admin/demos/nieuw"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
          >
            <Plus className="h-4 w-4" />
            Eerste demo maken
          </Link>
        </div>
      ) : (
        <DemoLijst prospects={JSON.parse(JSON.stringify(prospects))} />
      )}

      <p className="flex items-center gap-2 text-xs text-white/35">
        <ExternalLink className="h-3.5 w-3.5" />
        Demopagina&apos;s staan op noindex en verschijnen dus nooit in Google.
      </p>
    </div>
  )
}
