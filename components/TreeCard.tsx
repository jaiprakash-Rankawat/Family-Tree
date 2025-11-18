'use client'

import Link from 'next/link'
import { TreePine, Users, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'

type TreeCardProps = {
  tree: {
    id: string
    name: string
    description: string | null
    ownerId: string
    updatedAt: Date
    owner: {
      name: string | null
      email: string | null
    }
    _count: {
      people: number
      collaborations: number
    }
  }
  userId: string
}

export default function TreeCard({ tree, userId }: TreeCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const isOwner = tree.ownerId === userId

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm(`Are you sure you want to delete "${tree.name}"?`)) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/trees/${tree.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete tree:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Link
      href={`/dashboard/${tree.id}`}
      className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-green-100 p-2">
            <TreePine className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600">
              {tree.name}
            </h3>
            {tree.description && (
              <p className="mt-1 text-sm text-gray-600">{tree.description}</p>
            )}
          </div>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="opacity-0 transition group-hover:opacity-100"
            title="Delete tree"
          >
            <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{tree._count.people} people</span>
        </div>
        <div>Updated {formatDate(tree.updatedAt)}</div>
      </div>

      {!isOwner && (
        <div className="mt-2 text-xs text-gray-500">
          Shared by {tree.owner.name || tree.owner.email}
        </div>
      )}
    </Link>
  )
}
