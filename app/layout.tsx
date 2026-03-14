import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Pharmacist App - ระบบจัดการข้อมูลเภสัชกรรม',
  description: 'ระบบจัดการข้อมูลยา โรค และผู้ป่วยสำหรับเภสัชกร',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="font-sans">
        <Navigation />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}
