import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { TreePine } from 'lucide-react'
import CreateTreeButton from '@/components/CreateTreeButton'
import TreeCard from '@/components/TreeCard'
import SignOutButton from '@/components/SignOutButton'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <TreePine className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">FamilyTree</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Family Trees
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and explore your family history
            </p>
          </div>
          <CreateTreeButton />
        </div>

        {trees.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <TreePine className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No family trees yet
            </h3>
            <p className="mt-2 text-gray-600">
              Get started by creating your first family tree
            </p>
            <CreateTreeButton className="mt-6" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trees.map((tree) => (
              <TreeCard key={tree.id} tree={tree} userId={session.user.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
