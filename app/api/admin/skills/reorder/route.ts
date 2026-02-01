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

    const { skills }: { skills: { id: string; order: number }[] } = await request.json()

    await Promise.all(
      skills.map((skill) =>
        prisma.skill.update({
          where: { id: skill.id },
          data: { order: skill.order }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering skills:', error)
    return NextResponse.json({ error: 'Failed to reorder skills' }, { status: 500 })
  }
}
