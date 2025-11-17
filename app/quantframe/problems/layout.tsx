// app/quantframe/problems/coding/layout.tsx
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
        strategy="beforeInteractive"
      />
      {children}
    </>
  )
}