'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Plus, Trash2, ExternalLink, Loader2 } from 'lucide-react'

import { PROSPECT_STATUSSEN } from '@/lib/validation'
import { slugify } from '@/lib/demo-kleur'

/* --------------------------------------------------------------------------
   Kleine bouwstenen. Het formulier is groot, dus alles wat zich herhaalt staat
   hier één keer.
   -------------------------------------------------------------------------- */

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
      {uitleg && <p className="mt-1 mb-5 text-sm text-white/45">{uitleg}</p>}
      <div className={uitleg ? '' : 'mt-5'}>{children}</div>
    </section>
  )
}

/** Herhaalbare rij met toevoegen- en verwijderknop. */
function Lijst<T>({
  items,
  onChange,
  nieuw,
  knop,
  render,
}: {
  items: T[]
  onChange: (items: T[]) => void
  nieuw: () => T
  knop: string
  render: (item: T, wijzig: (patch: Partial<T>) => void, index: number) => React.ReactNode
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">
            {render(item, (patch) => {
              const kopie = [...items]
              kopie[i] = { ...kopie[i], ...patch }
              onChange(kopie)
            }, i)}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="mt-1 rounded-lg p-2 text-white/30 transition hover:bg-red-500/15 hover:text-red-400"
            title="Verwijderen"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, nieuw()])}
        className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        <Plus className="h-4 w-4" />
        {knop}
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

type Waarden = Record<string, any>

const LEGE_INHOUD = {
  thema: { primair: '#3f6b4a', accent: '#c08a3e', donker: '#111827', zacht: '#f6f7f5', koppen: 'sans' },
  logo: '',
  hero: { kop: '', tekst: '', afbeelding: '', primaireKnop: 'Vraag een offerte aan' },
  usps: [],
  diensten: { kop: 'Wat wij doen', intro: '', items: [] },
  projecten: { kop: 'Ons werk', intro: '', items: [] },
  over: { kop: 'Over ons', tekst: [''], afbeelding: '' },
  reviews: [],
  openingstijden: [],
  adres: { straat: '', postcode: '', plaats: '' },
  kvk: '',
  contact: { kop: 'Neem contact op', tekst: '' },
  pitch: { actief: true, prijs: 750, perMaand: 20, jouwEmail: 'info@tomveijk.nl', jouwTelefoon: '' },
}

export default function DemoFormulier({ prospect }: { prospect?: Waarden }) {
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
    bedrag: prospect?.bedrag ?? 750,
    perMaand: prospect?.perMaand ?? 20,
    gemaildOp: prospect?.gemaildOp ? String(prospect.gemaildOp).slice(0, 10) : '',
    gereageerdOp: prospect?.gereageerdOp ? String(prospect.gereageerdOp).slice(0, 10) : '',
    notitie: prospect?.notitie ?? '',
    gepubliceerd: prospect?.gepubliceerd ?? false,
  }))

  const [inhoud, setInhoud] = useState<Waarden>(() => {
    if (!prospect?.inhoud) return structuredClone(LEGE_INHOUD)
    try {
      return { ...structuredClone(LEGE_INHOUD), ...JSON.parse(prospect.inhoud) }
    } catch {
      return structuredClone(LEGE_INHOUD)
    }
  })

  const [bezig, setBezig] = useState(false)
  const [fout, setFout] = useState<string | null>(null)

  const zet = (patch: Waarden) => setV((oud) => ({ ...oud, ...patch }))
  const zetInhoud = (patch: Waarden) => setInhoud((oud) => ({ ...oud, ...patch }))

  // De slug volgt de bedrijfsnaam tot je hem zelf aanpast; daarna blijft hij staan.
  const [slugHandmatig, setSlugHandmatig] = useState(bewerken)

  const opslaan = async (e: React.FormEvent) => {
    e.preventDefault()
    setBezig(true)
    setFout(null)

    // Lege optionele blokken eruit, anders faalt de validatie op halve objecten.
    const schoon = {
      ...inhoud,
      adres: inhoud.adres?.straat ? inhoud.adres : undefined,
      over: inhoud.over?.tekst?.some((t: string) => t.trim()) ? inhoud.over : undefined,
      projecten: inhoud.projecten?.items?.length ? inhoud.projecten : undefined,
    }

    try {
      const res = await fetch(
        bewerken ? `/api/admin/demos/${prospect!.id}` : '/api/admin/demos',
        {
          method: bewerken ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...v,
            bedrag: v.bedrag === '' ? null : Number(v.bedrag),
            perMaand: v.perMaand === '' ? null : Number(v.perMaand),
            inhoud: schoon,
          }),
        },
      )

      const antwoord = await res.json()
      if (!res.ok) {
        setFout(
          typeof antwoord.error === 'string'
            ? antwoord.error
            : antwoord.error?.map((f: any) => `${f.path?.join('.')}: ${f.message}`).join('\n') ??
                'Opslaan mislukt',
        )
        return
      }

      router.push('/admin/demos')
      router.refresh()
    } catch {
      setFout('Opslaan mislukt — controleer je verbinding')
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

      {/* ---------------- Bedrijf ---------------- */}
      <Kaart titel="Bedrijf" uitleg="De basisgegevens van de prospect.">
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
          <Veld label="Slug" hint={v.slug ? `/demo/${v.slug}` : 'Wordt de URL van de demo'}>
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
          <Veld label="Regio" hint="Zoals het op de demo komt: 'Baarn en omstreken'">
            <input
              className={invoer}
              required
              value={v.regio}
              onChange={(e) => zet({ regio: e.target.value })}
            />
          </Veld>
          <Veld label="Huidige website" hint="Alleen voor jezelf, staat niet op de demo">
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
      <Kaart titel="Contactgegevens" uitleg="Telefoon en e-mail komen ook op de demopagina te staan.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Veld label="Contactpersoon">
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
              <option value="" className="bg-[#0b0b18]">—</option>
              <option value="BASIS" className="bg-[#0b0b18]">Basis</option>
              <option value="COMPLEET" className="bg-[#0b0b18]">Compleet</option>
              <option value="MAATWERK" className="bg-[#0b0b18]">Maatwerk</option>
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

      {/* ---------------- Vormgeving ---------------- */}
      <Kaart
        titel="Vormgeving"
        uitleg="Pak de kleuren van hun logo of huidige site. Tekstkleuren worden automatisch berekend, dus een felle kleur levert nooit onleesbare knoppen op."
      >
        <div className="grid gap-4 sm:grid-cols-5">
          {(['primair', 'accent', 'donker', 'zacht'] as const).map((k) => (
            <Veld key={k} label={k}>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="h-9 w-10 shrink-0 cursor-pointer rounded border border-white/10 bg-transparent"
                  value={inhoud.thema[k]}
                  onChange={(e) => zetInhoud({ thema: { ...inhoud.thema, [k]: e.target.value } })}
                />
                <input
                  className={invoer}
                  value={inhoud.thema[k]}
                  onChange={(e) => zetInhoud({ thema: { ...inhoud.thema, [k]: e.target.value } })}
                />
              </div>
            </Veld>
          ))}
          <Veld label="Koppen">
            <select
              className={invoer}
              value={inhoud.thema.koppen}
              onChange={(e) => zetInhoud({ thema: { ...inhoud.thema, koppen: e.target.value } })}
            >
              <option value="sans" className="bg-[#0b0b18]">Zakelijk</option>
              <option value="serif" className="bg-[#0b0b18]">Ambachtelijk</option>
            </select>
          </Veld>
        </div>
        <div className="mt-4">
          <Veld label="Logo" hint="Pad naar een geüpload bestand, bijvoorbeeld /api/uploads/…">
            <input
              className={invoer}
              value={inhoud.logo}
              onChange={(e) => zetInhoud({ logo: e.target.value })}
            />
          </Veld>
        </div>
      </Kaart>

      {/* ---------------- Hero ---------------- */}
      <Kaart titel="Hero" uitleg="Het eerste dat ze zien. Hier valt of staat de demo.">
        <div className="space-y-4">
          <Veld label="Kop">
            <input
              className={invoer}
              value={inhoud.hero.kop}
              onChange={(e) => zetInhoud({ hero: { ...inhoud.hero, kop: e.target.value } })}
              placeholder="Een tuin waar u jarenlang plezier van heeft"
            />
          </Veld>
          <Veld label="Tekst">
            <textarea
              className={invoer}
              rows={3}
              value={inhoud.hero.tekst}
              onChange={(e) => zetInhoud({ hero: { ...inhoud.hero, tekst: e.target.value } })}
            />
          </Veld>
          <div className="grid gap-4 sm:grid-cols-2">
            <Veld label="Achtergrondfoto" hint="Download hun foto en upload 'm — nooit hotlinken">
              <input
                className={invoer}
                value={inhoud.hero.afbeelding}
                onChange={(e) =>
                  zetInhoud({ hero: { ...inhoud.hero, afbeelding: e.target.value } })
                }
              />
            </Veld>
            <Veld label="Knoptekst">
              <input
                className={invoer}
                value={inhoud.hero.primaireKnop}
                onChange={(e) =>
                  zetInhoud({ hero: { ...inhoud.hero, primaireKnop: e.target.value } })
                }
              />
            </Veld>
          </div>
        </div>
      </Kaart>

      {/* ---------------- USP's ---------------- */}
      <Kaart titel="Vertrouwenspunten" uitleg="Maximaal drie. Jaren ervaring, vaste prijs, vast aanspreekpunt.">
        <Lijst
          items={inhoud.usps}
          onChange={(usps) => zetInhoud({ usps })}
          nieuw={() => ({ titel: '', tekst: '' })}
          knop="Punt toevoegen"
          render={(item: any, wijzig) => (
            <div className="grid gap-2 sm:grid-cols-[1fr_2fr]">
              <input
                className={invoer}
                placeholder="Titel"
                value={item.titel}
                onChange={(e) => wijzig({ titel: e.target.value })}
              />
              <input
                className={invoer}
                placeholder="Toelichting"
                value={item.tekst}
                onChange={(e) => wijzig({ tekst: e.target.value })}
              />
            </div>
          )}
        />
      </Kaart>

      {/* ---------------- Diensten ---------------- */}
      <Kaart titel="Diensten">
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <Veld label="Kop">
            <input
              className={invoer}
              value={inhoud.diensten.kop}
              onChange={(e) => zetInhoud({ diensten: { ...inhoud.diensten, kop: e.target.value } })}
            />
          </Veld>
          <Veld label="Intro">
            <input
              className={invoer}
              value={inhoud.diensten.intro}
              onChange={(e) =>
                zetInhoud({ diensten: { ...inhoud.diensten, intro: e.target.value } })
              }
            />
          </Veld>
        </div>
        <Lijst
          items={inhoud.diensten.items}
          onChange={(items) => zetInhoud({ diensten: { ...inhoud.diensten, items } })}
          nieuw={() => ({ titel: '', tekst: '', afbeelding: '' })}
          knop="Dienst toevoegen"
          render={(item: any, wijzig) => (
            <div className="space-y-2 rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <input
                className={invoer}
                placeholder="Titel"
                value={item.titel}
                onChange={(e) => wijzig({ titel: e.target.value })}
              />
              <textarea
                className={invoer}
                rows={2}
                placeholder="Omschrijving"
                value={item.tekst}
                onChange={(e) => wijzig({ tekst: e.target.value })}
              />
              <input
                className={invoer}
                placeholder="Foto (optioneel)"
                value={item.afbeelding}
                onChange={(e) => wijzig({ afbeelding: e.target.value })}
              />
            </div>
          )}
        />
      </Kaart>

      {/* ---------------- Projecten ---------------- */}
      <Kaart titel="Projecten" uitleg="De eerste foto wordt automatisch groter weergegeven.">
        <Lijst
          items={inhoud.projecten.items}
          onChange={(items) => zetInhoud({ projecten: { ...inhoud.projecten, items } })}
          nieuw={() => ({ titel: '', afbeelding: '' })}
          knop="Project toevoegen"
          render={(item: any, wijzig) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className={invoer}
                placeholder="Titel, bijv. 'Achtertuin met vlonder — Soest'"
                value={item.titel}
                onChange={(e) => wijzig({ titel: e.target.value })}
              />
              <input
                className={invoer}
                placeholder="Foto"
                value={item.afbeelding}
                onChange={(e) => wijzig({ afbeelding: e.target.value })}
              />
            </div>
          )}
        />
      </Kaart>

      {/* ---------------- Over ons ---------------- */}
      <Kaart titel="Over ons">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Veld label="Kop">
              <input
                className={invoer}
                value={inhoud.over.kop}
                onChange={(e) => zetInhoud({ over: { ...inhoud.over, kop: e.target.value } })}
              />
            </Veld>
            <Veld label="Foto">
              <input
                className={invoer}
                value={inhoud.over.afbeelding}
                onChange={(e) => zetInhoud({ over: { ...inhoud.over, afbeelding: e.target.value } })}
              />
            </Veld>
          </div>
          <Veld label="Alinea's" hint="Eén regel per alinea">
            <textarea
              className={invoer}
              rows={5}
              value={(inhoud.over.tekst ?? []).join('\n\n')}
              onChange={(e) =>
                zetInhoud({
                  over: { ...inhoud.over, tekst: e.target.value.split('\n\n').filter(Boolean) },
                })
              }
            />
          </Veld>
        </div>
      </Kaart>

      {/* ---------------- Reviews & tijden ---------------- */}
      <Kaart titel="Reviews">
        <Lijst
          items={inhoud.reviews}
          onChange={(reviews) => zetInhoud({ reviews })}
          nieuw={() => ({ naam: '', plaats: '', tekst: '', sterren: 5 })}
          knop="Review toevoegen"
          render={(item: any, wijzig) => (
            <div className="space-y-2 rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div className="grid gap-2 sm:grid-cols-[2fr_2fr_1fr]">
                <input
                  className={invoer}
                  placeholder="Naam"
                  value={item.naam}
                  onChange={(e) => wijzig({ naam: e.target.value })}
                />
                <input
                  className={invoer}
                  placeholder="Plaats"
                  value={item.plaats}
                  onChange={(e) => wijzig({ plaats: e.target.value })}
                />
                <input
                  className={invoer}
                  type="number"
                  min={1}
                  max={5}
                  value={item.sterren}
                  onChange={(e) => wijzig({ sterren: Number(e.target.value) })}
                />
              </div>
              <textarea
                className={invoer}
                rows={2}
                placeholder="Wat schreven ze?"
                value={item.tekst}
                onChange={(e) => wijzig({ tekst: e.target.value })}
              />
            </div>
          )}
        />
      </Kaart>

      <Kaart titel="Openingstijden en adres">
        <Lijst
          items={inhoud.openingstijden}
          onChange={(openingstijden) => zetInhoud({ openingstijden })}
          nieuw={() => ({ dag: '', tijd: '' })}
          knop="Regel toevoegen"
          render={(item: any, wijzig) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className={invoer}
                placeholder="Maandag t/m vrijdag"
                value={item.dag}
                onChange={(e) => wijzig({ dag: e.target.value })}
              />
              <input
                className={invoer}
                placeholder="07:30 – 17:00"
                value={item.tijd}
                onChange={(e) => wijzig({ tijd: e.target.value })}
              />
            </div>
          )}
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          <Veld label="Straat">
            <input
              className={invoer}
              value={inhoud.adres.straat}
              onChange={(e) => zetInhoud({ adres: { ...inhoud.adres, straat: e.target.value } })}
            />
          </Veld>
          <Veld label="Postcode">
            <input
              className={invoer}
              value={inhoud.adres.postcode}
              onChange={(e) => zetInhoud({ adres: { ...inhoud.adres, postcode: e.target.value } })}
            />
          </Veld>
          <Veld label="Plaats">
            <input
              className={invoer}
              value={inhoud.adres.plaats}
              onChange={(e) => zetInhoud({ adres: { ...inhoud.adres, plaats: e.target.value } })}
            />
          </Veld>
          <Veld label="KvK">
            <input
              className={invoer}
              value={inhoud.kvk}
              onChange={(e) => zetInhoud({ kvk: e.target.value })}
            />
          </Veld>
        </div>
      </Kaart>

      {/* ---------------- Verkoopbalk ---------------- */}
      <Kaart
        titel="Verkoopbalk"
        uitleg="De balk onderaan de demo met je aanbod. Zet 'm uit zodra iemand klant wordt — dan is het een gewone site."
      >
        <div className="grid gap-4 sm:grid-cols-4">
          <Veld label="Actief">
            <select
              className={invoer}
              value={inhoud.pitch.actief ? 'ja' : 'nee'}
              onChange={(e) =>
                zetInhoud({ pitch: { ...inhoud.pitch, actief: e.target.value === 'ja' } })
              }
            >
              <option value="ja" className="bg-[#0b0b18]">Aan</option>
              <option value="nee" className="bg-[#0b0b18]">Uit</option>
            </select>
          </Veld>
          <Veld label="Prijs">
            <input
              className={invoer}
              type="number"
              value={inhoud.pitch.prijs}
              onChange={(e) =>
                zetInhoud({ pitch: { ...inhoud.pitch, prijs: Number(e.target.value) } })
              }
            />
          </Veld>
          <Veld label="Per maand">
            <input
              className={invoer}
              type="number"
              value={inhoud.pitch.perMaand}
              onChange={(e) =>
                zetInhoud({ pitch: { ...inhoud.pitch, perMaand: Number(e.target.value) } })
              }
            />
          </Veld>
          <Veld label="Jouw telefoon">
            <input
              className={invoer}
              value={inhoud.pitch.jouwTelefoon}
              onChange={(e) =>
                zetInhoud({ pitch: { ...inhoud.pitch, jouwTelefoon: e.target.value } })
              }
            />
          </Veld>
        </div>
      </Kaart>

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
            <span className="text-white/35">— pas dan is de link bereikbaar</span>
          </label>

          <div className="flex items-center gap-3">
            {bewerken && v.gepubliceerd && (
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
