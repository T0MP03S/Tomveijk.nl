import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { published } = await request.json()

    const item = await prisma.portfolioItem.update({
      where: { id: params.id },
      data: { published: !!published }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error toggling publish status:', error)
    return NextResponse.json({ error: 'Failed to toggle publish status' }, { status: 500 })
  }
}
