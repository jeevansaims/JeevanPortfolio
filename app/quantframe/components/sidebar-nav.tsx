"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useLayoutEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FolderKanban,
  GraduationCap,
  BookOpen,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  Puzzle,
  Zap,
  BarChart3,
} from "lucide-react"
import { logout } from "../actions/auth"

interface SidebarNavProps {
  userEmail?: string
}

export function SidebarNav({ userEmail }: SidebarNavProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Use useLayoutEffect to set initial width BEFORE paint (prevents layout shift)
  useLayoutEffect(() => {
    const updateSidebarWidth = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        document.documentElement.style.setProperty(
          '--sidebar-width',
          isCollapsed ? '80px' : '256px'
        )
      } else {
        document.documentElement.style.setProperty('--sidebar-width', '0px')
      }
    }
    
    updateSidebarWidth()
    window.addEventListener('resize', updateSidebarWidth)
    
    return () => window.removeEventListener('resize', updateSidebarWidth)
  }, [isCollapsed])

  const navItems = [
    {
      href: "/quantframe/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/quantframe/projects",
      label: "Projects",
      icon: FolderKanban,
    },
    {
      href: "/quantframe/programs",
      label: "Programs",
      icon: GraduationCap,
    },
    {
      href: "/quantframe/journal",
      label: "Journal",
      icon: BookOpen,
    },
    {
      href: "/quantframe/practice",
      label: "Practice",
      icon: TrendingUp,
    },
    {
      href: "/quantframe/problems",
      label: "Problems",
      icon: Puzzle,
    },
    {
      href: "/quantframe/daily",
      label: "Daily Challenge",
      icon: Zap,
    },
  ]

  const bottomNavItems = [
    {
      href: "/quantframe/progress",
      label: "Progress",
      icon: BarChart3,
    },
    {
      href: "/quantframe/subscription",
      label: "Subscription",
      icon: CreditCard,
    },
    {
      href: "/quantframe/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  const isActive = (href: string) => {
    // Check if current path matches exactly OR if it's a nested route
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Mobile Top Navbar */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/quantframe/dashboard" className="font-bold text-xl inline-flex items-baseline">
              <span className="relative inline-block text-phthalo-500">
                Quant
              </span>
              <span className="text-white">Frame</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="py-4 space-y-1 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-md rounded-b-lg">
              {/* User Email */}
              {userEmail && (
                <div className="px-4 py-2 text-sm text-zinc-400 border-b border-zinc-800/50 mb-2">
                  {userEmail}
                </div>
              )}

              {/* Main Nav Items */}
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all mx-2 ${
                      active
                        ? "bg-gradient-to-r from-phthalo-600/20 to-phthalo-800/20 text-white border-l-2 border-phthalo-500"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* Divider */}
              <div className="border-t border-zinc-800/50 my-3" />

              {/* Bottom Nav Items */}
              {bottomNavItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all mx-2 ${
                      active
                        ? "bg-gradient-to-r from-phthalo-600/20 to-phthalo-800/20 text-white border-l-2 border-phthalo-500"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* Logout */}
              <form action={logout} className="px-2 pt-2">
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogOut className="mr-3" size={20} />
                  Logout
                </Button>
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed right-0 top-0 h-screen bg-zinc-900 border-l border-zinc-800 transition-all duration-300 z-40 overflow-hidden ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-zinc-800">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-all flex-shrink-0"
          >
            {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          {!isCollapsed && (
            <Link href="/quantframe/dashboard" className="font-bold text-xl inline-flex items-baseline">
              <span className="relative inline-block text-phthalo-500">
                Quant
              </span>
              <span className="text-white">Frame</span>
            </Link>
          )}
          {isCollapsed && <div className="flex-1" />}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-gradient-to-r from-phthalo-600/20 to-phthalo-800/20 text-white border-l-2 border-phthalo-500"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 py-4 space-y-1 border-t border-zinc-800 flex-shrink-0">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-gradient-to-r from-phthalo-600/20 to-phthalo-800/20 text-white border-l-2 border-phthalo-500"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            )
          })}

          {/* Logout Button */}
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              className={`w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/50 ${
                isCollapsed ? "px-0 justify-center" : ""
              }`}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut className={`${isCollapsed ? "" : "mr-3"} flex-shrink-0`} size={20} />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </Button>
          </form>

          {/* User Email (collapsed state shows nothing, expanded shows email) */}
          {!isCollapsed && userEmail && (
            <div className="px-3 py-2 text-xs text-zinc-500 truncate border-t border-zinc-800 mt-2 pt-3">
              {userEmail}
            </div>
          )}
        </div>
      </aside>

      {/* Spacer for mobile top nav */}
      <div className="lg:hidden h-16" />
    </>
  )
}