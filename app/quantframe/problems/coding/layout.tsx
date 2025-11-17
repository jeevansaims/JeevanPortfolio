// app/quantframe/problems/coding/layout.tsx
'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function CodingProblemsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Pyodide script loaded')
        }}
        onError={(e) => {
          console.error('Failed to load Pyodide:', e)
        }}
      />
      {children}
    </>
  )
}