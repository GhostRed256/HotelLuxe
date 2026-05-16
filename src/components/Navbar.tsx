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
  const { user, isAdmin, loading, signOut } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Dynamic background color based on scroll and theme
  const getNavBg = () => {
    if (resolvedTheme === "dark") {
      return scrolled ? "rgba(10, 3, 7, 0.9)" : "transparent"
    }
    return "rgba(229, 184, 173, 1)" // Forced Premium Rose Gold (Never White)
  }

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 py-4 backdrop-blur-sm ${
        scrolled ? "backdrop-blur-md border-b border-black/5 dark:border-white/5 shadow-lg" : "bg-[#E5B8AD] dark:bg-black/10 border-b border-[var(--gold-primary)]/20"
      }`}
      style={{ backgroundColor: getNavBg() }}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
         {/* Logo Section */}
         <div className="flex items-center gap-4">
           <Logo className="h-16 md:h-20" />
         </div>
 
         {/* Desktop Nav - Centered */}
         <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
           {["Home", "Rooms", "About", "Contact"].map((item) => (
             <Link 
               key={item} 
               href={item === "Home" ? "/" : `/${item.toLowerCase()}`} 
               className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all drop-shadow-sm ${
                 scrolled ? "text-[var(--foreground)] hover:text-[var(--accent-primary)]" : "!text-[#1A0811] hover:text-[var(--accent-primary)] dark:!text-white dark:hover:text-[var(--accent-primary)]"
               }`}
             >
               {item}
             </Link>
           ))}
           
           {mounted && !loading && (
             <>
               {isAdmin ? (
                 <Link href="/admin" className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all drop-shadow-sm ${scrolled ? "text-[var(--foreground)] hover:text-[var(--accent-primary)]" : "!text-[#1A0811] hover:text-[var(--accent-primary)] dark:!text-white dark:hover:text-[var(--accent-primary)]"}`}>Admin</Link>
               ) : user ? (
                 <Link href="/bookings" className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all drop-shadow-sm ${scrolled ? "text-[var(--foreground)] hover:text-[var(--accent-primary)]" : "!text-[#1A0811] hover:text-[var(--accent-primary)] dark:!text-white dark:hover:text-[var(--accent-primary)]"}`}>Bookings</Link>
               ) : null}
             </>
           )}
         </div>
 
         {/* Right Side - CTAs */}
         <div className="hidden md:flex items-center gap-8">
           {mounted && (
             <button 
               onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
               className={`transition-transform hover:scale-110 ${scrolled ? "text-[var(--foreground)]" : "!text-[#1A0811] dark:!text-white"}`}
               aria-label="Toggle theme"
             >
               {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
             </button>
           )}
 
           {mounted && !loading && (
             <div className="flex items-center gap-6">
               {isAdmin ? (
                 <div className="flex items-center gap-6">
                   <Link 
                     href="/admin" 
                     className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all drop-shadow-sm ${scrolled ? "text-rose-500" : "!text-rose-600 dark:!text-rose-400"}`}
                   >
                     <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                     Staff Panel
                   </Link>
                   <button 
                     onClick={() => signOut()}
                     className={`text-[10px] font-bold tracking-[0.2em] uppercase drop-shadow-sm ${scrolled ? "text-[var(--foreground)] hover:text-rose-500" : "!text-[#1A0811] hover:text-rose-500 dark:!text-white dark:hover:text-rose-400"} transition-colors`}
                   >
                     Sign Out
                   </button>
                 </div>
               ) : user ? (
                 <div className="flex items-center gap-6">
                   <Link href="/bookings" className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all drop-shadow-sm ${scrolled ? "text-[var(--foreground)] hover:text-[var(--accent-primary)]" : "!text-[#1A0811] hover:text-[var(--accent-primary)] dark:!text-white dark:hover:text-[var(--accent-primary)]"}`}>
                     My Stays
                   </Link>
                   <button 
                     onClick={() => signOut()}
                     className={`text-[10px] font-bold tracking-[0.2em] uppercase drop-shadow-sm ${scrolled ? "text-[var(--foreground)] hover:text-rose-500" : "!text-[#1A0811] hover:text-rose-500 dark:!text-white dark:hover:text-rose-400"} transition-colors`}
                   >
                     Sign Out
                   </button>
                 </div>
               ) : (
                 <div className="flex items-center gap-4">
                   <Link href="/login" className={`text-[10px] font-bold tracking-[0.2em] uppercase drop-shadow-sm ${scrolled ? "text-[var(--foreground)] hover:text-[var(--accent-primary)]" : "!text-[#1A0811] hover:text-[var(--accent-primary)] dark:!text-white dark:hover:text-[var(--accent-primary)]"}`}>
                     Guest Sign In
                   </Link>
                   <span className="w-[1px] h-3 bg-rose-500/20" />
                   <Link href="/admin/login" className="text-[9px] font-black tracking-[0.2em] uppercase text-rose-500/40 hover:text-rose-500 transition-colors">
                     Staff
                   </Link>
                 </div>
               )}
               
               <Link 
                 href={isAdmin ? "/admin/rooms" : "/rooms"} 
                 className={`btn-primary !py-2.5 !px-8 !text-[9px] !font-black tracking-[0.2em] uppercase shadow-xl hover:scale-105 active:scale-95 transition-all ${
                   scrolled ? "" : "dark:!bg-white dark:!text-black !bg-[var(--accent-primary)] !text-white border-transparent"
                 }`}
               >
                 {isAdmin ? "Manage Suites" : "Book A Stay"}
               </Link>
             </div>
           )}
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
          
          {mounted && !loading && (
            <>
              {isAdmin ? (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="nav-link text-lg font-bold">Admin Panel</Link>
              ) : user ? (
                <Link href="/bookings" onClick={() => setMobileMenuOpen(false)} className="nav-link text-lg font-bold">My Bookings</Link>
              ) : null}
            </>
          )}

          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="nav-link text-lg font-bold">About</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="nav-link text-lg font-bold">Contact</Link>
          
          {user ? (
            <button 
              onClick={() => {
                signOut()
                setMobileMenuOpen(false)
              }} 
              className="btn-outline w-2/3 border-rose-500/50 text-rose-500"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-2/3">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  )
}
