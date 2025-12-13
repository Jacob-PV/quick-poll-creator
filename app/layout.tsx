import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Quick Poll Creator - Create Polls That Pop!',
  description: 'Create and share polls instantly with real-time results. No login required. Built with Next.js 14 and featuring a bold Neo-Brutalist design.',
  keywords: ['poll creator', 'voting', 'polls', 'surveys', 'real-time results', 'instant polls'],
  authors: [{ name: 'Quick Poll Creator' }],
  openGraph: {
    title: 'Quick Poll Creator',
    description: 'Create and share polls instantly with real-time results. No login required.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quick Poll Creator',
    description: 'Create and share polls instantly with real-time results. No login required.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-body">{children}</body>
    </html>
  )
}
