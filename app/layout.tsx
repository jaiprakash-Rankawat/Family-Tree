import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FamilyTree - Build Your Family History',
  description:
    'Create and explore your family tree with an intuitive, collaborative interface',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
