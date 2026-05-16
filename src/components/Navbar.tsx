"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Menu, X, Moon, Sun, ShieldCheck, User } from "lucide-react"
import Logo from "./Logo"
import { useAuth } from "@/lib/auth-context"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const { user, isAdmin, loading, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getNavBg = () => {
    if (resolvedTheme === "dark") {
      return scrolled ? "rgba(10, 3, 7, 0.9)" : "transparent"
    }
    return "rgba(229, 184, 173, 1)"
  }

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 py-3 backdrop-blur-sm ${
        scrolled ? "backdrop-blur-md border-b border-black/5 dark:border-white/5 shadow-lg" : "bg-[#E5B8AD] dark:bg-black/10 border-b border-[var(--gold-primary)]/20"
      }`}
      style={{ backgroundColor: getNavBg() }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
         {/* Logo Section */}
         <div className="flex items-center">
            <Logo className="h-14 md:h-16" />
         </div>
  
         {/* Desktop Nav - Navigation Links */}
         <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
            {["Home", "Rooms", "About", "Contact"].map((item) => (
              <Link 
                key={item} 
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`} 
                className={`text-[9px] font-black tracking-[0.3em] uppercase transition-all ${
                  scrolled ? "text-[var(--foreground)] hover:text-[var(--accent-primary)]" : "text-[#1A0811] hover:text-[var(--accent-primary)] dark:text-white"
                }`}
              >
                {item}
              </Link>
            ))}
         </div>
  
         {/* Right Side - Session & Actions */}
         <div className="hidden md:flex items-center gap-6 relative z-10">
            {mounted && (
              <button 
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className={`p-2 transition-transform hover:rotate-12 ${scrolled ? "text-[var(--foreground)]" : "text-[#1A0811] dark:text-white"}`}
              >
                {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
  
            {mounted && !loading && (
              <div className="flex items-center gap-6">
                {isAdmin ? (
                  <div className="flex items-center gap-5">
                    <Link 
                      href="/admin" 
                      className={`flex items-center gap-2 text-[9px] font-black tracking-[0.2em] uppercase px-4 py-2 bg-rose-500 text-white rounded-full shadow-lg shadow-rose-500/20 transition-all hover:scale-105 active:scale-95`}
                    >
                      <ShieldCheck size={14} />
                      Staff Dashboard
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className={`text-[9px] font-bold tracking-[0.2em] uppercase transition-colors ${scrolled ? "text-rose-500 hover:text-rose-600" : "text-[#1A0811] hover:text-rose-600 dark:text-rose-400"}`}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : user ? (
                  <div className="flex items-center gap-5">
                    <Link href="/bookings" className={`flex items-center gap-2 text-[9px] font-black tracking-[0.2em] uppercase transition-all ${scrolled ? "text-[var(--foreground)]" : "text-[#1A0811] dark:text-white"}`}>
                      <User size={14} className="text-[var(--accent-primary)]" />
                      My Stays
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className={`text-[9px] font-bold tracking-[0.2em] uppercase transition-colors ${scrolled ? "text-rose-500 hover:text-rose-600" : "text-[#1A0811] hover:text-rose-600 dark:text-rose-400"}`}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link href="/login" className={`text-[9px] font-black tracking-[0.2em] uppercase px-5 py-2 border border-black/10 dark:border-white/10 rounded-full transition-all ${scrolled ? "text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]" : "text-[#1A0811] hover:bg-[#1A0811] hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black"}`}>
                      Sign In
                    </Link>
                    <span className="w-[1px] h-3 bg-rose-500/30" />
                    <Link href="/admin/login" className="text-[9px] font-black tracking-[0.2em] uppercase text-rose-500 hover:text-rose-600 transition-colors">
                      Staff Portal
                    </Link>
                  </div>
                )}
                
                {!isAdmin && (
                  <Link 
                    href="/rooms" 
                    className={`btn-primary !py-2.5 !px-8 !text-[9px] !font-black tracking-[0.3em] uppercase shadow-xl hover:scale-105 transition-all ${
                      scrolled ? "" : "dark:!bg-white dark:!text-black !bg-[var(--accent-primary)] !text-white"
                    }`}
                  >
                    Book A Stay
                  </Link>
                )}
              </div>
            )}
         </div>
  
         {/* Mobile Toggle */}
         <div className="md:hidden flex items-center gap-4">
            {mounted && (
              <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="p-2 text-rose-500">
                {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[#1A0811] dark:text-white">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
         </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#E5B8AD] dark:bg-black border-t border-black/5 p-6 flex flex-col gap-6 shadow-2xl">
          {["Home", "Rooms", "About", "Contact"].map((item) => (
            <Link key={item} href={item === "Home" ? "/" : `/${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-[12px] font-black tracking-widest uppercase">
              {item}
            </Link>
          ))}
          <div className="pt-4 border-t border-black/10 flex flex-col gap-4">
            {isAdmin ? (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[12px] font-black uppercase text-rose-500">Dashboard</Link>
            ) : user ? (
              <Link href="/bookings" onClick={() => setMobileMenuOpen(false)} className="text-[12px] font-black uppercase">My Stays</Link>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[12px] font-black uppercase">Guest Login</Link>
            )}
            <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-left text-[12px] font-black uppercase opacity-50">Sign Out</button>
          </div>
        </div>
      )}
    </nav>
  )
}
