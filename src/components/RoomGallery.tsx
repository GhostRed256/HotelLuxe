"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo } from "react"
import { requestBooking } from "@/app/actions"
import RoomCard from "./RoomCard"

export default function RoomGallery({ rooms = [], bookings = [] }: { rooms?: any[], bookings?: any[] }) {
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

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

  // Filtered rooms for display
  const filteredRooms = useMemo(() => {
    return displayRooms.filter((r: any) => {
      if (filterType !== "ALL" && r.type !== filterType) return false
      if (filterFloor !== "ALL" && String(r.floor) !== filterFloor) return false
      return true
    })
  }, [displayRooms, filterType, filterFloor])

  // Rooms available for booking modal selection
  const availableRoomsForBooking = useMemo(() => {
    return displayRooms.filter((r: any) => {
      if (bookingSuiteType && r.type !== bookingSuiteType) return false
      if (bookingFloor && String(r.floor) !== bookingFloor) return false
      // Check if currently booked
      const isBooked = bookings?.some(b =>
        b.roomId === r.id &&
        new Date(b.checkIn) <= new Date() &&
        new Date(b.checkOut) >= new Date()
      )
      return !isBooked
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
    setSuccessMsg("Reservation requested successfully! We will email you the confirmation shortly.")
    setTimeout(() => {
      setShowBookingModal(false)
      setSuccessMsg("")
    }, 3500)
  }

  return (
    <section id="gallery" className="py-24 px-8 palace-bg min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--accent-primary)]/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--accent-primary)]/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-40"
          />
          <h2 className="text-5xl md:text-7xl font-cinzel font-bold mb-6 gold-gradient-text drop-shadow-lg inline-block bg-[var(--background)] px-8 relative z-10">
            Our Suites
          </h2>
          <p className="max-w-3xl mx-auto text-lg md:text-xl italic" style={{ color: 'var(--foreground-secondary)' }}>
            Experience comfort and joy. Each suite is designed for your perfect stay.
          </p>
        </div>

        {/* Filters + Book Now */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-12">
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '180px' }}
            >
              <option value="ALL">All Suite Types</option>
              {suiteTypes.map((t: any) => <option key={t} value={t}>{t}</option>)}
            </select>

            <select
              value={filterFloor}
              onChange={e => setFilterFloor(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '140px' }}
            >
              <option value="ALL">All Floors</option>
              {floors.map((f: any) => <option key={f} value={String(f)}>Floor {f}</option>)}
            </select>
          </div>

          <button onClick={() => openBookingModal()} className="btn-primary">
            Reserve a Suite
          </button>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredRooms.map((room: any) => {
            const isCurrentlyBooked = bookings?.some(b =>
              b.roomId === room.id &&
              new Date(b.checkIn) <= new Date() &&
              new Date(b.checkOut) >= new Date()
            );

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className="transform transition-all duration-400 hover:-translate-y-3 z-10 hover:z-20"
              >
                <RoomCard
                  room={room}
                  onBook={() => openBookingModal(room)}
                  isBooked={isCurrentlyBooked}
                />
              </motion.div>
            )
          })}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-20" style={{ color: 'var(--foreground-secondary)' }}>
            <p className="text-xl italic">No suites match your current filters.</p>
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="glass-panel relative w-full max-w-lg overflow-hidden"
                style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border-color)' }}
              >
                {/* Header bar */}
                <div style={{
                  background: 'linear-gradient(135deg, #A83860, #D14D7E)',
                  padding: '1.5rem 2rem',
                }}>
                  <h3 className="text-2xl font-cinzel font-bold text-white tracking-wide">
                    Reserve Your Suite
                  </h3>
                  <p className="text-white/70 text-sm mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                    Select your preferences and complete the reservation
                  </p>
                </div>

                <button
                  onClick={() => setShowBookingModal(false)}
                  className="absolute top-4 right-5 text-white/60 hover:text-white text-xl transition-colors"
                  style={{ lineHeight: 1 }}
                >
                  ✕
                </button>

                <div style={{ padding: '1.75rem 2rem 2rem' }}>
                  {successMsg ? (
                    <div style={{
                      background: 'rgba(34, 139, 34, 0.1)',
                      border: '1px solid rgba(34, 139, 34, 0.3)',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      textAlign: 'center',
                    }}>
                      <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>✓</span>
                      <p style={{ color: '#1a6b1a', fontWeight: 600 }}>{successMsg}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
                      {/* Suite Selection */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">Suite Type</label>
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
                          <label className="form-label">Floor</label>
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
                        <label className="form-label">Select Room</label>
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
                          <p style={{ color: '#a05050', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                            No rooms available for the selected criteria.
                          </p>
                        )}
                      </div>

                      <div className="ornate-divider" style={{ margin: '0.5rem 0' }}>
                        <span style={{ fontSize: '0.8rem' }}>✦</span>
                      </div>

                      {/* Guest Info */}
                      <div>
                        <label className="form-label">Full Name</label>
                        <input type="text" name="customerName" required className="form-input" placeholder="Your full name" />
                      </div>

                      <div>
                        <label className="form-label">Email Address</label>
                        <input type="email" name="customerEmail" required className="form-input" placeholder="your@email.com" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">Check In</label>
                          <input type="date" name="checkIn" required className="form-input" />
                        </div>
                        <div>
                          <label className="form-label">Check Out</label>
                          <input type="date" name="checkOut" required className="form-input" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !bookingRoomId}
                        className="btn-primary mt-2"
                        style={{
                          padding: '1rem 2rem',
                          fontSize: '0.9rem',
                          opacity: (!bookingRoomId || isSubmitting) ? 0.5 : 1,
                          cursor: (!bookingRoomId || isSubmitting) ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {isSubmitting ? "Securing Reservation..." : "Confirm Reservation"}
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
