"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Loader2, CheckCircle, Clock, XCircle } from "lucide-react"

export default function MyBookingsPage() {
  const [email, setEmail] = useState("")
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsLoading(true)
    setSearched(true)
    
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      setBookings(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="max-w-4xl mx-auto p-8 pt-32 min-h-screen bg-[var(--background)]">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-7xl font-heading font-black tracking-tight mb-4">
          My <span className="text-[var(--accent-primary)]">Bookings</span>
        </h1>
        <p className="opacity-40 font-light italic text-lg">Track your reservation status and confirmations.</p>
      </div>

      <form onSubmit={handleSearch} className="glass-panel p-8 mb-16 flex flex-col md:flex-row gap-6 items-end justify-center max-w-2xl mx-auto border-white/5">
        <div className="flex-1 w-full">
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Registered Email</label>
          <input 
            type="email" 
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-3 !py-4 !px-10">
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          <span>Lookup</span>
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[var(--accent-primary)] h-12 w-12" />
        </div>
      ) : searched && bookings.length === 0 ? (
        <div className="text-center py-20 opacity-30 italic font-light text-lg">
          No bookings found for this email address.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {bookings.map((booking, index) => (
            <motion.div 
              key={booking.id}
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
                      {booking.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-2">{booking.room?.name || "Suite Request"}</h3>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-30">
                    {booking.room?.location} • {booking.room?.type}
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
      )}
    </div>
  )
}
