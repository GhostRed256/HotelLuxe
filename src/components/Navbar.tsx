"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Menu, X, Moon, Sun } from "lucide-react"
import Logo from "./Logo"
import { useAuth } from "@/lib/auth-context"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { user, isAdmin, loading } = useAuth()
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
        <div className="flex items-center gap-4">
          <Logo className="h-12" />
          <span className="hidden lg:inline-block text-xl font-bold font-heading tracking-tight">
            Stay<span className="text-[var(--accent-primary)]">N</span>joy
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="nav-link text-[11px] font-bold tracking-[0.2em] uppercase opacity-80 hover:opacity-100">Home</Link>
          <Link href="/rooms" className="nav-link text-[11px] font-bold tracking-[0.2em] uppercase opacity-80 hover:opacity-100">Rooms</Link>
          <Link href="/bookings" className="nav-link text-[11px] font-bold tracking-[0.2em] uppercase opacity-80 hover:opacity-100">My Bookings</Link>
          <Link href="/about" className="nav-link text-[11px] font-bold tracking-[0.2em] uppercase opacity-80 hover:opacity-100">About</Link>
          <Link href="/contact" className="nav-link text-[11px] font-bold tracking-[0.2em] uppercase opacity-80 hover:opacity-100">Contact</Link>
          
          <div className="flex items-center gap-6 ml-6 border-l border-white/10 pl-6">
            {mounted && (
              <button 
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="text-[var(--accent-primary)] hover:scale-110 transition-transform"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            {mounted && !loading && (
              <>
                {isAdmin ? (
                  <>
                    <Link href="/admin" className="nav-link text-[11px] font-bold tracking-[0.2em] uppercase opacity-80 hover:opacity-100">
                      Admin Panel
                    </Link>
                    <Link href="/admin?tab=manual" className="btn-primary !py-2 !px-6 !text-[10px]">
                      Book Now
                    </Link>
                  </>
                ) : (
                  <Link href="/rooms" className="btn-primary !py-2 !px-6 !text-[10px]">
                    Book Now
                  </Link>
                )}
              </>
            )}
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
          <Link href="/bookings" onClick={() => setMobileMenuOpen(false)} className="nav-link text-lg font-bold">My Bookings</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="nav-link text-lg font-bold">About</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="nav-link text-lg font-bold">Contact</Link>
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-2/3">Sign In</Link>
        </div>
      )}
    </nav>
  )
}
