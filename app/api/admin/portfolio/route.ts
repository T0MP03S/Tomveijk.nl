import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { portfolioItemSchema } from '@/lib/validation'
import { z } from 'zod'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const items = await prisma.portfolioItem.findMany({
      orderBy: { order: 'asc' },
      include: {
        media: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching portfolio items:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = portfolioItemSchema.parse(body)

    const existingSlug = await prisma.portfolioItem.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingSlug) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const { embeds, projectDate, blocks, ...itemData } = validatedData

    const item = await prisma.portfolioItem.create({
      data: {
        ...itemData,
        projectDate: projectDate ? new Date(projectDate) : null
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

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating portfolio item:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create portfolio item' }, { status: 500 })
  }
}
