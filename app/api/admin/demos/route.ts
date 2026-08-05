import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { prospectSchema } from '@/lib/validation'

/** Lege datumvelden komen als '' binnen; die moeten null worden, geen Invalid Date. */
function datum(waarde?: string | null) {
  if (!waarde) return null
  const d = new Date(waarde)
  return Number.isNaN(d.getTime()) ? null : d
}

function leegIsNull(waarde?: string | null) {
  return waarde && waarde.length > 0 ? waarde : null
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const prospects = await prisma.prospect.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { weergaves: true } },
        weergaves: { orderBy: { bekekenOp: 'desc' }, take: 1, select: { bekekenOp: true } },
      },
    })

    return NextResponse.json(prospects)
  } catch (error) {
    console.error('Prospects ophalen mislukt:', error)
    return NextResponse.json({ error: 'Ophalen mislukt' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = prospectSchema.parse(await request.json())

    const bestaat = await prisma.prospect.findUnique({ where: { slug: data.slug } })
    if (bestaat) {
      return NextResponse.json(
        { error: `De slug "${data.slug}" is al in gebruik` },
        { status: 409 },
      )
    }

    const prospect = await prisma.prospect.create({
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
        inhoud: data.inhoud ? JSON.stringify(data.inhoud) : null,
      },
    })

    return NextResponse.json(prospect, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Prospect aanmaken mislukt:', error)
    return NextResponse.json({ error: 'Aanmaken mislukt' }, { status: 500 })
  }
}
