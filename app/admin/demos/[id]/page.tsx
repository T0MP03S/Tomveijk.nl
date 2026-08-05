import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Eye } from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { leesDemo } from '@/lib/demo-bestand'
import DemoFormulier from '@/components/admin/DemoFormulier'

export const dynamic = 'force-dynamic'

export default async function DemoBewerkenPagina({ params }: { params: { id: string } }) {
  const prospect = await prisma.prospect.findUnique({
    where: { id: params.id },
    include: { weergaves: { orderBy: { bekekenOp: 'desc' }, take: 20 } },
  })

  if (!prospect) notFound()

  const demoBestaat = (await leesDemo(prospect.slug)) !== null

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
          {prospect.bedrijf}
        </h1>
        <p className="mt-1 text-white/50">/demo/{prospect.slug}</p>
      </div>

      {prospect.weergaves.length > 0 && (
        <section className="rounded-xl border border-[#00D752]/25 bg-[#00D752]/5 p-5">
          <p className="flex items-center gap-2 font-semibold text-[#00D752]">
            <Eye className="h-4 w-4" />
            {prospect.weergaves.length === 20 ? '20+' : prospect.weergaves.length} keer bekeken
          </p>
          <p className="mt-1 text-sm text-white/50">
            Laatst op{' '}
            {new Date(prospect.weergaves[0].bekekenOp).toLocaleString('nl-NL', {
              dateStyle: 'full',
              timeStyle: 'short',
            })}
            . Heeft nog niet gereageerd? Dit is het moment om te bellen.
          </p>
        </section>
      )}

      <DemoFormulier
        prospect={JSON.parse(JSON.stringify(prospect))}
        demoBestaat={demoBestaat}
      />
    </div>
  )
}
