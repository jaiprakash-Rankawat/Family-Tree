import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const trees = await prisma.tree.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          {
            collaborations: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            people: true,
            collaborations: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json({ trees })
  } catch (error) {
    console.error('Failed to fetch trees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trees' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description } = await request.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tree name is required' },
        { status: 400 }
      )
    }

    const tree = await prisma.tree.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        ownerId: session.user.id,
      },
    })

    return NextResponse.json({ tree }, { status: 201 })
  } catch (error) {
    console.error('Failed to create tree:', error)
    return NextResponse.json(
      { error: 'Failed to create tree' },
      { status: 500 }
    )
  }
}
