import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import { Rubik } from 'next/font/google'
import './globals.css'

const rubik = Rubik({ variable: '--font-rubik', subsets: ['latin', 'hebrew'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PromptVault',
  description: 'הספרייה האישית שלי לפרומפטים מדהימים',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0f1117] text-slate-200">{children}</body>
    </html>
  )
}
