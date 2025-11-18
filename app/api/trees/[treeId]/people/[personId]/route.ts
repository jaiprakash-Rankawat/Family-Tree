import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { treeId: string; personId: string } }
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
                role: { in: ['owner', 'editor'] },
              },
            },
          },
        ],
      },
    })

    if (!tree) {
      return NextResponse.json(
        { error: 'Tree not found or insufficient permissions' },
        { status: 404 }
      )
    }

    const {
      fullName,
      givenName,
      familyName,
      gender,
      birthDate,
      deathDate,
      notes,
      medicalFlags,
    } = await request.json()

    const person = await prisma.person.update({
      where: { id: params.personId },
      data: {
        ...(fullName && { fullName: fullName.trim() }),
        givenName: givenName?.trim() || null,
        familyName: familyName?.trim() || null,
        gender: gender || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        deathDate: deathDate ? new Date(deathDate) : null,
        notes: notes?.trim() || null,
        medicalFlags: medicalFlags || [],
      },
    })

    return NextResponse.json({ person })
  } catch (error) {
    console.error('Failed to update person:', error)
    return NextResponse.json(
      { error: 'Failed to update person' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { treeId: string; personId: string } }
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
                role: { in: ['owner', 'editor'] },
              },
            },
          },
        ],
      },
    })

    if (!tree) {
      return NextResponse.json(
        { error: 'Tree not found or insufficient permissions' },
        { status: 404 }
      )
    }

    await prisma.person.delete({
      where: { id: params.personId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete person:', error)
    return NextResponse.json(
      { error: 'Failed to delete person' },
      { status: 500 }
    )
  }
}
