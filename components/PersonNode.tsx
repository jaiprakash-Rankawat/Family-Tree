import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { User } from 'lucide-react'
import { formatDate, getInitials } from '@/lib/utils'

type PersonNodeData = {
  fullName: string
  givenName?: string | null
  familyName?: string | null
  birthDate?: Date | null
  deathDate?: Date | null
  gender?: string | null
  photos: string[]
  highlighted?: boolean
}

function PersonNode({ data }: NodeProps<PersonNodeData>) {
  const { fullName, birthDate, deathDate, gender, photos, highlighted } = data

  const genderColor = gender === 'male' ? 'bg-blue-100 border-blue-300' : gender === 'female' ? 'bg-pink-100 border-pink-300' : 'bg-gray-100 border-gray-300'

  return (
    <div
      className={`group relative rounded-lg border-2 bg-white p-3 shadow-md transition-all hover:shadow-lg ${
        highlighted ? 'ring-4 ring-green-500 ring-offset-2' : ''
      }`}
      style={{ width: 180 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400"
        style={{ width: 8, height: 8 }}
      />
      
      <div className="flex flex-col items-center gap-2">
        {photos && photos.length > 0 ? (
          <img
            src={photos[0]}
            alt={fullName}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${genderColor}`}>
            <span className="text-lg font-semibold text-gray-700">
              {getInitials(fullName)}
            </span>
          </div>
        )}

        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900">{fullName}</div>
          {(birthDate || deathDate) && (
            <div className="mt-1 text-xs text-gray-600">
              {birthDate ? formatDate(birthDate) : '?'} -{' '}
              {deathDate ? formatDate(deathDate) : 'Present'}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400"
        style={{ width: 8, height: 8 }}
      />
    </div>
  )
}

export default memo(PersonNode)
