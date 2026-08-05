import Image from 'next/image'
import type { CSSProperties } from 'react'

import { telHref, themaVariabelen } from '@/lib/demo-kleur'
import type { DemoInhoud } from '@/lib/validation'

import DemoKop from './DemoKop'
import DemoContactFormulier from './DemoContactFormulier'
import PitchBalk from './PitchBalk'

interface Props {
  slug: string
  bedrijf: string
  branche: string
  plaats: string
  regio: string
  telefoon: string
  email?: string
  inhoud: DemoInhoud
}

function Vinkje() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function DemoPagina({
  slug,
  bedrijf,
  branche,
  plaats,
  regio,
  telefoon,
  email,
  inhoud,
}: Props) {
  const { thema, hero, usps, diensten, projecten, over, reviews, openingstijden, contact, adres, kvk, pitch, logo } =
    inhoud

  // Alleen menu-items tonen voor secties die dit bedrijf ook echt heeft.
  const links = [
    { label: 'Diensten', href: '#diensten' },
    ...(projecten && projecten.items.length > 0 ? [{ label: 'Ons werk', href: '#projecten' }] : []),
    ...(over ? [{ label: 'Over ons', href: '#over' }] : []),
    { label: 'Contact', href: '#contact' },
  ]

  const kaartZoek = encodeURIComponent(
    adres ? `${adres.straat}, ${adres.postcode} ${adres.plaats}` : `${bedrijf} ${plaats}`,
  )

  return (
    <div
      className="demo-root"
      data-koppen={thema.koppen}
      style={themaVariabelen(thema) as CSSProperties}
    >
      <DemoKop bedrijf={bedrijf} telefoon={telefoon} logo={logo} links={links} />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden">
          <Image
            src={hero.afbeelding}
            alt=""
            fill
            sizes="100vw"
            priority
            className="-z-10 object-cover"
          />
          {/* Verloop zodat de tekst leesbaar blijft, wat voor foto er ook onder zit. */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />

          <div className="demo-omhulsel w-full pt-32 pb-16 md:pb-24">
            <div className="max-w-3xl text-white">
              <p className="mb-5 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/25 backdrop-blur-sm">
                {branche} in {regio}
              </p>
              <h1 className="text-[2.5rem] leading-[1.05] font-extrabold sm:text-6xl lg:text-7xl">
                {hero.kop}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
                {hero.tekst}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#contact" className="demo-knop demo-knop--primair w-full sm:w-auto">
                  {hero.primaireKnop}
                </a>
                <a href={telHref(telefoon)} className="demo-knop demo-knop--wit w-full sm:w-auto">
                  Bel {telefoon}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- USP's ---------------- */}
        {usps.length > 0 && (
          <section className="border-b border-neutral-200 bg-white">
            <div className="demo-omhulsel">
              <ul className="grid divide-y divide-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {usps.map((u, i) => (
                  <li key={i} className="flex items-start gap-4 py-7 sm:px-7 sm:first:pl-0 sm:last:pr-0">
                    <span className="demo-rondje mt-0.5 h-10 w-10" aria-hidden="true">
                      <Vinkje />
                    </span>
                    <div>
                      <p className="text-base font-extrabold">{u.titel}</p>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-neutral-600">{u.tekst}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ---------------- Diensten ---------------- */}
        <section id="diensten" className="demo-sectie bg-white">
          <div className="demo-omhulsel">
            <div className="max-w-2xl">
              <span className="demo-label">Diensten</span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[2.75rem]">{diensten.kop}</h2>
              {diensten.intro && (
                <p className="mt-5 text-lg leading-relaxed text-neutral-600">{diensten.intro}</p>
              )}
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {diensten.items.map((d, i) => (
                <article key={i} className="demo-kaart flex flex-col overflow-hidden">
                  {d.afbeelding && (
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={d.afbeelding}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-extrabold">{d.titel}</h3>
                    <p className="mt-3 leading-relaxed text-neutral-600">{d.tekst}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Projecten ---------------- */}
        {projecten && projecten.items.length > 0 && (
          <section id="projecten" className="demo-sectie" style={{ background: 'var(--zacht)' }}>
            <div className="demo-omhulsel">
              <div className="max-w-2xl">
                <span className="demo-label">Ons werk</span>
                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[2.75rem]">{projecten.kop}</h2>
                {projecten.intro && (
                  <p className="mt-5 text-lg leading-relaxed text-neutral-600">{projecten.intro}</p>
                )}
              </div>

              {/* De eerste foto krijgt twee kolommen: dat maakt het raster levendiger
                  dan een blok gelijke vierkantjes, zonder extra werk per bedrijf. */}
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projecten.items.map((p, i) => (
                  <figure
                    key={i}
                    className={`group relative overflow-hidden rounded-xl bg-neutral-200 ${
                      i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full sm:h-full">
                      <Image
                        src={p.afbeelding}
                        alt={p.titel}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 pt-12">
                      <span className="text-base font-bold text-white">{p.titel}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- Over ons ---------------- */}
        {over && (
          <section id="over" className="demo-sectie bg-white">
            <div className="demo-omhulsel">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                {over.afbeelding && (
                  <div className="relative order-last aspect-[4/5] w-full lg:order-first">
                    <Image
                      src={over.afbeelding}
                      alt={bedrijf}
                      fill
                      sizes="(min-width: 1024px) 34rem, 100vw"
                      className="rounded-2xl object-cover shadow-xl"
                    />
                  </div>
                )}
                <div>
                  <span className="demo-label">Over ons</span>
                  <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[2.75rem]">{over.kop}</h2>
                  <div className="mt-6 space-y-4 text-lg leading-relaxed text-neutral-600">
                    {over.tekst.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <a href="#contact" className="demo-knop demo-knop--primair mt-8">
                    Neem contact op
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------------- Reviews ---------------- */}
        {reviews.length > 0 && (
          <section className="demo-sectie" style={{ background: 'var(--inkt)' }}>
            <div className="demo-omhulsel">
              <div className="mx-auto max-w-2xl text-center">
                <span className="demo-label" style={{ color: 'var(--brand-rand)' }}>
                  Wat klanten zeggen
                </span>
                <h2 className="mt-3 text-3xl text-white sm:text-4xl">Beoordeeld door onze klanten</h2>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {reviews.slice(0, 3).map((r, i) => (
                  <figure
                    key={i}
                    className="flex h-full flex-col rounded-2xl bg-white/[0.06] p-7 ring-1 ring-white/10"
                  >
                    <div className="flex gap-0.5" aria-label={`${r.sterren} van de 5 sterren`}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <svg
                          key={s}
                          className={`h-4 w-4 ${s < r.sterren ? 'opacity-100' : 'opacity-25'}`}
                          viewBox="0 0 24 24"
                          fill="#fbbf24"
                          aria-hidden="true"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="mt-4 flex-1 leading-relaxed text-white/85">
                      &ldquo;{r.tekst}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 text-sm font-bold text-white">
                      {r.naam}
                      {r.plaats && <span className="font-normal text-white/50"> — {r.plaats}</span>}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- Contact ---------------- */}
        <section id="contact" className="demo-sectie bg-white">
          <div className="demo-omhulsel">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <span className="demo-label">Contact</span>
                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[2.75rem]">{contact.kop}</h2>
                {contact.tekst && (
                  <p className="mt-5 text-lg leading-relaxed text-neutral-600">{contact.tekst}</p>
                )}

                <dl className="mt-9 space-y-5">
                  <div>
                    <dt className="text-sm font-semibold text-neutral-500">Bel ons</dt>
                    <dd>
                      <a href={telHref(telefoon)} className="text-lg font-extrabold hover:underline">
                        {telefoon}
                      </a>
                    </dd>
                  </div>
                  {email && (
                    <div>
                      <dt className="text-sm font-semibold text-neutral-500">Mail ons</dt>
                      <dd>
                        <a href={`mailto:${email}`} className="text-lg font-extrabold hover:underline">
                          {email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {adres && (
                    <div>
                      <dt className="text-sm font-semibold text-neutral-500">Bezoekadres</dt>
                      <dd>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${kaartZoek}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-extrabold hover:underline"
                        >
                          {adres.straat}, {adres.postcode} {adres.plaats}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>

                {openingstijden.length > 0 && (
                  <div className="mt-9 rounded-2xl border border-neutral-200 p-6">
                    <p className="text-sm font-extrabold tracking-wide uppercase">Openingstijden</p>
                    <dl className="mt-3 space-y-1.5 text-[0.9375rem]">
                      {openingstijden.map((o, i) => (
                        <div key={i} className="flex justify-between gap-4">
                          <dt className="text-neutral-600">{o.dag}</dt>
                          <dd className="font-semibold">{o.tijd}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>

              <div className="rounded-2xl p-7 sm:p-9" style={{ background: 'var(--zacht)' }}>
                <h3 className="text-xl font-extrabold">Vraag een vrijblijvende offerte aan</h3>
                <p className="mt-2 text-[0.9375rem] text-neutral-600">
                  Vul het formulier in, dan nemen we binnen één werkdag contact met je op.
                </p>
                <DemoContactFormulier />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- Voettekst ---------------- */}
      <footer className="pt-16 pb-8 text-white/70" style={{ background: 'var(--inkt)' }}>
        <div className="demo-omhulsel">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <p className="text-lg font-extrabold text-white">{bedrijf}</p>
              <p className="mt-3 max-w-sm leading-relaxed">
                {branche.charAt(0).toUpperCase() + branche.slice(1)} in {regio}. Vakwerk, duidelijke
                afspraken en een eerlijke prijs.
              </p>
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-wide text-white uppercase">Menu</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="transition hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-wide text-white uppercase">Contact</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a href={telHref(telefoon)} className="transition hover:text-white">
                    {telefoon}
                  </a>
                </li>
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="transition hover:text-white">
                      {email}
                    </a>
                  </li>
                )}
                {adres && (
                  <li className="leading-relaxed">
                    {adres.straat}
                    <br />
                    {adres.postcode} {adres.plaats}
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {bedrijf}. Alle rechten voorbehouden.
            </p>
            {kvk && <p>KvK {kvk}</p>}
          </div>
        </div>
      </footer>

      {pitch.actief && (
        <PitchBalk
          bedrijf={bedrijf}
          slug={slug}
          prijs={pitch.prijs}
          perMaand={pitch.perMaand}
          jouwEmail={pitch.jouwEmail}
          jouwTelefoon={pitch.jouwTelefoon}
        />
      )}
    </div>
  )
}
