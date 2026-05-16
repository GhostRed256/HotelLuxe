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

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-500 py-3 backdrop-blur-sm ${
        scrolled 
          ? "bg-[#E5B8AD] dark:bg-[#0A0307]/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 shadow-lg" 
          : "bg-[#E5B8AD] dark:bg-transparent border-b border-[var(--gold-primary)]/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
         {/* Logo - Flex Item */}
         <div className="flex-shrink-0">
            <Logo className="h-12 md:h-16" />
         </div>
  
         {/* Desktop Nav - Middle Links (Only visible on large screens to avoid overlap) */}
         <div className="hidden lg:flex items-center gap-10 flex-1 justify-center whitespace-nowrap">
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
  
         {/* Right Side - Actions (Always visible, Flex End) */}
         <div className="hidden md:flex items-center gap-6 flex-shrink-0 ml-auto relative z-10">
            {mounted && (
              <button 
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className={`p-2 transition-transform hover:scale-110 ${scrolled ? "text-[var(--foreground)]" : "text-[#1A0811] dark:text-white"}`}
              >
                {resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}
  
            {mounted && !loading && (
              <div className="flex items-center gap-6">
                {isAdmin ? (
                  <div className="flex items-center gap-4">
                    <Link 
                      href="/admin" 
                      className="flex items-center gap-2 text-[9px] font-black tracking-[0.2em] uppercase px-4 py-2 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition-all"
                    >
                      <ShieldCheck size={14} />
                      Dashboard
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
                    <span className="w-[1px] h-3 bg-rose-500/20" />
                    <button 
                      onClick={async () => {
                        await signOut()
                        window.location.assign("/staff-login")
                      }}
                      className="text-[9px] font-black tracking-[0.2em] uppercase text-rose-500/60 hover:text-rose-500 transition-colors"
                    >
                      Staff
                    </button>
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
                    <span className="w-[1px] h-3 bg-rose-500/20" />
                    <button 
                      onClick={async () => {
                        await signOut()
                        window.location.assign("/staff-login")
                      }}
                      className="text-[9px] font-black tracking-[0.2em] uppercase text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      Staff Portal
                    </button>
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
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0A0307] border-t border-black/5 dark:border-white/5 p-6 flex flex-col gap-6 shadow-2xl z-[110]">
          {["Home", "Rooms", "About", "Contact"].map((item) => (
            <Link key={item} href={item === "Home" ? "/" : `/${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-[12px] font-black tracking-widest uppercase text-black dark:text-white hover:text-rose-500 transition-colors">
              {item}
            </Link>
          ))}
          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-4">
            {isAdmin ? (
              <>
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[12px] font-black uppercase text-rose-500 hover:text-rose-600 transition-colors">Dashboard</Link>
                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-left text-[12px] font-black uppercase text-black dark:text-white opacity-80 hover:opacity-100 transition-opacity">Sign Out</button>
              </>
            ) : user ? (
              <>
                <Link href="/bookings" onClick={() => setMobileMenuOpen(false)} className="text-[12px] font-black uppercase text-black dark:text-white hover:text-[var(--accent-primary)] transition-colors">My Stays</Link>
                <button 
                  onClick={async () => {
                    await signOut()
                    setMobileMenuOpen(false)
                    window.location.assign("/staff-login")
                  }}
                  className="text-left text-[12px] font-black uppercase text-rose-500/80 hover:text-rose-500 transition-colors"
                >
                  Staff Portal
                </button>
                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-left text-[12px] font-black uppercase text-black dark:text-white opacity-80 hover:opacity-100 transition-opacity">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[12px] font-black uppercase text-black dark:text-white hover:text-[var(--accent-primary)] transition-colors">Guest Login</Link>
                <button 
                  onClick={async () => {
                    await signOut()
                    setMobileMenuOpen(false)
                    window.location.assign("/staff-login")
                  }}
                  className="text-left text-[12px] font-black uppercase text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Staff Portal
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
