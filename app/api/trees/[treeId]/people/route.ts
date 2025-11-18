import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
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
      parentId,
      relationshipType,
    } = await request.json()

    if (!fullName || fullName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }

    const person = await prisma.person.create({
      data: {
        treeId: params.treeId,
        fullName: fullName.trim(),
        givenName: givenName?.trim() || null,
        familyName: familyName?.trim() || null,
        gender: gender || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        deathDate: deathDate ? new Date(deathDate) : null,
        notes: notes?.trim() || null,
        photos: [],
        medicalFlags: [],
        createdById: session.user.id,
      },
    })

    if (parentId && relationshipType) {
      const relType = relationshipType === 'parent' ? 'parent' : relationshipType
      const fromId = relationshipType === 'parent' ? parentId : person.id
      const toId = relationshipType === 'parent' ? person.id : parentId

      await prisma.relationship.create({
        data: {
          treeId: params.treeId,
          fromId,
          toId,
          type: relType,
          label: relationshipType === 'parent' ? 
            (gender === 'male' ? 'father' : gender === 'female' ? 'mother' : 'parent') :
            relationshipType,
        },
      })
    }

    return NextResponse.json({ person }, { status: 201 })
  } catch (error) {
    console.error('Failed to create person:', error)
    return NextResponse.json(
      { error: 'Failed to create person' },
      { status: 500 }
    )
  }
}
