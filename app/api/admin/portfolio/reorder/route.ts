import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items }: { items: { id: string; order: number }[] } = await request.json()

    await Promise.all(
      items.map((item) =>
        prisma.portfolioItem.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering portfolio items:', error)
    return NextResponse.json({ error: 'Failed to reorder portfolio items' }, { status: 500 })
  }
}
