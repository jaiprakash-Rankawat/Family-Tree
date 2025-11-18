import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { treeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tree = await prisma.tree.findFirst({
      where: {
        id: params.treeId,
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
        people: true,
        relationships: true,
        collaborations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!tree) {
      return NextResponse.json({ error: 'Tree not found' }, { status: 404 })
    }

    return NextResponse.json({ tree })
  } catch (error) {
    console.error('Failed to fetch tree:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tree' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { treeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tree = await prisma.tree.findUnique({
      where: { id: params.treeId },
    })

    if (!tree) {
      return NextResponse.json({ error: 'Tree not found' }, { status: 404 })
    }

    if (tree.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the owner can delete this tree' },
        { status: 403 }
      )
    }

    await prisma.tree.delete({
      where: { id: params.treeId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete tree:', error)
    return NextResponse.json(
      { error: 'Failed to delete tree' },
      { status: 500 }
    )
  }
}
