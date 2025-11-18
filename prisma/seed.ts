import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const password = await hash('password123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'demo@familytree.com' },
    update: {},
    create: {
      email: 'demo@familytree.com',
      name: 'Demo User',
      password,
    },
  })

  console.log('Created user:', user.email)

  const tree = await prisma.tree.upsert({
    where: { id: 'demo-tree-1' },
    update: {},
    create: {
      id: 'demo-tree-1',
      name: 'Smith Family Tree',
      description: 'A sample family tree demonstrating the application',
      ownerId: user.id,
    },
  })

  console.log('Created tree:', tree.name)

  const people = await Promise.all([
    prisma.person.upsert({
      where: { id: 'person-1' },
      update: {},
      create: {
        id: 'person-1',
        treeId: tree.id,
        fullName: 'William Smith',
        givenName: 'William',
        familyName: 'Smith',
        gender: 'male',
        birthDate: new Date('1920-05-15'),
        deathDate: new Date('2005-08-22'),
        createdById: user.id,
        photos: [],
        medicalFlags: [],
      },
    }),
    prisma.person.upsert({
      where: { id: 'person-2' },
      update: {},
      create: {
        id: 'person-2',
        treeId: tree.id,
        fullName: 'Margaret Johnson',
        givenName: 'Margaret',
        familyName: 'Johnson',
        gender: 'female',
        birthDate: new Date('1922-11-03'),
        deathDate: new Date('2010-03-15'),
        createdById: user.id,
        photos: [],
        medicalFlags: [],
      },
    }),
    prisma.person.upsert({
      where: { id: 'person-3' },
      update: {},
      create: {
        id: 'person-3',
        treeId: tree.id,
        fullName: 'Robert Smith',
        givenName: 'Robert',
        familyName: 'Smith',
        gender: 'male',
        birthDate: new Date('1945-07-20'),
        createdById: user.id,
        photos: [],
        medicalFlags: [],
      },
    }),
    prisma.person.upsert({
      where: { id: 'person-4' },
      update: {},
      create: {
        id: 'person-4',
        treeId: tree.id,
        fullName: 'Susan Davis',
        givenName: 'Susan',
        familyName: 'Davis',
        gender: 'female',
        birthDate: new Date('1947-02-14'),
        createdById: user.id,
        photos: [],
        medicalFlags: [],
      },
    }),
    prisma.person.upsert({
      where: { id: 'person-5' },
      update: {},
      create: {
        id: 'person-5',
        treeId: tree.id,
        fullName: 'Jennifer Smith',
        givenName: 'Jennifer',
        familyName: 'Smith',
        gender: 'female',
        birthDate: new Date('1970-09-08'),
        createdById: user.id,
        photos: [],
        medicalFlags: [],
      },
    }),
    prisma.person.upsert({
      where: { id: 'person-6' },
      update: {},
      create: {
        id: 'person-6',
        treeId: tree.id,
        fullName: 'Michael Smith',
        givenName: 'Michael',
        familyName: 'Smith',
        gender: 'male',
        birthDate: new Date('1972-12-25'),
        createdById: user.id,
        photos: [],
        medicalFlags: [],
      },
    }),
    prisma.person.upsert({
      where: { id: 'person-7' },
      update: {},
      create: {
        id: 'person-7',
        treeId: tree.id,
        fullName: 'Emily Smith',
        givenName: 'Emily',
        familyName: 'Smith',
        gender: 'female',
        birthDate: new Date('1995-06-12'),
        createdById: user.id,
        photos: [],
        medicalFlags: [],
      },
    }),
    prisma.person.upsert({
      where: { id: 'person-8' },
      update: {},
      create: {
        id: 'person-8',
        treeId: tree.id,
        fullName: 'James Smith',
        givenName: 'James',
        familyName: 'Smith',
        gender: 'male',
        birthDate: new Date('1997-04-30'),
        createdById: user.id,
        photos: [],
        medicalFlags: [],
      },
    }),
  ])

  console.log(`Created ${people.length} people`)

  const relationships = await Promise.all([
    prisma.relationship.create({
      data: {
        treeId: tree.id,
        fromId: 'person-1',
        toId: 'person-3',
        type: 'parent',
        label: 'father',
      },
    }),
    prisma.relationship.create({
      data: {
        treeId: tree.id,
        fromId: 'person-2',
        toId: 'person-3',
        type: 'parent',
        label: 'mother',
      },
    }),
    prisma.relationship.create({
      data: {
        treeId: tree.id,
        fromId: 'person-1',
        toId: 'person-2',
        type: 'spouse',
        label: 'spouse',
      },
    }),
    prisma.relationship.create({
      data: {
        treeId: tree.id,
        fromId: 'person-3',
        toId: 'person-4',
        type: 'spouse',
        label: 'spouse',
      },
    }),
    prisma.relationship.create({
      data: {
        treeId: tree.id,
        fromId: 'person-3',
        toId: 'person-5',
        type: 'parent',
        label: 'father',
      },
    }),
    prisma.relationship.create({
      data: {
        treeId: tree.id,
        fromId: 'person-4',
        toId: 'person-5',
        type: 'parent',
        label: 'mother',
      },
    }),
    prisma.relationship.create({
      data: {
        treeId: tree.id,
        fromId: 'person-3',
        toId: 'person-6',
        type: 'parent',
        label: 'father',
      },
    }),
    prisma.relationship.create({
      data: {
        treeId: tree.id,
        fromId: 'person-4',
        toId: 'person-6',
        type: 'parent',
        label: 'mother',
      },
    }),
    prisma.relationship.create({
      data: {
        treeId: tree.id,
        fromId: 'person-5',
        toId: 'person-6',
        type: 'sibling',
        label: 'sister',
      },
    }),
    prisma.relationship.create({
      data: {
        treeId: tree.id,
        fromId: 'person-5',
        toId: 'person-7',
        type: 'parent',
        label: 'mother',
      },
    }),
    prisma.relationship.create({
      data: {
        treeId: tree.id,
        fromId: 'person-5',
        toId: 'person-8',
        type: 'parent',
        label: 'mother',
      },
    }),
    prisma.relationship.create({
      data: {
        treeId: tree.id,
        fromId: 'person-7',
        toId: 'person-8',
        type: 'sibling',
        label: 'sister',
      },
    }),
  ])

  console.log(`Created ${relationships.length} relationships`)
  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
