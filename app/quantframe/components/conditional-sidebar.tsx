'use client'

import { usePathname } from 'next/navigation'
import { SidebarNav } from './sidebar-nav'
import { QuantframeNav } from './academy-nav'

interface ConditionalSidebarProps {
  userEmail?: string
  hasPaid: boolean
  children: React.ReactNode
}

export function ConditionalSidebar({ userEmail, hasPaid, children }: ConditionalSidebarProps) {
  const pathname = usePathname()
  
  // Hide sidebar on the quantframe landing page
  const isquantframeLandingPage = pathname === '/quantframe'
  
  // Show sidebar only if user has paid AND not on landing page
  const showSidebar = hasPaid && !isquantframeLandingPage

  if (showSidebar) {
    return (
      <>
        <SidebarNav userEmail={userEmail} />
        <main 
          className="transition-all duration-300 lg:pr-64"
          style={{ 
            paddingRight: 'var(--sidebar-width, 0px)' 
          }}
        >
          {children}
        </main>
      </>
    )
  }

  return (
    <>
      <QuantframeNav />
      <main>{children}</main>
    </>
  )
}