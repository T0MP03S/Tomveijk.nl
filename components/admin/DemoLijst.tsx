'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, ExternalLink, Copy, Check, Pencil, Trash2 } from 'lucide-react'

type Prospect = {
  id: string
  slug: string
  bedrijf: string
  branche: string
  plaats: string
  status: string
  bedrag: number | null
  perMaand: number | null
  gepubliceerd: boolean
  gemaildOp: string | null
  _count: { weergaves: number }
  weergaves: { bekekenOp: string }[]
}

/** Kleur per fase, zodat je in één oogopslag ziet waar iemand staat. */
const STATUS: Record<string, { label: string; klasse: string }> = {
  NIEUW: { label: 'Nieuw', klasse: 'bg-white/10 text-white/70' },
  DEMO_KLAAR: { label: 'Demo klaar', klasse: 'bg-sky-500/15 text-sky-300' },
  GEMAILD: { label: 'Gemaild', klasse: 'bg-amber-500/15 text-amber-300' },
  BEKEKEN: { label: 'Bekeken', klasse: 'bg-[#00D752]/15 text-[#00D752]' },
  GEREAGEERD: { label: 'Gereageerd', klasse: 'bg-[#00D752]/20 text-[#00D752]' },
  GESPREK: { label: 'In gesprek', klasse: 'bg-violet-500/20 text-violet-300' },
  KLANT: { label: 'Klant', klasse: 'bg-[#00D752] text-[#030310]' },
  AFGEWEZEN: { label: 'Afgewezen', klasse: 'bg-white/5 text-white/35' },
}

function datum(waarde: string | null) {
  if (!waarde) return '-'
  return new Date(waarde).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

export default function DemoLijst({ prospects }: { prospects: Prospect[] }) {
  const router = useRouter()
  const [gekopieerd, setGekopieerd] = useState<string | null>(null)
  const [bezig, setBezig] = useState<string | null>(null)

  const kopieer = async (slug: string) => {
    const url = `${window.location.origin}/demo/${slug}`
    await navigator.clipboard.writeText(url)
    setGekopieerd(slug)
    setTimeout(() => setGekopieerd(null), 1800)
  }

  const verwijder = async (p: Prospect) => {
    if (!confirm(`"${p.bedrijf}" verwijderen? Dit kan niet ongedaan gemaakt worden.`)) return
    setBezig(p.id)
    try {
      const res = await fetch(`/api/admin/demos/${p.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Verwijderen mislukt')
      router.refresh()
    } catch {
      alert('Verwijderen mislukt')
    } finally {
      setBezig(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.04] text-left text-xs tracking-wide text-white/50 uppercase">
          <tr>
            <th className="px-5 py-3 font-semibold">Bedrijf</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 font-semibold">Gemaild</th>
            <th className="px-5 py-3 font-semibold">Bekeken</th>
            <th className="px-5 py-3 font-semibold">Bedrag</th>
            <th className="px-5 py-3 text-right font-semibold">Acties</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {prospects.map((p) => {
            const status = STATUS[p.status] ?? STATUS.NIEUW
            const bekeken = p._count.weergaves > 0

            return (
              <tr key={p.id} className="transition hover:bg-white/[0.03]">
                <td className="px-5 py-4">
                  <p className="font-semibold text-white">{p.bedrijf}</p>
                  <p className="text-xs text-white/40">
                    {p.branche} · {p.plaats}
                    {!p.gepubliceerd && (
                      <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[0.65rem] font-semibold text-white/60">
                        concept
                      </span>
                    )}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${status.klasse}`}
                  >
                    {status.label}
                  </span>
                </td>

                <td className="px-5 py-4 text-white/60">{datum(p.gemaildOp)}</td>

                <td className="px-5 py-4">
                  {bekeken ? (
                    <span className="flex items-center gap-1.5 font-semibold text-[#00D752]">
                      <Eye className="h-4 w-4" />
                      {p._count.weergaves}×
                      <span className="ml-1 text-xs font-normal text-white/40">
                        {datum(p.weergaves[0]?.bekekenOp ?? null)}
                      </span>
                    </span>
                  ) : (
                    <span className="text-white/25">-</span>
                  )}
                </td>

                <td className="px-5 py-4 text-white/70">
                  {p.bedrag ? (
                    <>
                      €{p.bedrag.toLocaleString('nl-NL')}
                      {p.perMaand ? (
                        <span className="text-white/40"> + €{p.perMaand}/m</span>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-white/25">-</span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => kopieer(p.slug)}
                      title="Demolink kopiëren"
                      className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                    >
                      {gekopieerd === p.slug ? (
                        <Check className="h-4 w-4 text-[#00D752]" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <a
                      href={`/demo/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Demo openen"
                      className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Link
                      href={`/admin/demos/${p.id}`}
                      title="Bewerken"
                      className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => verwijder(p)}
                      disabled={bezig === p.id}
                      title="Verwijderen"
                      className="rounded-lg p-2 text-white/40 transition hover:bg-red-500/15 hover:text-red-400 disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
