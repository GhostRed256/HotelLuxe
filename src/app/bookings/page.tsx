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

  return (
    <div className="max-w-4xl mx-auto p-8 pt-32 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-cinzel gold-gradient-text mb-4">
          My Royal Bookings
        </h1>
        <p className="opacity-70 italic">Track your request status and confirmation details.</p>
      </div>

      <form onSubmit={handleSearch} className="glass-panel p-6 mb-12 flex flex-col md:flex-row gap-4 items-end justify-center max-w-2xl mx-auto">
        <div className="flex-1 w-full">
          <label className="form-label">Email Used for Booking</label>
          <input 
            type="email" 
            placeholder="king@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2 h-[48px]">
          {isLoading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
          Search
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[var(--accent-primary)] h-12 w-12" />
        </div>
      ) : searched && bookings.length === 0 ? (
        <div className="text-center py-20 opacity-50 italic">
          No bookings found for this email.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {bookings.map((booking, index) => (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-8 border-l-4 border-l-[var(--gold-primary)]"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1
                      ${booking.status === 'APPROVED' ? 'bg-green-500/20 text-green-600' : 
                        booking.status === 'REJECTED' ? 'bg-red-500/20 text-red-600' : 
                        'bg-yellow-500/20 text-yellow-600'}`}>
                      {booking.status === 'APPROVED' ? <CheckCircle size={12} /> : 
                       booking.status === 'REJECTED' ? <XCircle size={12} /> : 
                       <Clock size={12} />}
                      {booking.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-cinzel mb-2">{booking.room?.name || "Suite Request"}</h3>
                  <p className="text-sm opacity-70 mb-4">{booking.room?.location} • {booking.room?.type}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold opacity-60 uppercase mb-1">Stay Duration</div>
                  <div className="text-lg font-cinzel">
                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {booking.status === 'APPROVED' && (
                <div className="mt-6 p-4 bg-green-500/5 rounded-lg border border-green-500/20 text-sm">
                  <p className="text-green-700 dark:text-green-400 font-medium">
                    ✨ Your stay is confirmed! A confirmation email has been sent to {booking.customerEmail}. 
                    Please present it at check-in.
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
