import { Node, Edge, MarkerType } from 'reactflow'

type Person = {
  id: string
  fullName: string
  givenName?: string | null
  familyName?: string | null
  gender?: string | null
  birthDate?: Date | string | null
  deathDate?: Date | string | null
  photos: string[]
}

type Relationship = {
  id: string
  fromId: string
  toId: string
  type: string
  label?: string | null
}

export function computeTreeLayout(
  people: Person[],
  relationships: Relationship[]
): { nodes: Node[]; edges: Edge[] } {
  if (!people || people.length === 0) {
    return { nodes: [], edges: [] }
  }

  const generations = new Map<string, number>()
  const childToParents = new Map<string, string[]>()
  const personToSpouse = new Map<string, string[]>()

  relationships.forEach((rel) => {
    if (rel.type === 'parent') {
      if (!childToParents.has(rel.toId)) {
        childToParents.set(rel.toId, [])
      }
      childToParents.get(rel.toId)!.push(rel.fromId)
    } else if (rel.type === 'spouse') {
      if (!personToSpouse.has(rel.fromId)) {
        personToSpouse.set(rel.fromId, [])
      }
      if (!personToSpouse.has(rel.toId)) {
        personToSpouse.set(rel.toId, [])
      }
      personToSpouse.get(rel.fromId)!.push(rel.toId)
      personToSpouse.get(rel.toId)!.push(rel.fromId)
    }
  })

  const rootPeople = people.filter((p) => !childToParents.has(p.id))

  const assignGeneration = (personId: string, gen: number) => {
    if (!generations.has(personId) || generations.get(personId)! > gen) {
      generations.set(personId, gen)

      relationships
        .filter((r) => r.fromId === personId && r.type === 'parent')
        .forEach((r) => {
          assignGeneration(r.toId, gen + 1)
        })

      const spouses = personToSpouse.get(personId) || []
      spouses.forEach((spouseId) => {
        if (!generations.has(spouseId) || generations.get(spouseId)! > gen) {
          generations.set(spouseId, gen)
        }
      })
    }
  }

  if (rootPeople.length > 0) {
    rootPeople.forEach((root) => assignGeneration(root.id, 0))
  } else {
    people.forEach((p, i) => {
      if (!generations.has(p.id)) {
        generations.set(p.id, i)
      }
    })
  }

  const generationGroups = new Map<number, string[]>()
  people.forEach((p) => {
    const gen = generations.get(p.id) || 0
    if (!generationGroups.has(gen)) {
      generationGroups.set(gen, [])
    }
    generationGroups.get(gen)!.push(p.id)
  })

  const nodes: Node[] = []
  const horizontalSpacing = 250
  const verticalSpacing = 200

  Array.from(generationGroups.keys())
    .sort((a, b) => a - b)
    .forEach((gen) => {
      const peopleInGen = generationGroups.get(gen)!
      const genWidth = peopleInGen.length * horizontalSpacing
      const startX = -genWidth / 2

      peopleInGen.forEach((personId, index) => {
        const person = people.find((p) => p.id === personId)!
        nodes.push({
          id: personId,
          type: 'person',
          position: {
            x: startX + index * horizontalSpacing,
            y: gen * verticalSpacing,
          },
          data: {
            fullName: person.fullName,
            givenName: person.givenName,
            familyName: person.familyName,
            gender: person.gender,
            birthDate: person.birthDate,
            deathDate: person.deathDate,
            photos: person.photos,
          },
        })
      })
    })

  const edges: Edge[] = relationships.map((rel) => ({
    id: rel.id,
    source: rel.fromId,
    target: rel.toId,
    type: 'relationship',
    data: {
      label: rel.label,
      type: rel.type,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: rel.type === 'spouse' ? '#9333ea' : rel.type === 'sibling' ? '#0891b2' : '#059669',
    },
  }))

  return { nodes, edges }
}
