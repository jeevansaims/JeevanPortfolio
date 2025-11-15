// app/academy/practice/coding/layout.tsx
'use client'

import Script from 'next/script'

export default function CodingLayout({
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
          console.error('Failed to load Pyodide script:', e)
        }}
      />
      {children}
    </>
  )
}