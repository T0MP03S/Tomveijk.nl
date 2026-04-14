import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    const [items, total] = await Promise.all([
      prisma.portfolioItem.findMany({
        where: { published: true },
        orderBy: { order: 'asc' },
        ...(limit ? { take: limit } : {})
      }),
      limit
        ? prisma.portfolioItem.count({ where: { published: true } })
        : Promise.resolve(undefined)
    ])

    if (limit) {
      return NextResponse.json({ items, total })
    }
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch portfolio items' }, { status: 500 })
  }
}
