'use client'

import { useState } from 'react'
import { X, Calendar, User, FileText, Shield, AlertTriangle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

type PersonModalProps = {
  person: {
    id: string
    fullName: string
    givenName?: string | null
    familyName?: string | null
    gender?: string | null
    birthDate?: Date | string | null
    deathDate?: Date | string | null
    photos: string[]
    medicalFlags: string[]
    notes?: string | null
    privacyLevel: string
  }
  canEdit: boolean
  onClose: () => void
  onUpdate?: (data: any) => void
}

export default function PersonModal({
  person,
  canEdit,
  onClose,
  onUpdate,
}: PersonModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: person.fullName,
    givenName: person.givenName || '',
    familyName: person.familyName || '',
    gender: person.gender || '',
    birthDate: person.birthDate
      ? new Date(person.birthDate).toISOString().split('T')[0]
      : '',
    deathDate: person.deathDate
      ? new Date(person.deathDate).toISOString().split('T')[0]
      : '',
    notes: person.notes || '',
    medicalConsent: person.medicalFlags.length > 0,
    medicalFlags: person.medicalFlags.join(', '),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onUpdate) {
      await onUpdate({
        ...formData,
        medicalFlags: formData.medicalConsent
          ? formData.medicalFlags.split(',').map((f) => f.trim()).filter(Boolean)
          : [],
      })
    }
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {person.fullName}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {person.photos && person.photos.length > 0 ? (
                <img
                  src={person.photos[0]}
                  alt={person.fullName}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div>
                <div className="text-sm text-gray-600">
                  {person.givenName} {person.familyName}
                </div>
                {person.gender && (
                  <div className="mt-1 text-sm capitalize text-gray-600">
                    {person.gender}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4" />
                  Birth Date
                </div>
                <div className="text-gray-900">
                  {person.birthDate ? formatDate(person.birthDate) : 'Unknown'}
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4" />
                  Death Date
                </div>
                <div className="text-gray-900">
                  {person.deathDate ? formatDate(person.deathDate) : 'Living'}
                </div>
              </div>
            </div>

            {person.notes && (
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="h-4 w-4" />
                  Notes
                </div>
                <div className="text-gray-900">{person.notes}</div>
              </div>
            )}

            {person.medicalFlags && person.medicalFlags.length > 0 && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-900">
                  <AlertTriangle className="h-4 w-4" />
                  Medical Information (Sensitive)
                </div>
                <div className="mb-2 text-xs text-orange-700">
                  This information has been shared with consent for family health
                  history purposes.
                </div>
                <div className="text-sm text-orange-900">
                  {person.medicalFlags.join(', ')}
                </div>
              </div>
            )}

            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Shield className="h-4 w-4" />
                Privacy Level
              </div>
              <div className="capitalize text-gray-900">{person.privacyLevel}</div>
            </div>

            {canEdit && (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                >
                  Edit Profile
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
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
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
              />
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
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
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
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
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
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.medicalConsent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicalConsent: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-orange-900">
                  I consent to share medical information for family health history
                </span>
              </label>
              {formData.medicalConsent && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={formData.medicalFlags}
                    onChange={(e) =>
                      setFormData({ ...formData, medicalFlags: e.target.value })
                    }
                    placeholder="e.g., diabetes, heart disease (comma separated)"
                    className="w-full rounded-lg border border-orange-300 px-4 py-2"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
