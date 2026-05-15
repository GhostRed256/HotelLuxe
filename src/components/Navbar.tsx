"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Menu, X, Moon, Sun } from "lucide-react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Dynamic background color based on scroll and theme
  const getNavBg = () => {
    if (!scrolled) return "transparent"
    return resolvedTheme === "dark" 
      ? "rgba(10, 3, 7, 0.9)" // Match new darker background
      : "rgba(255, 255, 255, 0.92)"
  }

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 py-4 ${
        scrolled ? "backdrop-blur-md border-b border-black/5 dark:border-white/5 shadow-sm" : "bg-transparent"
      }`}
      style={{ backgroundColor: getNavBg() }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            {mounted ? (
              <img 
                src={resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"} 
                alt="StayNjoy Logo" 
                className="h-12 w-auto object-contain cursor-pointer transform transition-transform group-hover:scale-105"
                onClick={() => window.location.href = "/"}
              />
            ) : (
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
            )}
            <div className="absolute -inset-2 bg-[var(--accent-primary)]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
          <span className="hidden sm:inline-block text-2xl font-bold font-cinzel">
            Stay-<span className="text-[var(--accent-primary)]">N</span>-Joy
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="nav-link text-sm font-semibold tracking-wider uppercase">Home</Link>
          <Link href="/rooms" className="nav-link text-sm font-semibold tracking-wider uppercase">Rooms</Link>
          <Link href="/about" className="nav-link text-sm font-semibold tracking-wider uppercase">About</Link>
          <Link href="/contact" className="nav-link text-sm font-semibold tracking-wider uppercase">Contact</Link>
          
          <div className="flex items-center gap-4 ml-4">
            {mounted && (
              <button 
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--accent-primary)]"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <Link href="/login" className="btn-primary text-[10px] px-6 py-2">
              Sign In
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          {mounted && (
            <button 
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 text-[var(--accent-primary)]"
            >
              {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[var(--accent-primary)]"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full w-full py-8 flex flex-col items-center gap-6 animate-in slide-in-from-top duration-300 bg-[var(--background)] border-b border-[var(--border-color)]">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="nav-link text-lg font-bold">Home</Link>
          <Link href="/rooms" onClick={() => setMobileMenuOpen(false)} className="nav-link text-lg font-bold">Rooms</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="nav-link text-lg font-bold">About</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="nav-link text-lg font-bold">Contact</Link>
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-2/3">Sign In</Link>
        </div>
      )}
    </nav>
  )
}
