import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PostgresML Chatbot Demo',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-800">{children}</body>
    </html>
  )
}
