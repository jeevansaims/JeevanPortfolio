import type { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
  title: "Sandhya | Photography",
  description: "Photography portfolio by Sandhya",
  openGraph: {
    title: "Sandhya | Photography",
    description: "Photography portfolio by Sandhya",
  },
}

export default function SandhyaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  )
}
