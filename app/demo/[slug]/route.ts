import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { bouwPagina, leesDemo } from '@/lib/demo-bestand'

/**
 * Serveert een demopagina als losstaand HTML-document.
 *
 * Bewust een route handler en geen React-pagina: zo erft de demo niets van
 * deze site — geen Tailwind, geen donker thema, geen lettertypes die
 * doorlekken. Elke demo is een eigen ontwerp en moet dat ook echt kunnen zijn.
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Legt vast dat de demo bekeken is.
 *
 * Wie zijn demo opent maar niet reageert, is precies degene die je moet bellen
 * — dat is de hoogste conversie in het hele traject. Eigen bezoeken slaan we
 * over, anders loopt de lijst binnen een dag vol met je eigen controles.
 */
async function legWeergaveVast(prospectId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (session) return

    const kop = headers()
    await prisma.demoWeergave.create({
      data: {
        prospectId,
        ip:
          kop.get('cf-connecting-ip') ??
          kop.get('x-forwarded-for')?.split(',')[0]?.trim() ??
          null,
        browser: kop.get('user-agent')?.slice(0, 255) ?? null,
        verwijzer: kop.get('referer')?.slice(0, 255) ?? null,
      },
    })
  } catch (error) {
    // Een mislukte telling mag de pagina van de klant nooit stukmaken.
    console.error('Weergave vastleggen mislukt:', error)
  }
}

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const prospect = await prisma.prospect.findUnique({ where: { slug: params.slug } })

  if (!prospect || !prospect.gepubliceerd) {
    return new NextResponse('Niet gevonden', { status: 404 })
  }

  const html = await leesDemo(params.slug)
  if (!html) {
    return new NextResponse('Niet gevonden', { status: 404 })
  }

  await legWeergaveVast(prospect.id)

  const pagina = bouwPagina(
    html,
    prospect.pitchActief
      ? {
          bedrijf: prospect.bedrijf,
          slug: prospect.slug,
          prijs: prospect.pitchPrijs,
          perMaand: prospect.pitchPerMaand,
          jouwEmail: process.env.CONTACT_EMAIL ?? 'info@tomveijk.nl',
          jouwTelefoon: process.env.EIGEN_TELEFOON ?? '',
        }
      : null,
  )

  return new NextResponse(pagina, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Tweede slot op de deur naast de meta-tag: deze pagina's bevatten
      // bedrijfsnamen en fotomateriaal van bedrijven die nog geen klant zijn.
      'x-robots-tag': 'noindex, nofollow, noarchive, noimageindex',
      // Nooit cachen: pas je een demo aan, dan moet de klant meteen de nieuwe
      // versie zien en niet een oude uit zijn browsercache.
      'cache-control': 'no-store',
    },
  })
}
