"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo, useRef } from "react"
import { requestBooking } from "@/app/actions"
import RoomCard from "./RoomCard"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function RoomGallery({ rooms = [], bookings = [] }: { rooms?: any[], bookings?: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  // Filters
  const [filterType, setFilterType] = useState("ALL")
  const [filterFloor, setFilterFloor] = useState("ALL")

  // Booking modal state
  const [bookingSuiteType, setBookingSuiteType] = useState("")
  const [bookingFloor, setBookingFloor] = useState("")
  const [bookingRoomId, setBookingRoomId] = useState("")
  const [showBookingModal, setShowBookingModal] = useState(false)

  const displayRooms = rooms.length > 0 ? rooms : []

  // Unique types and floors for filters
  const suiteTypes = useMemo(() => [...new Set(displayRooms.map((r: any) => r.type))].sort(), [displayRooms])
  const floors = useMemo(() => [...new Set(displayRooms.map((r: any) => r.floor))].sort(), [displayRooms])

  // Check if room is booked
  const isRoomBooked = (roomId: string) => {
    return bookings?.some(b =>
      b.roomId === roomId &&
      new Date(b.checkIn) <= new Date() &&
      new Date(b.checkOut) >= new Date()
    )
  }

  // Filtered rooms — AVAILABLE FIRST, then booked
  const filteredRooms = useMemo(() => {
    const filtered = displayRooms.filter((r: any) => {
      if (filterType !== "ALL" && r.type !== filterType) return false
      if (filterFloor !== "ALL" && String(r.floor) !== filterFloor) return false
      return true
    })
    
    // Sort: available rooms first
    return filtered.sort((a: any, b: any) => {
      const aBooked = isRoomBooked(a.id) ? 1 : 0
      const bBooked = isRoomBooked(b.id) ? 1 : 0
      return aBooked - bBooked
    })
  }, [displayRooms, filterType, filterFloor, bookings])

  // Rooms available for booking modal selection
  const availableRoomsForBooking = useMemo(() => {
    return displayRooms.filter((r: any) => {
      if (bookingSuiteType && r.type !== bookingSuiteType) return false
      if (bookingFloor && String(r.floor) !== bookingFloor) return false
      return !isRoomBooked(r.id)
    })
  }, [displayRooms, bookingSuiteType, bookingFloor, bookings])

  // Floors available based on selected suite type
  const floorsForSelectedType = useMemo(() => {
    const filtered = bookingSuiteType
      ? displayRooms.filter((r: any) => r.type === bookingSuiteType)
      : displayRooms
    return [...new Set(filtered.map((r: any) => r.floor))].sort()
  }, [displayRooms, bookingSuiteType])

  const openBookingModal = (room?: any) => {
    if (room) {
      setBookingSuiteType(room.type)
      setBookingFloor(String(room.floor))
      setBookingRoomId(room.id)
    } else {
      setBookingSuiteType("")
      setBookingFloor("")
      setBookingRoomId("")
    }
    setShowBookingModal(true)
    setSuccessMsg("")
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingRoomId) return
    setIsSubmitting(true)
    const formData = new FormData(e.target as HTMLFormElement)
    formData.append("roomId", bookingRoomId)
    await requestBooking(formData)
    setIsSubmitting(false)
    setSuccessMsg("Reservation requested! We'll email you the confirmation shortly.")
    setTimeout(() => {
      setShowBookingModal(false)
      setSuccessMsg("")
    }, 3500)
  }

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const w = scrollRef.current.clientWidth * 0.6
      scrollRef.current.scrollBy({ left: dir === "left" ? -w : w, behavior: "smooth" })
    }
  }

  // Split into available and booked
  const availableRooms = filteredRooms.filter((r: any) => !isRoomBooked(r.id))
  const bookedRooms = filteredRooms.filter((r: any) => isRoomBooked(r.id))

  return (
    <section className="py-24 px-8 relative overflow-hidden bg-[var(--background)]">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-8xl font-heading font-black mb-6 tracking-tight"
          >
            Find Your <span className="text-[var(--accent-primary)]">Haven</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto text-lg md:text-xl font-light italic opacity-70"
          >
            Available suites shown first. Scroll to explore.
          </motion.p>
        </div>

        {/* Filters + Book Now */}
        <div className="flex flex-wrap gap-6 items-center justify-between mb-12 backdrop-blur-md bg-white/5 p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="bg-black/5 dark:bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm font-semibold tracking-wide appearance-none cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors pr-12"
              >
                <option value="ALL">All Suite Types</option>
                {suiteTypes.map((t: any) => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
            </div>

            <div className="relative">
              <select
                value={filterFloor}
                onChange={e => setFilterFloor(e.target.value)}
                className="bg-black/5 dark:bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm font-semibold tracking-wide appearance-none cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors pr-12"
              >
                <option value="ALL">All Floors</option>
                {floors.map((f: any) => <option key={f} value={String(f)}>Floor {f}</option>)}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
            </div>
          </div>

          <button onClick={() => openBookingModal()} className="btn-primary">
            Quick Reserve
          </button>
        </div>

        {/* Available Rooms — Horizontal Scroll */}
        {availableRooms.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-heading font-bold">Available <span className="text-emerald-500">Now</span></h3>
                <p className="text-sm opacity-40 font-light italic mt-1">{availableRooms.length} suite{availableRooms.length !== 1 ? 's' : ''} ready for booking</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => scroll("left")} className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => scroll("right")} className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {availableRooms.map((room: any, i: number) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="snap-start flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[38vw] lg:w-[28vw]"
                >
                  <RoomCard
                    room={room}
                    onBook={() => openBookingModal(room)}
                    isBooked={false}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Booked Rooms — Shown After */}
        {bookedRooms.length > 0 && (
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-heading font-bold opacity-40">Currently <span className="text-rose-400">Reserved</span></h3>
              <p className="text-sm opacity-20 font-light italic mt-1">These suites are occupied and will become available soon.</p>
            </div>
            
            <div className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {bookedRooms.map((room: any, i: number) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="snap-start flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[38vw] lg:w-[28vw] opacity-50"
                >
                  <RoomCard
                    room={room}
                    onBook={() => openBookingModal(room)}
                    isBooked={true}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {filteredRooms.length === 0 && (
          <div className="text-center py-20 opacity-40">
            <p className="text-xl italic font-light">No suites match your current filters.</p>
          </div>
        )}

        {/* ========== Booking Modal ========== */}
        <AnimatePresence>
          {showBookingModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="glass-panel relative w-full max-w-lg overflow-hidden border-white/10"
              >
                {/* Header */}
                <div className="p-8 pb-0">
                  <h3 className="text-3xl font-heading font-black tracking-tight mb-1">
                    Reserve <span className="text-[var(--accent-primary)]">Suite</span>
                  </h3>
                  <p className="text-sm opacity-40 font-light">Select preferences and complete your request.</p>
                </div>

                <button
                  onClick={() => setShowBookingModal(false)}
                  className="absolute top-6 right-6 text-white/30 hover:text-white text-xl transition-colors"
                >
                  ✕
                </button>

                <div className="p-8">
                  {successMsg ? (
                    <div className="text-center py-10">
                      <span className="text-5xl block mb-4">✓</span>
                      <p className="text-emerald-500 font-bold text-lg">{successMsg}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="flex flex-col gap-6">
                      {/* Suite Selection */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Suite Type</label>
                          <select
                            className="form-select"
                            value={bookingSuiteType}
                            onChange={e => {
                              setBookingSuiteType(e.target.value)
                              setBookingRoomId("")
                            }}
                          >
                            <option value="">Any Type</option>
                            {suiteTypes.map((t: any) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Floor</label>
                          <select
                            className="form-select"
                            value={bookingFloor}
                            onChange={e => {
                              setBookingFloor(e.target.value)
                              setBookingRoomId("")
                            }}
                          >
                            <option value="">Any Floor</option>
                            {floorsForSelectedType.map((f: any) => (
                              <option key={f} value={String(f)}>Floor {f}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Specific Room */}
                      <div>
                        <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Select Room</label>
                        <select
                          className="form-select"
                          value={bookingRoomId}
                          onChange={e => setBookingRoomId(e.target.value)}
                          required
                        >
                          <option value="">— Choose a room —</option>
                          {availableRoomsForBooking.map((r: any) => (
                            <option key={r.id} value={r.id}>
                              {r.name} — Floor {r.floor} — ₹{r.price}/night
                            </option>
                          ))}
                        </select>
                        {availableRoomsForBooking.length === 0 && (
                          <p className="text-rose-400 text-[10px] mt-2 font-bold uppercase tracking-widest">
                            No rooms available for selected criteria.
                          </p>
                        )}
                      </div>

                      <div className="h-[1px] bg-white/5" />

                      {/* Guest Info */}
                      <div>
                        <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Full Name</label>
                        <input type="text" name="customerName" required className="form-input" placeholder="Your full name" />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Email Address</label>
                        <input type="email" name="customerEmail" required className="form-input" placeholder="your@email.com" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Check In</label>
                          <input type="date" name="checkIn" required className="form-input" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Check Out</label>
                          <input type="date" name="checkOut" required className="form-input" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !bookingRoomId}
                        className="btn-primary !py-4 shadow-none hover:shadow-2xl disabled:opacity-30"
                      >
                        {isSubmitting ? "Processing..." : "Confirm Reservation"}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
