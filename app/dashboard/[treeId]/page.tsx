import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import TreeCanvas from '@/components/TreeCanvas'

export default async function TreePage({
  params,
}: {
  params: { treeId: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
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
    notFound()
  }

  const userCollaboration = tree.collaborations.find(
    (c) => c.userId === session.user.id
  )
  const userRole =
    tree.ownerId === session.user.id
      ? 'owner'
      : userCollaboration?.role || 'viewer'

  return (
    <TreeCanvas
      tree={tree}
      userId={session.user.id}
      userRole={userRole}
      userEmail={session.user.email || ''}
    />
  )
}
