'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

type AddPersonModalProps = {
  treeId: string
  people: any[]
  onClose: () => void
}

export default function AddPersonModal({ treeId, people, onClose }: AddPersonModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    givenName: '',
    familyName: '',
    gender: '',
    birthDate: '',
    deathDate: '',
    notes: '',
    parentId: '',
    relationshipType: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/trees/${treeId}/people`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          givenName: formData.givenName || null,
          familyName: formData.familyName || null,
          gender: formData.gender || null,
          birthDate: formData.birthDate || null,
          deathDate: formData.deathDate || null,
          notes: formData.notes || null,
          parentId: formData.parentId || null,
          relationshipType: formData.relationshipType || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add person')
      }

      router.refresh()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add New Person</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              placeholder="e.g., John Smith"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Given Name
              </label>
              <input
                type="text"
                value={formData.givenName}
                onChange={(e) =>
                  setFormData({ ...formData, givenName: e.target.value })
                }
                placeholder="e.g., John"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Family Name
              </label>
              <input
                type="text"
                value={formData.familyName}
                onChange={(e) =>
                  setFormData({ ...formData, familyName: e.target.value })
                }
                placeholder="e.g., Smith"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Birth Date
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Death Date (if applicable)
              </label>
              <input
                type="date"
                value={formData.deathDate}
                onChange={(e) =>
                  setFormData({ ...formData, deathDate: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              placeholder="Any additional information about this person"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {people.length > 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-blue-900">
                Connect to Family Tree (Optional)
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-blue-900">
                    Select Parent/Relative
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) =>
                      setFormData({ ...formData, parentId: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-blue-300 px-4 py-2"
                  >
                    <option value="">None - Standalone Person</option>
                    {people.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.parentId && (
                  <div>
                    <label className="block text-sm font-medium text-blue-900">
                      Relationship Type
                    </label>
                    <select
                      value={formData.relationshipType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          relationshipType: e.target.value,
                        })
                      }
                      required={!!formData.parentId}
                      className="mt-1 w-full rounded-lg border border-blue-300 px-4 py-2"
                    >
                      <option value="">Select...</option>
                      <option value="parent">Child of (they are my parent)</option>
                      <option value="spouse">Spouse of</option>
                      <option value="sibling">Sibling of</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Person'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
