"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { requestBooking, updateBookingPayment } from "@/app/actions"
import RoomCard from "./RoomCard"
import { ChevronLeft, ChevronRight, User, Phone, Mail, Upload, ArrowLeft, IndianRupee, ShieldCheck, Copy, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function RoomGallery({ rooms = [], bookings = [] }: { rooms?: any[], bookings?: any[] }) {
  const { userData } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [selectedContact, setSelectedContact] = useState("9181042005")
  const contactNumbersList = ["9181042005", "8133819414", "7002475079"]
  const scrollRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  // 1. Primitive States
  const [filterType, setFilterType] = useState("ALL")
  const [bookingRoomId, setBookingRoomId] = useState("")
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [bookingFor, setBookingFor] = useState<"myself" | "others">("myself")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [countryCode, setCountryCode] = useState("+91")
  const [bookingStep, setBookingStep] = useState<1 | 2>(1)
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null)
  const [upiTxnId, setUpiTxnId] = useState("")
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null)
  const [paymentFileName, setPaymentFileName] = useState("")
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [bookingError, setBookingError] = useState("")

  const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "staynjoy@okaxis"
  const DEPOSIT_AMOUNT = 300

  // 2. Constants & Pure Functions
  const displayRooms = useMemo(() =>
    (rooms.length > 0 ? rooms : []), [rooms])

  const isRoomBooked = useCallback((roomId: string) => {
    const isBooked = (id: string) => bookings?.some(b =>
      b.roomId === id &&
      new Date(b.checkIn) <= new Date() &&
      new Date(b.checkOut) >= new Date()
    )

    const IT1_1BHK = 'Ne0oPUF4KDRdp0bG5ogj'
    const IT2_2BHK = 'GJh1ksOcIVhs12SixISd'
    const IT3_3BHK = 'f3fJhWTuCDGwhxlxIQaD'
    const HOUSE_4BHK = '6rluzPaGTH1YT0kYfj0T'

    // 4BHK House = 2BHK (Top Floor) + 3BHK (Top Floor) only.
    // Booking 4BHK blocks 2BHK and 3BHK, but NOT 1BHK Down floor.
    if (roomId === HOUSE_4BHK) {
      if (isBooked(HOUSE_4BHK) || isBooked(IT2_2BHK) || isBooked(IT3_3BHK)) return true;
    }
    if (roomId === IT3_3BHK) {
      if (isBooked(IT3_3BHK) || isBooked(HOUSE_4BHK)) return true;
    }
    if (roomId === IT2_2BHK) {
      if (isBooked(IT2_2BHK) || isBooked(HOUSE_4BHK)) return true;
    }
    if (roomId === IT1_1BHK) {
      // 1BHK Down floor is independent — only blocked by its own booking
      if (isBooked(IT1_1BHK)) return true;
    }

    return isBooked(roomId);
  }, [bookings])

  // 3. Memos depending on states/funcs
  const suiteTypes = useMemo(() => [...new Set(displayRooms.map((r: any) => r.type))].sort(), [displayRooms])

  const filteredRooms = useMemo(() => {
    const filtered = displayRooms.filter((r: any) => {
      if (filterType === "ALL") return true
      if (filterType === "Cozy Pink Room") return r.type === "Cozy Pink Room"
      if (filterType === "Deluxe Room") return r.type === "Deluxe Room"
      if (filterType === "Premium Suite") return r.type === "Premium Suite"
      return r.type === filterType
    })

    return filtered.sort((a: any, b: any) => {
      const aBooked = isRoomBooked(a.id) ? 1 : 0
      const bBooked = isRoomBooked(b.id) ? 1 : 0
      return aBooked - bBooked
    })
  }, [displayRooms, filterType, isRoomBooked])

  const availableRoomsForBooking = useMemo(() => {
    return displayRooms.filter((r: any) => !isRoomBooked(r.id))
  }, [displayRooms, isRoomBooked])

  const selectedRoomPrice = useMemo(() => {
    const r = availableRoomsForBooking.find((r: any) => r.id === bookingRoomId)
    return r ? (Number(r.price) || 0) : 0
  }, [availableRoomsForBooking, bookingRoomId])

  const computedPrice = useMemo(() => {
    if (!checkIn || !checkOut || !selectedRoomPrice) return 0
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0
    const diffTime = d2.getTime() - d1.getTime()
    if (diffTime <= 0) return 0
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays * (Number(selectedRoomPrice) || 0)
  }, [checkIn, checkOut, selectedRoomPrice])

  // 4. Modal Logic
  const openBookingModal = useCallback((room?: any) => {
    if (room) {
      setBookingRoomId(room.id)
    } else {
      setBookingRoomId("")
    }
    setCheckIn("")
    setCheckOut("")

    setBookingFor("myself")
    setCustomerName(userData?.displayName || "")
    const phoneOnly = userData?.phoneNumber?.replace(/^\+\d+/, "") || ""
    setCustomerPhone(phoneOnly)
    const code = userData?.phoneNumber?.match(/^\+\d+/)?.[0] || "+91"
    setCountryCode(code)
    setCustomerEmail(userData?.email || "")

    setBookingStep(1)
    setUpiTxnId("")
    setPaymentScreenshot(null)
    setPaymentFileName("")
    setCopiedUpi(false)
    setBookingError("")
    setShowBookingModal(true)
    setSuccessMsg("")
  }, [userData])

  // 5. Effects
  useEffect(() => {
    const suiteParam = searchParams.get("suite")
    if (suiteParam && displayRooms.length > 0) {
      const matchingRoom = displayRooms.find((r: any) => {
        return r.type === suiteParam && !isRoomBooked(r.id);
      })
      if (matchingRoom) {
        const timer = setTimeout(() => openBookingModal(matchingRoom), 500)
        return () => clearTimeout(timer)
      }
    }
  }, [searchParams, displayRooms, isRoomBooked, openBookingModal])

  // 6. Handlers
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setBookingError("Screenshot must be under 5MB.")
      return
    }
    setPaymentFileName(file.name)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPaymentScreenshot(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID)
      setCopiedUpi(true)
      setTimeout(() => setCopiedUpi(false), 2000)
    } catch { /* fallback */ }
  }

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=StayNJoy&am=${DEPOSIT_AMOUNT}&cu=INR&tn=BookingDeposit`
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiDeepLink)}`

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingRoomId) return
    setBookingError("")
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("roomId", bookingRoomId)
    formData.append("customerName", customerName)
    formData.append("customerEmail", customerEmail)
    formData.append("customerPhone", `${countryCode}${customerPhone}`)
    formData.append("checkIn", checkIn)
    formData.append("checkOut", checkOut)
    formData.append("paymentStatus", "PENDING")

    try {
      const res = await requestBooking(formData)
      if (res && res.error) {
        setBookingError(res.error)
        setIsSubmitting(false)
      } else if (res && res.bookingId) {
        setCurrentBookingId(res.bookingId)
        setIsSubmitting(false)
        setBookingStep(2)
      }
    } catch {
      setBookingError("Connection failed.")
      setIsSubmitting(false)
    }
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBookingId) return
    setIsSubmitting(true)
    try {
      const res = await updateBookingPayment(currentBookingId, upiTxnId, paymentScreenshot || "")
      if (res.error) {
        setBookingError(res.error)
        setIsSubmitting(false)
      } else {
        setIsSubmitting(false)
        setSuccessMsg("Payment proof submitted! Our team is verifying your booking.")
      }
    } catch {
      setBookingError("Update failed. Contact support.")
      setIsSubmitting(false)
    }
  }

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingRoomId) return
    if (customerPhone.length !== 10) {
      setBookingError("Please enter a valid 10-digit phone number.")
      return
    }
    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setBookingError("Please enter a valid email address.")
      return
    }
    await handleBookingSubmit(e)
  }

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const w = scrollRef.current.clientWidth * 0.6
      scrollRef.current.scrollBy({ left: dir === "left" ? -w : w, behavior: "smooth" })
    }
  }

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
            className="text-5xl md:text-8xl font-heading font-black mb-6 tracking-tight text-black dark:text-white"
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
                <option value="Cozy Pink Room">Pink Cozy Room {"\u20B9"}1399</option>
                <option value="Deluxe Room">Deluxe Room {"\u20B9"}1799</option>
                <option value="Premium Suite">Premium Suite</option>
                <option value="4BHK House">4BHK House (Entire Floor)</option>
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
                className="glass-panel relative w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide border-white/10"
              >
                {/* Header */}
                <div className="p-8 pb-0">
                  <h3 className="text-3xl font-heading font-black tracking-tight mb-1">
                    Reserve <span className="text-[var(--accent-primary)]">Suite</span>
                  </h3>
                  <p className="text-sm opacity-40 font-light">Select preferences and complete your request.</p>
                </div>

                <button
                  onClick={() => {
                    setShowBookingModal(false)
                    if (successMsg) {
                      setSuccessMsg("")
                    }
                  }}
                  className="absolute top-6 right-6 text-white/30 hover:text-white text-xl transition-colors"
                >
                  ✕
                </button>

                <div className="p-8">
                  {successMsg ? (
                    <div className="text-center py-8 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <span className="text-3xl text-emerald-500 font-bold">✓</span>
                      </div>
                      <h4 className="text-xl font-heading font-bold text-emerald-500 mb-2">Request Successful!</h4>
                      <p className="text-white/60 text-sm max-w-sm mx-auto leading-relaxed mb-6">
                        {successMsg} Our team will notify you within minutes. Or reach out to us directly:
                      </p>

                      {/* Contact Selection */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-sm mx-auto flex flex-col gap-4">
                        <div className="flex gap-2 justify-center flex-wrap">
                          {contactNumbersList.map(num => (
                            <button
                              key={num}
                              onClick={() => setSelectedContact(num)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${selectedContact === num
                                ? "bg-[#D14D7E] text-white shadow-lg shadow-[#D14D7E]/20"
                                : "bg-white/5 text-white/50 hover:bg-white/10"
                                }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-3 justify-center mt-2 w-full">
                          <a
                            href={`https://wa.me/91${selectedContact}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 py-3 rounded-xl transition-colors text-sm font-bold"
                          >
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            WhatsApp
                          </a>
                          <a
                            href={`tel:+91${selectedContact}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 py-3 rounded-xl transition-colors text-sm font-bold"
                          >
                            <Phone size={18} />
                            Call
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {bookingError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-4 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center"
                        >
                          {bookingError}
                        </motion.div>
                      )}

                      {/* Step Indicator - Hidden while payment is dormant */}
                      {false && (
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`flex items-center gap-2 text-[9px] font-bold tracking-[0.15em] uppercase ${bookingStep === 1 ? 'text-[var(--accent-primary)]' : 'opacity-40'
                            }`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${bookingStep === 1 ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]' : 'border-white/20 bg-white/5'
                              }`}>1</div>
                            Details
                          </div>
                          <div className="flex-1 h-[1px] bg-white/10" />
                          <div className={`flex items-center gap-2 text-[9px] font-bold tracking-[0.15em] uppercase ${bookingStep === 2 ? 'text-[var(--accent-primary)]' : 'opacity-40'
                            }`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${bookingStep === 2 ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]' : 'border-white/20 bg-white/5'
                              }`}>2</div>
                            Payment
                          </div>
                        </div>
                      )}

                      {/* === STEP 1: Guest Details === */}
                      {bookingStep === 1 && (
                        <form onSubmit={handleStep1Submit} className="flex flex-col gap-6">
                          {/* Booking For Toggle */}
                          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                            <button
                              type="button"
                              onClick={() => {
                                setBookingFor("myself")
                                setCustomerName(userData?.displayName || "")
                                const phoneOnly = userData?.phoneNumber?.replace(/^\+\d+/, "") || ""
                                setCustomerPhone(phoneOnly)
                                const code = userData?.phoneNumber?.match(/^\+\d+/)?.[0] || "+91"
                                setCountryCode(code)
                              }}
                              className={`flex-1 py-2 text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all ${bookingFor === "myself" ? "bg-[var(--accent-primary)] text-white shadow-lg" : "opacity-40 hover:opacity-100"
                                }`}
                            >
                              Booking for Myself
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setBookingFor("others")
                                setCustomerName("")
                                setCustomerPhone("")
                              }}
                              className={`flex-1 py-2 text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all ${bookingFor === "others" ? "bg-[var(--accent-primary)] text-white shadow-lg" : "opacity-40 hover:opacity-100"
                                }`}
                            >
                              For Someone Else
                            </button>
                          </div>

                          {/* Suite Selection */}
                          <div>
                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Select Suite</label>
                            <select
                              className="form-select"
                              value={bookingRoomId}
                              onChange={e => setBookingRoomId(e.target.value)}
                              required
                            >
                              <option value="">— Choose an available suite —</option>
                              {suiteTypes.map((type: any) => {
                                const roomsOfType = availableRoomsForBooking.filter((r: any) => r.type === type);
                                if (roomsOfType.length === 0) return null;
                                return (
                                  <optgroup key={type} label={type}>
                                    {roomsOfType.map((r: any) => (
                                      <option key={r.id} value={r.id}>
                                        {r.name} {"\u20B9"}{r.price}
                                      </option>
                                    ))}
                                  </optgroup>
                                );
                              })}
                            </select>
                            {availableRoomsForBooking.length === 0 && (
                              <p className="text-rose-400 text-[10px] mt-2 font-bold uppercase tracking-widest">
                                No suites currently available.
                              </p>
                            )}
                          </div>

                          <div className="h-[1px] bg-white/5" />

                          {/* Guest Info */}
                          <div>
                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">
                              {bookingFor === "myself" ? "Confirm Name" : "Guest Full Name"}
                            </label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                              <input
                                type="text" required className="form-input !pl-12"
                                value={customerName} onChange={e => setCustomerName(e.target.value)}
                                placeholder="Full name"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">
                                {bookingFor === "myself" ? "Confirm Phone" : "Guest Phone"}
                              </label>
                              <div className="flex gap-2">
                                <div className="relative w-24">
                                  <select
                                    value={countryCode}
                                    onChange={e => setCountryCode(e.target.value)}
                                    className="form-input !pr-8 appearance-none cursor-pointer text-xs"
                                  >
                                    <option value="+91">+91</option>
                                    <option value="+1">+1</option>
                                    <option value="+44">+44</option>
                                    <option value="+971">+971</option>
                                    <option value="+61">+61</option>
                                  </select>
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-[8px]">▼</div>
                                </div>
                                <div className="relative flex-1">
                                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                  <input
                                    type="tel" required className="form-input !pl-12"
                                    value={customerPhone}
                                    onChange={e => {
                                      const val = e.target.value.replace(/\D/g, "").slice(0, 10)
                                      setCustomerPhone(val)
                                    }}
                                    placeholder="10-digit number"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Email <span className="text-rose-400">*</span></label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                <input
                                  type="email" required className="form-input !pl-12"
                                  value={customerEmail} onChange={e => setCustomerEmail(e.target.value)}
                                  placeholder="your@email.com"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Check In</label>
                              <input
                                type="date"
                                required
                                className="form-input"
                                value={checkIn}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={e => setCheckIn(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Check Out</label>
                              <input
                                type="date"
                                required
                                className="form-input"
                                value={checkOut}
                                min={checkIn || new Date().toISOString().split("T")[0]}
                                onChange={e => setCheckOut(e.target.value)}
                              />
                            </div>
                          </div>

                          {computedPrice > 0 && (
                            <div className="p-4 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-xl text-center animate-in fade-in zoom-in duration-300">
                              <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 block mb-1">Estimated Total</span>
                              <span className="text-2xl font-black text-[var(--accent-primary)]">₹{computedPrice.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={isSubmitting || !bookingRoomId || !checkIn || !checkOut}
                            className="btn-primary w-full !py-4 shadow-none hover:shadow-2xl disabled:opacity-30 mt-2 text-[8px] sm:text-[10px]"
                          >
                            {isSubmitting ? "Processing..." : "Confirm Reservation"}
                          </button>
                        </form>
                      )}

                      {/* === STEP 2: UPI Payment === */}
                      {bookingStep === 2 && (
                        <>
                          {/* Support Contacts in Step 2 */}
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-2">
                            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-3 text-center">Need instant approval? Contact owner</p>
                            <div className="flex gap-2 justify-center flex-wrap mb-4">
                              {contactNumbersList.map(num => (
                                <button key={num} type="button" onClick={() => setSelectedContact(num)} className={`px-2 py-1 text-[10px] rounded-full border ${selectedContact === num ? "bg-[#D14D7E] border-[#D14D7E] text-white shadow-lg" : "bg-white/5 border-white/10 text-white/50"}`}>{num}</button>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <a href={`https://wa.me/91${selectedContact}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366]/10 text-[#25D366] text-center py-2.5 rounded-xl text-[10px] font-bold border border-[#25D366]/20 uppercase tracking-widest">WhatsApp</a>
                              <a href={`tel:+91${selectedContact}`} className="flex-1 bg-blue-500/10 text-blue-400 text-center py-2.5 rounded-xl text-[10px] font-bold border border-blue-500/20 uppercase tracking-widest">Call Agent</a>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 mt-4">
                            <div className="flex gap-3">
                              <button type="button" onClick={() => { setBookingStep(1); setBookingError(""); }} className="flex-1 py-4 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">Back</button>
                              <button
                                type="submit"
                                onClick={(e) => handleFinalSubmit(e)}
                                disabled={isSubmitting || (!upiTxnId && !paymentScreenshot)}
                                className="flex-[2] py-4 rounded-full bg-[#D14D7E] text-white font-bold text-[10px] uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-[#D14D7E]/20"
                              >
                                {isSubmitting ? "Updating..." : "Submit Proof"}
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSuccessMsg("Reservation requested! Our team will verify your details manually.")
                                setBookingStep(1)
                              }}
                              className="w-full py-4 rounded-full border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--accent-primary)]/10 transition-all"
                            >
                              Can&apos;t Pay Online? Submit for Manual Review
                            </button>
                          </div>
                        </>
                      )}
                    </>
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
