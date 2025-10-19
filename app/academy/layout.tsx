import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Mirkovic Academy - Break into Quant',
  description: 'Learn the math, code, and mindset that top quant firms look for.',
}

export default function AcademyLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
    </>
  )
}