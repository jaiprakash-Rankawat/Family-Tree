'use client'

import { useCallback, useState, useRef } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  TreePine,
  Search,
  UserPlus,
  Link as LinkIcon,
  Share2,
  Download,
  Plus,
} from 'lucide-react'
import PersonNode from './PersonNode'
import RelationshipEdge from './RelationshipEdge'
import PersonModal from './PersonModal'
import AddPersonModal from './AddPersonModal'
import { computeTreeLayout } from '@/lib/layout'
import SignOutButton from './SignOutButton'

const nodeTypes = {
  person: PersonNode,
}

const edgeTypes = {
  relationship: RelationshipEdge,
}

type TreeCanvasProps = {
  tree: any
  userId: string
  userRole: string
  userEmail: string
}

function TreeCanvasContent({
  tree,
  userId,
  userRole,
  userEmail,
}: TreeCanvasProps) {
  const reactFlowInstance = useReactFlow()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPerson, setSelectedPerson] = useState<any>(null)
  const [showAddPerson, setShowAddPerson] = useState(false)

  const initialLayout = computeTreeLayout(tree.people, tree.relationships)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialLayout.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialLayout.edges)

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const person = tree.people.find((p: any) => p.id === node.id)
    if (person) {
      setSelectedPerson(person)
    }
  }, [tree.people])

  const handleFitView = () => {
    reactFlowInstance.fitView({ padding: 0.2, duration: 800 })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const matchingNode = nodes.find((node) =>
        node.data.fullName.toLowerCase().includes(query.toLowerCase())
      )
      if (matchingNode) {
        reactFlowInstance.fitView({
          nodes: [matchingNode],
          duration: 800,
          padding: 0.5,
        })
        
        setNodes((nds) =>
          nds.map((node) => ({
            ...node,
            data: {
              ...node.data,
              highlighted: node.id === matchingNode.id,
            },
          }))
        )

        setTimeout(() => {
          setNodes((nds) =>
            nds.map((node) => ({
              ...node,
              data: {
                ...node.data,
                highlighted: false,
              },
            }))
          )
        }, 2000)
      }
    }
  }

  const handleUpdatePerson = async (data: any) => {
    try {
      const response = await fetch(`/api/trees/${tree.id}/people/${selectedPerson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.refresh()
        setSelectedPerson(null)
      }
    } catch (error) {
      console.error('Failed to update person:', error)
    }
  }

  const canEdit = userRole === 'owner' || userRole === 'editor'

  return (
    <div className="flex h-screen flex-col">
      <nav className="border-b bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <TreePine className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gray-900">FamilyTree</span>
            </Link>
            <span className="text-gray-400">|</span>
            <h1 className="text-lg font-semibold text-gray-900">{tree.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{userEmail}</span>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            minZoom={0.1}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'relationship',
              animated: false,
            }}
          >
            <Background />
            <Controls showInteractive={false} />

            <Panel position="top-right" className="space-y-4 bg-white p-4 rounded-lg shadow-lg">
              <div className="w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search people..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {canEdit && (
                  <>
                    <button 
                      onClick={() => setShowAddPerson(true)}
                      className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      <UserPlus className="h-4 w-4" />
                      Add Person
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                      <LinkIcon className="h-4 w-4" />
                      Add Relationship
                    </button>
                  </>
                )}
                <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  <Share2 className="h-4 w-4" />
                  Share Tree
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button
                  onClick={handleFitView}
                  className="flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Fit to View
                </button>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {selectedPerson && (
        <PersonModal
          person={selectedPerson}
          canEdit={canEdit}
          onClose={() => setSelectedPerson(null)}
          onUpdate={handleUpdatePerson}
        />
      )}

      {showAddPerson && (
        <AddPersonModal
          treeId={tree.id}
          people={tree.people}
          onClose={() => setShowAddPerson(false)}
        />
      )}
    </div>
  )
}

export default function TreeCanvas(props: TreeCanvasProps) {
  return (
    <ReactFlowProvider>
      <TreeCanvasContent {...props} />
    </ReactFlowProvider>
  )
}
