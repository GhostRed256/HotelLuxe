"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useAuth } from "@/lib/auth-context"
import { Moon, Sun, Menu, User } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { user, isAdmin, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-[var(--border-color)]" 
      style={{ 
        position: "sticky", 
        top: 0, 
        zIndex: 100, 
        backgroundColor: "var(--background)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Link href="/" className="flex items-center gap-2">
          {mounted && (
            <img 
              src={resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"} 
              alt="StayNjoy Logo" 
              className="h-10 w-auto"
              style={{ objectFit: "contain" }}
            />
          )}
          <span style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.5px", fontFamily: "var(--font-heading)" }} className="hidden sm:inline-block">
            Stay-<span style={{ color: "var(--accent-primary)" }}>N</span>-Joy
          </span>
        </Link>
        <div style={{ display: "none" }} className="desktop-nav">
          <Link href="/rooms" className="nav-link" style={{ fontWeight: 500 }}>Rooms</Link>
          <Link href="/about" className="nav-link" style={{ fontWeight: 500 }}>About</Link>
          <Link href="/contact" className="nav-link" style={{ fontWeight: 500 }}>Contact</Link>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {mounted && (
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            style={{ background: "transparent", padding: "8px", borderRadius: "50%", cursor: "pointer", border: "none" }}
            aria-label="Toggle Dark Mode"
          >
            {resolvedTheme === "dark" ? <Sun size={20} color="var(--accent-primary)" /> : <Moon size={20} color="var(--foreground)" />}
          </motion.button>
        )}

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {isAdmin && (
              <Link href="/admin" className="nav-link" style={{ fontWeight: 600, color: "var(--accent-primary)" }}>Dashboard</Link>
            )}
            <button className="btn-outline" onClick={() => signOut()} style={{ padding: "8px 16px" }}>Sign Out</button>
          </div>
        ) : (
          <Link href="/login" className="btn-primary" style={{ padding: "8px 16px" }}>Sign In</Link>
        )}
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
            gap: 2rem;
          }
        }
      `}</style>
    </motion.nav>
  )
}
