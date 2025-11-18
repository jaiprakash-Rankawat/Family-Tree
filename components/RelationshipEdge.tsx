import { memo } from 'react'
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from 'reactflow'

function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const label = data?.label || ''
  const type = data?.type || 'parent'

  const edgeColor = type === 'spouse' ? '#9333ea' : type === 'sibling' ? '#0891b2' : '#059669'

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        stroke={edgeColor}
        strokeWidth={2}
        fill="none"
        markerEnd={markerEnd}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm border border-gray-200"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export default memo(RelationshipEdge)
