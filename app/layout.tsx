import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "geist/font"
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: "Jeevan Sai | Software Engineer",
  description: "Portfolio of Jeevan Sai Simbothula Mukundaiah, a Software Engineer II at Microsoft",
  keywords: ["Software Engineer", "React", "Next.js", "TypeScript", "Tailwind CSS", "Portfolio", "Jeevan Sai", "JeevanDev"],
  authors: [{ name: "Jeevan Sai" }],
  creator: "Jeevan Sai",
}

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Analytics />
          <Toaster 
            position="top-right"
            richColors
            toastOptions={{
              style: {
                background: 'oklch(var(--popover))',
                border: '1px solid oklch(var(--border))',
                color: 'oklch(var(--foreground))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
