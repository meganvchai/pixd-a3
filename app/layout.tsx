import './globals.css'
import type { Metadata } from 'next'
import Navbar from './components/navbar'

export const metadata: Metadata = {
  title: "Megan's Archive",
  description: 'A visual archive of items',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
