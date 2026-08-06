'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'

import { PROSPECT_STATUSSEN } from '@/lib/validation'

/**
 * Beheer van één prospect.
 *
 * De demopagina zelf staat als los bestand in demos/<slug>.html en wordt niet
 * hier bewerkt, want elke demo is een eigen ontwerp. Dit formulier gaat over de
 * bedrijfsgegevens, je verkoopadministratie en de verkoopbalk.
 */

const invoer =
  'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition focus:border-[#30A8FF] focus:bg-white/[0.07]'

function Veld({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold tracking-wide text-white/60 uppercase">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-white/35">{hint}</span>}
    </label>
  )
}

function Kaart({
  titel,
  uitleg,
  children,
}: {
  titel: string
  uitleg?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
      <h2 className="text-lg font-bold text-white">{titel}</h2>
      {uitleg && <p className="mt-1 text-sm text-white/45">{uitleg}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

/** "Café Jansen & Zn." -> "cafe-jansen-zn" */
const ACCENTEN = new RegExp('[\\u0300-\\u036f]', 'g')
function slugify(tekst: string): string {
  return tekst
    .toLowerCase()
    .normalize('NFD')
    .replace(ACCENTEN, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type Waarden = Record<string, any>

export default function DemoFormulier({
  prospect,
  demoBestaat = false,
}: {
  prospect?: Waarden
  demoBestaat?: boolean
}) {
  const router = useRouter()
  const bewerken = Boolean(prospect?.id)

  const [v, setV] = useState<Waarden>(() => ({
    slug: prospect?.slug ?? '',
    bedrijf: prospect?.bedrijf ?? '',
    branche: prospect?.branche ?? '',
    plaats: prospect?.plaats ?? '',
    regio: prospect?.regio ?? '',
    huidigeSite: prospect?.huidigeSite ?? '',
    contact: prospect?.contact ?? '',
    email: prospect?.email ?? '',
    telefoon: prospect?.telefoon ?? '',
    status: prospect?.status ?? 'NIEUW',
    pakket: prospect?.pakket ?? '',
    // Leeg bij een nieuw prospect: er is nog niets afgesproken, dus een
    // ingevuld bedrag zou een deal suggereren die niet bestaat.
    bedrag: prospect?.bedrag ?? '',
    perMaand: prospect?.perMaand ?? '',
    gemaildOp: prospect?.gemaildOp ? String(prospect.gemaildOp).slice(0, 10) : '',
    opgevolgdOp: prospect?.opgevolgdOp ? String(prospect.opgevolgdOp).slice(0, 10) : '',
    gereageerdOp: prospect?.gereageerdOp ? String(prospect.gereageerdOp).slice(0, 10) : '',
    notitie: prospect?.notitie ?? '',
    gepubliceerd: prospect?.gepubliceerd ?? false,
    pitchActief: prospect?.pitchActief ?? true,
    pitchPrijs: prospect?.pitchPrijs ?? 750,
    pitchPerMaand: prospect?.pitchPerMaand ?? 20,
  }))

  const [bezig, setBezig] = useState(false)
  const [fout, setFout] = useState<string | null>(null)
  const [slugHandmatig, setSlugHandmatig] = useState(bewerken)

  const zet = (patch: Waarden) => setV((oud) => ({ ...oud, ...patch }))

  const getal = (x: unknown) => (x === '' || x === null ? null : Number(x))

  const opslaan = async (e: React.FormEvent) => {
    e.preventDefault()
    setBezig(true)
    setFout(null)

    try {
      const res = await fetch(
        bewerken ? `/api/admin/demos/${prospect!.id}` : '/api/admin/demos',
        {
          method: bewerken ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...v,
            bedrag: getal(v.bedrag),
            perMaand: getal(v.perMaand),
            pitchPrijs: Number(v.pitchPrijs),
            pitchPerMaand: Number(v.pitchPerMaand),
          }),
        },
      )

      const antwoord = await res.json()
      if (!res.ok) {
        setFout(
          typeof antwoord.error === 'string'
            ? antwoord.error
            : (antwoord.error
                ?.map((f: any) => `${f.path?.join('.')}: ${f.message}`)
                .join('\n') ?? 'Opslaan mislukt'),
        )
        return
      }

      router.push('/admin/demos')
      router.refresh()
    } catch {
      setFout('Opslaan mislukt, controleer je verbinding')
    } finally {
      setBezig(false)
    }
  }

  return (
    <form onSubmit={opslaan} className="space-y-6 pb-24">
      {fout && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm whitespace-pre-line text-red-300">
          {fout}
        </div>
      )}

      {/* ---------------- De pagina ---------------- */}
      <section
        className={`rounded-xl border p-6 ${
          demoBestaat
            ? 'border-[#00D752]/25 bg-[#00D752]/5'
            : 'border-amber-500/25 bg-amber-500/5'
        }`}
      >
        <h2 className="text-lg font-bold text-white">De demopagina</h2>
        {demoBestaat ? (
          <p className="mt-1 text-sm text-white/60">
            <code className="rounded bg-black/30 px-1.5 py-0.5 text-[#00D752]">
              demos/{v.slug}.html
            </code>{' '}
            staat klaar. Zet hieronder &quot;publiceren&quot; aan om de link bereikbaar te
            maken.
          </p>
        ) : (
          <p className="mt-1 text-sm text-white/60">
            Er is nog geen <code className="rounded bg-black/30 px-1.5 py-0.5">
              demos/{v.slug || '<slug>'}.html
            </code>. Stuur de URL van dit bedrijf naar Claude Code, dan wordt de pagina
            ontworpen en als bestand toegevoegd.
          </p>
        )}
      </section>

      {/* ---------------- Bedrijf ---------------- */}
      <Kaart titel="Bedrijf">
        <div className="grid gap-4 sm:grid-cols-2">
          <Veld label="Bedrijfsnaam">
            <input
              className={invoer}
              required
              value={v.bedrijf}
              onChange={(e) => {
                zet({ bedrijf: e.target.value })
                if (!slugHandmatig) zet({ slug: slugify(e.target.value) })
              }}
            />
          </Veld>
          <Veld label="Slug" hint={v.slug ? `/demo/${v.slug}` : 'Wordt de URL en de bestandsnaam'}>
            <input
              className={invoer}
              required
              value={v.slug}
              onChange={(e) => {
                setSlugHandmatig(true)
                zet({ slug: slugify(e.target.value) })
              }}
            />
          </Veld>
          <Veld label="Branche" hint="Bijvoorbeeld: hovenier">
            <input
              className={invoer}
              required
              value={v.branche}
              onChange={(e) => zet({ branche: e.target.value })}
            />
          </Veld>
          <Veld label="Plaats">
            <input
              className={invoer}
              required
              value={v.plaats}
              onChange={(e) => zet({ plaats: e.target.value })}
            />
          </Veld>
          <Veld label="Regio" hint="Zoals je het in de mail noemt: 'Baarn en omstreken'">
            <input
              className={invoer}
              required
              value={v.regio}
              onChange={(e) => zet({ regio: e.target.value })}
            />
          </Veld>
          <Veld label="Huidige website" hint="De site die je naar Claude Code stuurt">
            <input
              className={invoer}
              type="url"
              placeholder="https://"
              value={v.huidigeSite}
              onChange={(e) => zet({ huidigeSite: e.target.value })}
            />
          </Veld>
        </div>
      </Kaart>

      {/* ---------------- Contact ---------------- */}
      <Kaart titel="Contactpersoon">
        <div className="grid gap-4 sm:grid-cols-3">
          <Veld label="Naam">
            <input
              className={invoer}
              value={v.contact}
              onChange={(e) => zet({ contact: e.target.value })}
            />
          </Veld>
          <Veld label="E-mail">
            <input
              className={invoer}
              type="email"
              value={v.email}
              onChange={(e) => zet({ email: e.target.value })}
            />
          </Veld>
          <Veld label="Telefoon">
            <input
              className={invoer}
              value={v.telefoon}
              onChange={(e) => zet({ telefoon: e.target.value })}
            />
          </Veld>
        </div>
      </Kaart>

      {/*
        Administratie en verkoopbalk verschijnen pas bij het bewerken. Bij het
        aanmaken van een prospect is er nog geen gesprek, geen pakket en geen
        bedrag. Die velden dan al tonen vraagt om informatie die niet bestaat.
      */}
      {!bewerken && (
        <p className="px-1 text-sm text-white/40">
          Status, pakket, bedragen en notities vul je later in, zodra er iets te
          noteren valt. Dit prospect start op <span className="text-white/70">nieuw</span>.
        </p>
      )}

      {bewerken && (
        <>
      {/* ---------------- Administratie ---------------- */}
      <Kaart titel="Administratie" uitleg="Waar staat het gesprek, en wat heb je afgesproken?">
        <div className="grid gap-4 sm:grid-cols-3">
          <Veld label="Status">
            <select
              className={invoer}
              value={v.status}
              onChange={(e) => zet({ status: e.target.value })}
            >
              {PROSPECT_STATUSSEN.map((s) => (
                <option key={s} value={s} className="bg-[#0b0b18]">
                  {s.replace('_', ' ').toLowerCase()}
                </option>
              ))}
            </select>
          </Veld>
          <Veld label="Pakket">
            <select
              className={invoer}
              value={v.pakket}
              onChange={(e) => zet({ pakket: e.target.value })}
            >
              <option value="" className="bg-[#0b0b18]">
                Geen
              </option>
              <option value="BASIS" className="bg-[#0b0b18]">
                Basis
              </option>
              <option value="COMPLEET" className="bg-[#0b0b18]">
                Compleet
              </option>
              <option value="MAATWERK" className="bg-[#0b0b18]">
                Maatwerk
              </option>
            </select>
          </Veld>
          <div className="grid grid-cols-2 gap-3">
            <Veld label="Bedrag">
              <input
                className={invoer}
                type="number"
                value={v.bedrag ?? ''}
                onChange={(e) => zet({ bedrag: e.target.value })}
              />
            </Veld>
            <Veld label="Per maand">
              <input
                className={invoer}
                type="number"
                value={v.perMaand ?? ''}
                onChange={(e) => zet({ perMaand: e.target.value })}
              />
            </Veld>
          </div>
          <Veld label="Gemaild op">
            <input
              className={invoer}
              type="date"
              value={v.gemaildOp}
              onChange={(e) => zet({ gemaildOp: e.target.value })}
            />
          </Veld>
          <Veld label="Opgevolgd op">
            <input
              className={invoer}
              type="date"
              value={v.opgevolgdOp}
              onChange={(e) => zet({ opgevolgdOp: e.target.value })}
            />
          </Veld>
          <Veld label="Gereageerd op">
            <input
              className={invoer}
              type="date"
              value={v.gereageerdOp}
              onChange={(e) => zet({ gereageerdOp: e.target.value })}
            />
          </Veld>
        </div>
        <div className="mt-4">
          <Veld label="Notitie">
            <textarea
              className={invoer}
              rows={3}
              value={v.notitie}
              onChange={(e) => zet({ notitie: e.target.value })}
              placeholder="Wat is er besproken, wanneer terugbellen…"
            />
          </Veld>
        </div>
      </Kaart>

      {/* ---------------- Verkoopbalk ---------------- */}
      <Kaart
        titel="Verkoopbalk"
        uitleg="De balk onderaan de demo met je aanbod. Zet 'm uit zodra iemand klant wordt, dan is het een gewone site."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Veld label="Actief">
            <select
              className={invoer}
              value={v.pitchActief ? 'ja' : 'nee'}
              onChange={(e) => zet({ pitchActief: e.target.value === 'ja' })}
            >
              <option value="ja" className="bg-[#0b0b18]">
                Aan
              </option>
              <option value="nee" className="bg-[#0b0b18]">
                Uit
              </option>
            </select>
          </Veld>
          <Veld label="Prijs">
            <input
              className={invoer}
              type="number"
              value={v.pitchPrijs}
              onChange={(e) => zet({ pitchPrijs: e.target.value })}
            />
          </Veld>
          <Veld label="Per maand">
            <input
              className={invoer}
              type="number"
              value={v.pitchPerMaand}
              onChange={(e) => zet({ pitchPerMaand: e.target.value })}
            />
          </Veld>
        </div>
      </Kaart>
        </>
      )}

      {/* ---------------- Opslaan ---------------- */}
      <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-[#05050f]/95 backdrop-blur lg:left-64">
        <div className="flex items-center justify-between gap-4 px-8 py-4">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/70">
            <input
              type="checkbox"
              checked={v.gepubliceerd}
              onChange={(e) => zet({ gepubliceerd: e.target.checked })}
              className="h-4 w-4 accent-[#00D752]"
            />
            Publiceren
            <span className="text-white/35">pas dan is de link bereikbaar</span>
          </label>

          <div className="flex items-center gap-3">
            {bewerken && v.gepubliceerd && demoBestaat && (
              <a
                href={`/demo/${v.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white/60 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Bekijken
              </a>
            )}
            <button
              type="submit"
              disabled={bezig}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] px-7 py-2.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {bezig && <Loader2 className="h-4 w-4 animate-spin" />}
              {bewerken ? 'Opslaan' : 'Aanmaken'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
