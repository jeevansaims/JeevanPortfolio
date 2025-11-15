'use client'

import { usePathname } from 'next/navigation'
import { SidebarNav } from './sidebar-nav'
import { AcademyNav } from './academy-nav'

interface ConditionalSidebarProps {
  userEmail?: string
  hasPaid: boolean
  children: React.ReactNode
}

export function ConditionalSidebar({ userEmail, hasPaid, children }: ConditionalSidebarProps) {
  const pathname = usePathname()
  
  // Hide sidebar on the academy landing page
  const isAcademyLandingPage = pathname === '/academy'
  
  // Show sidebar only if user has paid AND not on landing page
  const showSidebar = hasPaid && !isAcademyLandingPage

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
      <AcademyNav />
      <main>{children}</main>
    </>
  )
}