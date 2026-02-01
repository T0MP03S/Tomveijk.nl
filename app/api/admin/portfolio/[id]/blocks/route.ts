import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const blocks = await prisma.contentBlock.findMany({
      where: { portfolioItemId: params.id },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(blocks)
  } catch (error) {
    console.error('Get blocks error:', error)
    return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, content, order } = body

    const block = await prisma.contentBlock.create({
      data: {
        portfolioItemId: params.id,
        type,
        content: JSON.stringify(content),
        order: order ?? 0
      }
    })

    return NextResponse.json(block)
  } catch (error) {
    console.error('Create block error:', error)
    return NextResponse.json({ error: 'Failed to create block' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { blocks } = body

    await prisma.$transaction(
      blocks.map((block: any) =>
        prisma.contentBlock.upsert({
          where: { id: block.id || 'new' },
          create: {
            portfolioItemId: params.id,
            type: block.type,
            content: JSON.stringify(block.content),
            order: block.order
          },
          update: {
            type: block.type,
            content: JSON.stringify(block.content),
            order: block.order
          }
        })
      )
    )

    const updatedBlocks = await prisma.contentBlock.findMany({
      where: { portfolioItemId: params.id },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(updatedBlocks)
  } catch (error) {
    console.error('Update blocks error:', error)
    return NextResponse.json({ error: 'Failed to update blocks' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const blockId = searchParams.get('blockId')

    if (!blockId) {
      return NextResponse.json({ error: 'Block ID required' }, { status: 400 })
    }

    await prisma.contentBlock.delete({
      where: { id: blockId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete block error:', error)
    return NextResponse.json({ error: 'Failed to delete block' }, { status: 500 })
  }
}
