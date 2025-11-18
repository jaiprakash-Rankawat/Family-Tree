import Link from 'next/link'
import { TreePine, Users, Shield, Share2 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <TreePine className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">FamilyTree</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/signin"
              className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Build Your Family History Together
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Create, explore, and share your family tree with an intuitive
            visual interface. Collaborate with relatives and preserve your
            heritage for future generations.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white hover:bg-green-700"
          >
            Start Building Your Tree
          </Link>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <TreePine className="mb-4 h-12 w-12 text-green-600" />
            <h3 className="mb-2 text-xl font-semibold">Visual Tree Builder</h3>
            <p className="text-gray-600">
              Interactive canvas with drag-and-drop functionality and automatic
              layout
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <Users className="mb-4 h-12 w-12 text-blue-600" />
            <h3 className="mb-2 text-xl font-semibold">Collaborate</h3>
            <p className="text-gray-600">
              Invite family members and work together to build a complete
              history
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <Shield className="mb-4 h-12 w-12 text-purple-600" />
            <h3 className="mb-2 text-xl font-semibold">Privacy First</h3>
            <p className="text-gray-600">
              Control who sees what with granular privacy settings and consent
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <Share2 className="mb-4 h-12 w-12 text-orange-600" />
            <h3 className="mb-2 text-xl font-semibold">Share & Export</h3>
            <p className="text-gray-600">
              Export your tree as PDF or image, or share with custom links
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-24 border-t bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-gray-600">
          <p>&copy; 2024 FamilyTree. Built with care for preserving family histories.</p>
        </div>
      </footer>
    </div>
  )
}
