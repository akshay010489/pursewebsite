import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Luxury Purses - Premium Handbags Collection',
  description: 'Shop the finest collection of luxury purses and handbags',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
