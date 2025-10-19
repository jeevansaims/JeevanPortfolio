"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function AcademyNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800"
          : "md:bg-transparent bg-zinc-900/95 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/academy" className="font-bold text-xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
              Mirkovic
            </span>
            <span className="text-white">Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/academy"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Portfolio
            </Link>
            <Link href="/learn">
              <Button
                size="sm"
                className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 border-0"
              >
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu - ONLY mobile styling improvements */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-md rounded-b-lg">
            <Link
              href="/academy"
              className="block px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all mx-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all mx-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Portfolio
            </Link>
            <div className="px-2 pt-2">
              <Link href="/learn" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-phthalo-600 to-phthalo-800 border-0"
                >
                  Register
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}