import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { prospectSchema } from '@/lib/validation'

function datum(waarde?: string | null) {
  if (!waarde) return null
  const d = new Date(waarde)
  return Number.isNaN(d.getTime()) ? null : d
}

function leegIsNull(waarde?: string | null) {
  return waarde && waarde.length > 0 ? waarde : null
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const prospect = await prisma.prospect.findUnique({
      where: { id: params.id },
      include: {
        weergaves: { orderBy: { bekekenOp: 'desc' }, take: 50 },
      },
    })

    if (!prospect) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })
    return NextResponse.json(prospect)
  } catch (error) {
    console.error('Prospect ophalen mislukt:', error)
    return NextResponse.json({ error: 'Ophalen mislukt' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = prospectSchema.parse(await request.json())

    // Slug mag wijzigen, maar niet botsen met een ander prospect.
    const metZelfdeSlug = await prisma.prospect.findUnique({ where: { slug: data.slug } })
    if (metZelfdeSlug && metZelfdeSlug.id !== params.id) {
      return NextResponse.json(
        { error: `De slug "${data.slug}" is al in gebruik` },
        { status: 409 },
      )
    }

    const prospect = await prisma.prospect.update({
      where: { id: params.id },
      data: {
        slug: data.slug,
        bedrijf: data.bedrijf,
        branche: data.branche,
        plaats: data.plaats,
        regio: data.regio,
        huidigeSite: leegIsNull(data.huidigeSite),
        contact: leegIsNull(data.contact),
        email: leegIsNull(data.email),
        telefoon: leegIsNull(data.telefoon),
        status: data.status,
        pakket: leegIsNull(data.pakket),
        bedrag: data.bedrag ?? null,
        perMaand: data.perMaand ?? null,
        gemaildOp: datum(data.gemaildOp),
        opgevolgdOp: datum(data.opgevolgdOp),
        gereageerdOp: datum(data.gereageerdOp),
        notitie: leegIsNull(data.notitie),
        gepubliceerd: data.gepubliceerd,
        pitchActief: data.pitchActief,
        pitchPrijs: data.pitchPrijs,
        pitchPerMaand: data.pitchPerMaand,
      },
    })

    return NextResponse.json(prospect)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Prospect bijwerken mislukt:', error)
    return NextResponse.json({ error: 'Bijwerken mislukt' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Weergaves gaan mee door de cascade in het schema.
    await prisma.prospect.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Prospect verwijderen mislukt:', error)
    return NextResponse.json({ error: 'Verwijderen mislukt' }, { status: 500 })
  }
}
