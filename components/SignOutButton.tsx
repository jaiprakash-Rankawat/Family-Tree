'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  )
}
