"use client"
export const dynamic = "force-dynamic"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Loader2, CheckCircle, Clock, XCircle, AlertCircle, Hash, Phone as PhoneIcon, Mail as MailIcon } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { normalizeGuestIdentifier, formatGuestIdentifierForDisplay } from "@/lib/utils"

export default function MyBookingsPage() {
  const [inputValue, setInputValue] = useState("")
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [hasAutoSearched, setHasAutoSearched] = useState(false)
  const [error, setError] = useState("")
  const { user, userData } = useAuth()

  const performSearch = useCallback(async (identifier: string) => {
    if (!identifier) return
    setIsLoading(true)
    setError("")
    
    // Normalize input (e.g. phone to internal email)
    const normalizedEmail = normalizeGuestIdentifier(identifier)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(normalizedEmail)}`, {
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to fetch bookings")
      }
      
      setBookings(Array.isArray(data) ? data : [])
      setSearched(true)
    } catch (err: any) {
      clearTimeout(timeoutId)
      console.error("Search Error:", err)
      if (err.name === 'AbortError') {
        setError("Connection timeout: The server is taking too long to respond. Please try again.")
      } else {
        setError(err.message || "An unexpected error occurred while fetching your bookings.")
      }
      setBookings([])
      setSearched(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const targetIdentifier = userData?.email || user?.email
    
    if (targetIdentifier && !hasAutoSearched && !isLoading) {
      // For display, we strip the internal patterns
      setInputValue(formatGuestIdentifierForDisplay(targetIdentifier))
      performSearch(targetIdentifier)
      setHasAutoSearched(true)
    }
  }, [user, userData, hasAutoSearched, isLoading, performSearch])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue || isLoading) return
    performSearch(inputValue)
  }

  const fmtDate = (d: any) => {
    if (!d) return "N/A"
    try {
      const date = new Date(d)
      if (isNaN(date.getTime())) return "Invalid Date"
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return "N/A"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 pt-32 min-h-screen bg-[var(--background)]">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-7xl font-heading font-black tracking-tight mb-4">
          My <span className="text-[var(--accent-primary)]">Bookings</span>
        </h1>
        <p className="opacity-40 font-light italic text-lg">Track your reservation status and confirmations.</p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-20 group">
        <div className="glass-panel p-2 pl-6 flex items-center gap-4 border-white/10 group-focus-within:border-[var(--accent-primary)]/30 transition-all duration-500 shadow-2xl">
          <div className="opacity-30 group-focus-within:opacity-100 group-focus-within:text-[var(--accent-primary)] transition-all">
            {inputValue.includes('@') ? <MailIcon size={20} /> : <PhoneIcon size={20} />}
          </div>
          <div className="flex-1">
            <label className="absolute -top-3 left-6 bg-[var(--background)] px-3 text-[9px] font-black tracking-[0.2em] uppercase text-[var(--accent-primary)] z-10">
              Booking Lookup
            </label>
            <input 
              type="text" 
              placeholder="Enter Phone Number or Email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
              className="w-full bg-transparent border-none py-4 text-lg font-medium focus:ring-0 outline-none placeholder:opacity-20"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading} 
            className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white p-4 rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center min-w-[60px]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={22} /> : <Search size={22} />}
          </button>
        </div>
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] opacity-20 font-bold">
          Input your registered 10-digit phone or email address
        </p>
      </form>

      {error && (
        <div className="max-w-2xl mx-auto mb-10 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4 text-rose-500">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest mb-1">Search Error</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[var(--accent-primary)] h-12 w-12" />
        </div>
      ) : searched && bookings.length === 0 && !error ? (
        <div className="text-center py-20">
          <p className="opacity-30 italic font-light text-lg mb-8">No bookings found for this email address.</p>
          <Link href="/rooms" className="btn-primary !px-10 !py-4 inline-flex items-center gap-3">
            <span>Explore Suites & Book</span>
          </Link>
        </div>
      ) : Array.isArray(bookings) && bookings.length > 0 ? (
        <div className="flex flex-col gap-8">
          {bookings.map((booking, index) => (
            <motion.div 
              key={booking.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-10 border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 border
                      ${booking.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                        booking.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                        'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                      {booking.status === 'APPROVED' ? <CheckCircle size={12} /> : 
                       booking.status === 'REJECTED' ? <XCircle size={12} /> : 
                       <Clock size={12} />}
                      {booking.status || "PENDING"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-2">{booking.room?.name || "Suite Request"}</h3>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-30">
                    {booking.room?.location || "Resort Grounds"} • {booking.room?.type || "Luxury Suite"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30 mb-2">Duration</div>
                  <div className="text-lg font-heading font-bold">
                    {fmtDate(booking.checkIn)} — {fmtDate(booking.checkOut)}
                  </div>
                </div>
              </div>
              
              {booking.status === 'APPROVED' && (
                <div className="mt-8 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-sm">
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                    ✨ Your stay is confirmed! A confirmation email has been sent to {booking.customerEmail}. 
                    Please present it at check-in.
                  </p>
                </div>
              )}

              {booking.status === 'PENDING' && (
                <div className="mt-8 p-6 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-sm">
                  <p className="text-amber-600 dark:text-amber-400 font-medium">
                    ⏳ Your request is being reviewed. You'll receive an email confirmation once approved.
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
