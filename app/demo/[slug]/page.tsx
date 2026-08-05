import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import type { Metadata } from 'next'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { demoInhoudSchema } from '@/lib/validation'
import DemoPagina from '@/components/demo/DemoPagina'

export const dynamic = 'force-dynamic'

async function haalProspect(slug: string) {
  const prospect = await prisma.prospect.findUnique({ where: { slug } })
  if (!prospect || !prospect.gepubliceerd || !prospect.inhoud) return null

  const ontleed = demoInhoudSchema.safeParse(JSON.parse(prospect.inhoud))
  if (!ontleed.success) return null

  return { prospect, inhoud: ontleed.data }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const data = await haalProspect(params.slug)
  if (!data) return { title: 'Niet gevonden', robots: { index: false, follow: false } }

  const { prospect, inhoud } = data

  return {
    title: `${prospect.bedrijf} — ${prospect.branche} in ${prospect.plaats}`,
    description: inhoud.hero.tekst.slice(0, 155),
    // Deze pagina's mogen nooit in Google komen: er staat een bedrijfsnaam en
    // fotomateriaal op van iemand die nog geen klant is. Overschrijft bewust de
    // index-instelling uit de root-layout.
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
  }
}

/**
 * Legt vast dat de demo bekeken is.
 *
 * Wie zijn demo opent maar niet reageert, is precies degene die je moet bellen —
 * dat is de hoogste conversie in dit hele traject. Eigen bezoeken worden
 * overgeslagen, anders staat de lijst vol met jouw eigen controles.
 */
async function legWeergaveVast(prospectId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (session) return

    const kop = headers()
    const ip =
      kop.get('cf-connecting-ip') ??
      kop.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      null

    await prisma.demoWeergave.create({
      data: {
        prospectId,
        ip,
        browser: kop.get('user-agent')?.slice(0, 255) ?? null,
        verwijzer: kop.get('referer')?.slice(0, 255) ?? null,
      },
    })
  } catch (error) {
    // Een mislukte telling mag de pagina van de klant nooit stukmaken.
    console.error('Weergave vastleggen mislukt:', error)
  }
}

export default async function DemoRoute({ params }: { params: { slug: string } }) {
  const data = await haalProspect(params.slug)
  if (!data) notFound()

  const { prospect, inhoud } = data
  await legWeergaveVast(prospect.id)

  return (
    <DemoPagina
      slug={prospect.slug}
      bedrijf={prospect.bedrijf}
      branche={prospect.branche}
      plaats={prospect.plaats}
      regio={prospect.regio}
      telefoon={prospect.telefoon ?? ''}
      email={prospect.email ?? undefined}
      inhoud={inhoud}
    />
  )
}
