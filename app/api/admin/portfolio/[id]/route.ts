import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { portfolioItemSchema } from '@/lib/validation'
import { z } from 'zod'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const item = await prisma.portfolioItem.findUnique({
      where: { id: params.id },
      include: {
        media: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!item) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching portfolio item:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio item' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = portfolioItemSchema.parse(body)

    const existingItem = await prisma.portfolioItem.findUnique({
      where: { id: params.id }
    })

    if (!existingItem) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 })
    }

    if (validatedData.slug !== existingItem.slug) {
      const existingSlug = await prisma.portfolioItem.findUnique({
        where: { slug: validatedData.slug }
      })

      if (existingSlug) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      }
    }

    const { embeds, projectDate, blocks, ...itemData } = validatedData

    const item = await prisma.portfolioItem.update({
      where: { id: params.id },
      data: {
        ...itemData,
        projectDate: projectDate ? new Date(projectDate) : null
      }
    })

    await prisma.portfolioMedia.deleteMany({
      where: {
        portfolioItemId: params.id,
        type: 'EMBED'
      }
    })

    if (embeds.length > 0) {
      await prisma.portfolioMedia.createMany({
        data: embeds.map((url, index) => ({
          portfolioItemId: item.id,
          type: 'EMBED',
          url,
          order: index,
        }))
      })
    }

    // Delete existing blocks and create new ones
    await prisma.contentBlock.deleteMany({
      where: { portfolioItemId: params.id }
    })

    if (blocks && blocks.length > 0) {
      await prisma.contentBlock.createMany({
        data: blocks.map((block, index) => ({
          portfolioItemId: item.id,
          type: block.type,
          order: block.order ?? index,
          content: JSON.stringify(block.content),
        }))
      })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating portfolio item:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update portfolio item' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const item = await prisma.portfolioItem.findUnique({
      where: { id: params.id },
      include: { media: true }
    })

    if (!item) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 })
    }

    await prisma.portfolioItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting portfolio item:', error)
    return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 })
  }
}
