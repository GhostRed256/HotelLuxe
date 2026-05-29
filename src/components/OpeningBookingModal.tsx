"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo, useEffect } from "react"
import { requestBooking } from "@/app/actions"
import { User, Phone, Mail, X, AlertCircle, MessageSquare } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface OpeningBookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory: {
    type: string
    price: number
    image: string
    description: string
  } | null
  rooms: any[]
  bookings: any[]
}

export default function OpeningBookingModal({
  isOpen,
  onClose,
  selectedCategory,
  rooms,
  bookings
}: OpeningBookingModalProps) {
  const { user, userData } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [bookingError, setBookingError] = useState("")
  const [selectedContact, setSelectedContact] = useState("9181042005")
  const contactNumbers = ["9181042005", "8133819414", "7002475079"]

  // Form Field States
  const [bookingFor, setBookingFor] = useState<"myself" | "others">("myself")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [countryCode, setCountryCode] = useState("+91")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")

  // Skeleton loading effect for 600ms
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)

  // Check if room is booked
  const isRoomBooked = (roomId: string) => {
    const isBooked = (id: string) => bookings?.some(b =>
      b.roomId === id &&
      new Date(b.checkIn) <= new Date() &&
      new Date(b.checkOut) >= new Date()
    )

    const IT1_1BHK = 'Ne0oPUF4KDRdp0bG5ogj'
    const IT2_2BHK = 'GJh1ksOcIVhs12SixISd'
    const IT3_3BHK = 'f3fJhWTuCDGwhxlxIQaD'
    const HOUSE_4BHK = '6rluzPaGTH1YT0kYfj0T'

    if (roomId === HOUSE_4BHK) {
      if (isBooked(HOUSE_4BHK) || isBooked(IT1_1BHK) || isBooked(IT2_2BHK) || isBooked(IT3_3BHK)) return true;
    }
    if (roomId === IT3_3BHK) {
      if (isBooked(IT3_3BHK) || isBooked(HOUSE_4BHK) || isBooked(IT2_2BHK)) return true;
    }
    if (roomId === IT2_2BHK) {
      if (isBooked(IT2_2BHK) || isBooked(HOUSE_4BHK) || isBooked(IT3_3BHK)) return true;
    }
    if (roomId === IT1_1BHK) {
      if (isBooked(IT1_1BHK) || isBooked(HOUSE_4BHK)) return true;
    }

    return isBooked(roomId);
  }

  // Filter physical rooms for category
  const availableRoomsForCategory = useMemo(() => {
    if (!selectedCategory) return []
    return rooms.filter((r: any) => {
      if (selectedCategory.type === "2BHK House") {
        return r.type === "2BHK House" && Number(r.price) === Number(selectedCategory.price) && !isRoomBooked(r.id)
      }
      return r.type === selectedCategory.type && !isRoomBooked(r.id)
    })
  }, [selectedCategory, rooms, bookings])

  const [bookingRoomId, setBookingRoomId] = useState("")

  // Pre-select first physical room
  useEffect(() => {
    if (availableRoomsForCategory.length > 0) {
      setBookingRoomId(availableRoomsForCategory[0].id)
    } else {
      setBookingRoomId("")
    }
  }, [availableRoomsForCategory])

  // Trigger skeleton loader on open
  useEffect(() => {
    if (isOpen) {
      setLoadingSkeleton(true)
      const timer = setTimeout(() => {
        setLoadingSkeleton(false)
      }, 550)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Auto-populate user details on mount/open when booking for myself
  useEffect(() => {
    if (isOpen && bookingFor === "myself") {
      setCustomerName(userData?.displayName || "")
      const phoneOnly = userData?.phoneNumber?.replace(/^\+\d+/, "") || ""
      setCustomerPhone(phoneOnly)
      const code = userData?.phoneNumber?.match(/^\+\d+/)?.[0] || "+91"
      setCountryCode(code)
      setCustomerEmail(userData?.email || "")
    }
  }, [isOpen, bookingFor, userData])

  // Compute pricing
  const selectedRoomPrice = useMemo(() => {
    const r = rooms.find((r: any) => r.id === bookingRoomId)
    return r ? (Number(r.price) || 0) : (selectedCategory?.price || 0)
  }, [rooms, bookingRoomId, selectedCategory])

  const computedPrice = useMemo(() => {
    if (!checkIn || !checkOut || !selectedRoomPrice) return 0
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0
    const diffTime = d2.getTime() - d1.getTime()
    if (diffTime <= 0) return 0
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) * selectedRoomPrice
  }, [checkIn, checkOut, selectedRoomPrice])

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingRoomId) {
      setBookingError("Please select a physical suite.")
      return
    }
    setBookingError("")

    if (customerPhone.length !== 10) {
      setBookingError("Please enter a valid 10-digit phone number.")
      return
    }

    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setBookingError("Please enter a valid email address.")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("roomId", bookingRoomId)
    formData.append("customerName", customerName)
    formData.append("customerEmail", customerEmail)
    formData.append("customerPhone", `${countryCode}${customerPhone}`)
    formData.append("checkIn", checkIn)
    formData.append("checkOut", checkOut)

    try {
      const res = await requestBooking(formData)
      if (res && res.error) {
        setBookingError(res.error)
        setIsSubmitting(false)
      } else {
        setIsSubmitting(false)
        setSuccessMsg("Reservation requested! Confirmation email is on its way.")
        // Removed auto-close so the user can interact with contact numbers

      }
    } catch (err) {
      setBookingError("An unexpected error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !selectedCategory) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto scrollbar-hide rounded-[2rem] border border-white/10 bg-[#0A0307] shadow-3xl p-8 md:p-10"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-3xl font-heading font-extrabold tracking-tight text-white leading-tight">
                Reserve <span className="text-[#D14D7E]">Suite</span>
              </h3>
              <p className="text-xs text-white/40 mt-1 font-light">
                Select preferences and complete your request.
              </p>
            </div>
            <button
              onClick={() => {
                onClose()
                if (successMsg) {
                  setSuccessMsg("")
                  setCheckIn("")
                  setCheckOut("")
                }
              }}
              className="p-1 rounded-full text-white/30 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {successMsg ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12 flex flex-col items-center justify-center"
            >
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
                  {contactNumbers.map(num => (
                    <button
                      key={num}
                      onClick={() => setSelectedContact(num)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${
                        selectedContact === num
                          ? "bg-[#D14D7E] text-white shadow-lg shadow-[#D14D7E]/20"
                          : "bg-white/5 text-white/50 hover:bg-white/10"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 justify-center mt-2">
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
            </motion.div>
          ) : loadingSkeleton ? (
            /* pulsing luxury skeleton structure loader matching modal fields exactly */
            <div className="space-y-6 animate-pulse">
              {/* Toggle Skeleton */}
              <div className="grid grid-cols-2 gap-2 h-12 rounded-full bg-white/5 p-1">
                <div className="bg-white/10 rounded-full" />
                <div className="opacity-20 bg-white/5 rounded-full" />
              </div>
              
              {/* Select Suite Skeleton */}
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded w-1/4" />
                <div className="h-14 bg-white/5 rounded-2xl border border-white/5" />
              </div>

              {/* Confirm Name Skeleton */}
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded w-1/3" />
                <div className="h-14 bg-white/5 rounded-2xl border border-white/5" />
              </div>

              {/* Phone/Email Skeleton */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded w-1/3" />
                  <div className="h-14 bg-white/5 rounded-2xl border border-white/5" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded w-1/3" />
                  <div className="h-14 bg-white/5 rounded-2xl border border-white/5" />
                </div>
              </div>

              {/* Dates Skeleton */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded w-1/3" />
                  <div className="h-14 bg-white/5 rounded-2xl border border-white/5" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded w-1/3" />
                  <div className="h-14 bg-white/5 rounded-2xl border border-white/5" />
                </div>
              </div>

              <div className="h-14 bg-white/10 rounded-full mt-4" />
            </div>
          ) : (
            /* Form matching screenshot visually */
            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
              {bookingError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-xs font-bold"
                >
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>{bookingError}</span>
                </motion.div>
              )}

              {/* BOOKING FOR Toggle */}
              <div className="flex p-1 bg-black/60 rounded-full border border-white/10 w-full">
                <button
                  type="button"
                  onClick={() => setBookingFor("myself")}
                  className={`flex-1 py-3 text-[10px] font-bold tracking-[0.15em] uppercase rounded-full transition-all duration-300 ${
                    bookingFor === "myself" 
                      ? "bg-[#D14D7E] text-white shadow-lg shadow-[#D14D7E]/20" 
                      : "text-white/40 hover:text-white bg-transparent"
                  }`}
                >
                  Booking For Myself
                </button>
                <button
                  type="button"
                  onClick={() => setBookingFor("others")}
                  className={`flex-1 py-3 text-[10px] font-bold tracking-[0.15em] uppercase rounded-full transition-all duration-300 ${
                    bookingFor === "others" 
                      ? "bg-[#D14D7E] text-white shadow-lg shadow-[#D14D7E]/20" 
                      : "text-white/40 hover:text-white bg-transparent"
                  }`}
                >
                  For Someone Else
                </button>
              </div>

              {/* SELECT SUITE Dropdown */}
              <div>
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2 block">
                  Select Suite
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#D14D7E]/50 focus:ring-1 focus:ring-[#D14D7E]/50"
                    value={bookingRoomId}
                    onChange={e => setBookingRoomId(e.target.value)}
                    required
                  >
                    <option value="" className="bg-[#0A0307]">— Choose an available suite —</option>
                    {Object.entries(
                      rooms.filter((r: any) => !isRoomBooked(r.id)).reduce((acc: any, r: any) => {
                        if (!acc[r.type]) acc[r.type] = []
                        acc[r.type].push(r)
                        return acc
                      }, {})
                    ).map(([type, groupRooms]: any) => (
                      <optgroup key={type} label={type} className="bg-[#0A0307] text-white font-bold">
                        {groupRooms.map((r: any) => (
                          <option key={r.id} value={r.id} className="bg-[#0A0307] text-white font-normal">
                            {r.name} ₹{r.price}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#D14D7E] text-xs">
                    ▼
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-white/5 my-1" />

              {/* CONFIRM NAME */}
              <div>
                <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2 block">
                  {bookingFor === "myself" ? "Confirm Name" : "Guest Full Name"}
                </label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white text-sm focus:outline-none focus:border-[#D14D7E]/50 focus:ring-1 focus:ring-[#D14D7E]/50 placeholder-[#D14D7E]/30" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Full name" 
                  />
                </div>
              </div>

              {/* CONFIRM PHONE & EMAIL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2 block">
                    {bookingFor === "myself" ? "Confirm Phone" : "Guest Phone"}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative w-20 flex-shrink-0">
                      <select 
                        value={countryCode}
                        onChange={e => setCountryCode(e.target.value)}
                        className="w-full h-full bg-black/60 border border-white/10 rounded-2xl px-4 text-white text-xs appearance-none cursor-pointer focus:outline-none focus:border-[#D14D7E]/50"
                      >
                        <option value="+91" className="bg-[#0A0307]">+91</option>
                        <option value="+1" className="bg-[#0A0307]">+1</option>
                        <option value="+44" className="bg-[#0A0307]">+44</option>
                        <option value="+971" className="bg-[#0A0307]">+971</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 text-[8px]">▼</div>
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                      <input 
                        type="tel" 
                        required 
                        className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white text-sm focus:outline-none focus:border-[#D14D7E]/50 focus:ring-1 focus:ring-[#D14D7E]/50 placeholder-[#D14D7E]/30" 
                        value={customerPhone} 
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10)
                          setCustomerPhone(val)
                        }}
                        placeholder="10-dig" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2 block">
                    Email <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    <input 
                      type="email" 
                      required
                      className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white text-sm focus:outline-none focus:border-[#D14D7E]/50 focus:ring-1 focus:ring-[#D14D7E]/50 placeholder-[#D14D7E]/30" 
                      value={customerEmail} 
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="your@email.com" 
                    />
                  </div>
                </div>
              </div>

              {/* CHECK IN & CHECK OUT */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2 block">
                    Check In
                  </label>
                  <input 
                    type="date" 
                    required 
                    className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#D14D7E]/50 focus:ring-1 focus:ring-[#D14D7E]/50 [color-scheme:dark]" 
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e => setCheckIn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2 block">
                    Check Out
                  </label>
                  <input 
                    type="date" 
                    required 
                    className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#D14D7E]/50 focus:ring-1 focus:ring-[#D14D7E]/50 [color-scheme:dark]" 
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={e => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              {/* Pricing Estimation banner */}
              {computedPrice > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 bg-[#D14D7E]/10 border border-[#D14D7E]/20 rounded-2xl text-center shadow-inner"
                >
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-55 block mb-1 text-white">Estimated Total Stay Price</span>
                  <span className="text-2xl font-heading font-black text-[#D14D7E]">
                    ₹{computedPrice.toLocaleString('en-IN')}
                  </span>
                </motion.div>
              )}

              {/* Submit Reservation Action */}
              <button
                type="submit"
                disabled={isSubmitting || !bookingRoomId || !checkIn || !checkOut}
                className="w-full py-4 rounded-full bg-[#451624] text-white/80 hover:bg-[#D14D7E] hover:text-white font-bold transition-all duration-300 disabled:opacity-30 border border-[#D14D7E]/20 mt-2 text-xs uppercase tracking-wider cursor-pointer active:scale-98"
              >
                {isSubmitting ? "Confirming..." : "Confirm Reservation"}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
