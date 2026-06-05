"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo, useEffect } from "react"
import { requestBooking, updateBookingPayment } from "@/app/actions"
import { User, X, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Room {
  id: string
  name: string
  type: string
  price: number
}

interface Booking {
  roomId: string
  checkIn: string
  checkOut: string
}

interface OpeningBookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory: {
    type: string
    price: number
    image: string
    description: string
  } | null
  rooms: Room[]
  bookings: Booking[]
}

export default function OpeningBookingModal({
  isOpen,
  onClose,
  selectedCategory,
  rooms,
  bookings
}: OpeningBookingModalProps) {
  const { userData } = useAuth()
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

  // Payment States
  const [step, setStep] = useState(1)
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null)
  const [upiTxnId, setUpiTxnId] = useState("")
  const [paymentImage, setPaymentImage] = useState<File | null>(null)
  const [paymentPreview, setPaymentPreview] = useState<string>("")

  // Skeleton loading effect for 600ms
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)

  // Check if room is booked
  const isRoomBooked = useMemo(() => {
    const isBooked = (id: string) => bookings?.some(b =>
      b.roomId === id &&
      new Date(b.checkIn) <= new Date() &&
      new Date(b.checkOut) >= new Date()
    )

    const IT1_1BHK = 'Ne0oPUF4KDRdp0bG5ogj'
    const IT2_2BHK = 'GJh1ksOcIVhs12SixISd'
    const IT3_3BHK = 'f3fJhWTuCDGwhxlxIQaD'
    const HOUSE_4BHK = '6rluzPaGTH1YT0kYfj0T'

    // 4BHK House covers 2BHK and 3BHK Top Floor units only.
    // Booking 4BHK does NOT block the 1BHK Down floor.
    return (roomId: string): boolean => {
      if (roomId === HOUSE_4BHK) {
        if (isBooked(HOUSE_4BHK) || isBooked(IT2_2BHK) || isBooked(IT3_3BHK)) return true
      }
      if (roomId === IT3_3BHK) {
        if (isBooked(IT3_3BHK) || isBooked(HOUSE_4BHK)) return true
      }
      if (roomId === IT2_2BHK) {
        if (isBooked(IT2_2BHK) || isBooked(HOUSE_4BHK)) return true
      }
      if (roomId === IT1_1BHK) {
        // 1BHK Down floor is independent of the 4BHK House
        if (isBooked(IT1_1BHK)) return true
      }
      return !!isBooked(roomId)
    }
  }, [bookings])

  // Filter physical rooms for category
  const availableRoomsForCategory = useMemo(() => {
    if (!selectedCategory) return []
    return rooms.filter((r: Room) => {
      if (selectedCategory.type === "2BHK House") {
        return r.type === "2BHK House" && Number(r.price) === Number(selectedCategory.price) && !isRoomBooked(r.id)
      }
      return r.type === selectedCategory.type && !isRoomBooked(r.id)
    })
  }, [selectedCategory, rooms, isRoomBooked])

  const [bookingRoomId, setBookingRoomId] = useState("")

  // Pre-select first physical room
  useEffect(() => {
    const firstId = availableRoomsForCategory[0]?.id ?? ""
    setBookingRoomId(firstId)
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
    const r = rooms.find((r: Room) => r.id === bookingRoomId)
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

  // SUBMIT STEP 1: Create initial booking
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingRoomId) {
      setBookingError("Please select a physical suite.")
      return
    }
    if (customerPhone.length !== 10) {
      setBookingError("Please enter a valid 10-digit phone number.")
      return
    }
    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setBookingError("Please enter a valid email address.")
      return
    }

    setIsSubmitting(true)
    setBookingError("")

    const formData = new FormData()
    formData.append("roomId", bookingRoomId)
    formData.append("customerName", customerName)
    formData.append("customerEmail", customerEmail)
    formData.append("customerPhone", `${countryCode}${customerPhone}`)
    formData.append("checkIn", checkIn)
    formData.append("checkOut", checkOut)
    formData.append("paymentStatus", "PENDING") // Initial save

    try {
      const res = await requestBooking(formData)
      if (res && res.error) {
        setBookingError(res.error)
        setIsSubmitting(false)
      } else if (res && res.bookingId) {
        setCurrentBookingId(res.bookingId)
        setIsSubmitting(false)
        setStep(2)
      }
    } catch {
      setBookingError("Connection error. Please try again.")
      setIsSubmitting(false)
    }
  }

  // SUBMIT STEP 2: Update with payment info
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBookingId) return

    setIsSubmitting(true)
    try {
      const res = await updateBookingPayment(currentBookingId, upiTxnId, paymentPreview || "")
      if (res.error) {
        setBookingError(res.error)
        setIsSubmitting(false)
      } else {
        setIsSubmitting(false)
        setSuccessMsg("Payment proof submitted! We are verifying it now.")
      }
    } catch {
      setBookingError("Failed to upload proof. Please contact support.")
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
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto scrollbar-hide rounded-[2rem] border border-black/10 dark:border-white/10 bg-[var(--background)] shadow-3xl p-8 md:p-10"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-3xl font-heading font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
                Reserve <span className="text-[#D14D7E]">Suite</span>
              </h3>
              <p className="text-xs text-[var(--foreground)] opacity-60 mt-1 font-light">
                {step === 1 ? "Confirm your preferred dates and details." : "Verify payment to secure your booking."}
              </p>
            </div>
            <button
              onClick={() => {
                onClose()
                if (successMsg) {
                  setSuccessMsg("")
                  setCheckIn("")
                  setCheckOut("")
                  setStep(1)
                  setCurrentBookingId(null)
                }
              }}
              className="p-1 rounded-full text-[var(--foreground)] opacity-50 hover:opacity-100 transition-colors"
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
              <h4 className="text-xl font-heading font-bold text-emerald-500 mb-2">Request Persistent!</h4>
              <p className="text-white/60 text-sm max-w-sm mx-auto leading-relaxed mb-6">
                {successMsg} Our team has received your request and will contact you shortly.
              </p>

              {/* Contact Help */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full max-w-sm mx-auto flex flex-col gap-4 text-center">
                <p className="text-[10px] uppercase tracking-widest opacity-40">Contact for Instant Approval</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {contactNumbers.map(num => (
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

                <div className="flex gap-3 justify-center mt-2">
                  <a
                    href={`https://wa.me/91${selectedContact}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 py-3 rounded-xl transition-colors text-xs font-bold"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:+91${selectedContact}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 py-3 rounded-xl transition-colors text-xs font-bold"
                  >
                    Call
                  </a>
                </div>
              </div>
            </motion.div>
          ) : loadingSkeleton ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-12 rounded-full bg-white/5" />
              <div className="h-14 bg-white/5 rounded-2xl" />
              <div className="h-14 bg-white/5 rounded-2xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-14 bg-white/5 rounded-2xl" />
                <div className="h-14 bg-white/5 rounded-2xl" />
              </div>
              <div className="h-14 bg-white/10 rounded-full mt-4" />
            </div>
          ) : (
            <form onSubmit={step === 1 ? handleStep1Submit : handleStep2Submit} className="flex flex-col gap-5">
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

              {step === 1 ? (
                <>
                  {/* Step 1: Guest Details */}
                  <div className="flex p-1 bg-black/5 dark:bg-black/60 rounded-full border border-black/10 dark:border-white/10 w-full">
                    <button
                      type="button"
                      onClick={() => setBookingFor("myself")}
                      className={`flex-1 py-3 text-[10px] font-bold tracking-[0.15em] uppercase rounded-full transition-all duration-300 ${bookingFor === "myself"
                        ? "bg-[#D14D7E] text-white shadow-lg shadow-[#D14D7E]/20"
                        : "text-[var(--foreground)] opacity-60 hover:opacity-100 bg-transparent"
                        }`}
                    >
                      Booking For Myself
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingFor("others")}
                      className={`flex-1 py-3 text-[10px] font-bold tracking-[0.15em] uppercase rounded-full transition-all duration-300 ${bookingFor === "others"
                        ? "bg-[#D14D7E] text-white shadow-lg shadow-[#D14D7E]/20"
                        : "text-[var(--foreground)] opacity-60 hover:opacity-100 bg-transparent"
                        }`}
                    >
                      For Someone Else
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--foreground)] opacity-60 mb-2 block">
                      Select Suite
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-black/5 dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-[var(--foreground)] text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#D14D7E]/50 focus:ring-1 focus:ring-[#D14D7E]/50"
                        value={bookingRoomId}
                        onChange={e => setBookingRoomId(e.target.value)}
                        required
                      >
                        <option value="" className="bg-[var(--background)]">— Choose an available suite —</option>
                        {Object.entries(
                          rooms
                            .filter((r: Room) => !isRoomBooked(r.id))
                            .reduce((acc: Record<string, Room[]>, r: Room) => {
                              if (!acc[r.type]) acc[r.type] = []
                              acc[r.type].push(r)
                              return acc
                            }, {})
                        ).map(([type, groupRooms]) => (
                          <optgroup key={type} label={type} className="bg-[var(--background)] text-[var(--foreground)] font-bold">
                            {(groupRooms as Room[]).map((r: Room) => (
                              <option key={r.id} value={r.id} className="bg-[var(--background)] text-[var(--foreground)] font-normal">
                                {r.name} ₹{r.price}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#D14D7E] text-xs">▼</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--foreground)] opacity-60 mb-2 block">
                      {bookingFor === "myself" ? "Confirm Name" : "Guest Full Name"}
                    </label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)] opacity-40" size={16} />
                      <input
                        type="text"
                        required
                        className="w-full bg-black/5 dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 pl-12 text-[var(--foreground)] text-sm focus:outline-none focus:border-[#D14D7E]/50 focus:ring-1 focus:ring-[#D14D7E]/50"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--foreground)] opacity-60 mb-2 block">Phone</label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          required
                          className="w-full bg-black/5 dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-[var(--foreground)] text-sm focus:outline-none focus:border-[#D14D7E]/50"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="10-digit number"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--foreground)] opacity-60 mb-2 block">Email</label>
                      <input
                        type="email"
                        required
                        className="w-full bg-black/5 dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-[var(--foreground)] text-sm focus:outline-none focus:border-[#D14D7E]/50"
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--foreground)] opacity-60 mb-2 block">Check In</label>
                      <input
                        type="date"
                        required
                        className="w-full bg-black/5 dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-[var(--foreground)] text-sm dark:[color-scheme:dark]"
                        value={checkIn}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={e => setCheckIn(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--foreground)] opacity-60 mb-2 block">Check Out</label>
                      <input
                        type="date"
                        required
                        className="w-full bg-black/5 dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-[var(--foreground)] text-sm dark:[color-scheme:dark]"
                        value={checkOut}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        onChange={e => setCheckOut(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !bookingRoomId || !checkIn || !checkOut}
                    className="w-full py-4 rounded-full bg-[#D14D7E] text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#D14D7E]/30 mt-2 text-xs uppercase tracking-wider"
                  >
                    {isSubmitting ? "Saving Request..." : "Next: Payment Verification"}
                  </button>
                </>
              ) : (
                <>
                  {/* Step 2: Payment Verification */}
                  <div className="text-center mb-4">
                    <div className="inline-block p-4 bg-white rounded-3xl mb-4 shadow-xl border border-[var(--gold-primary)]/20">
                      <img src="/booking-qr.jpg" alt="UPI QR Code" className="w-48 h-48 object-contain" />
                    </div>
                    <div className="bg-black/5 dark:bg-black/60 p-4 rounded-2xl border border-black/10 dark:border-white/10">
                      <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Pay Booking Fee ₹300 to</p>
                      <p className="text-lg font-mono font-bold text-[#D14D7E]">7002586087-2@ybl</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--foreground)] opacity-60 mb-2 block">Upload Proof</label>
                      <div className="relative h-24 border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl flex items-center justify-center bg-black/5 dark:bg-black/40 overflow-hidden">
                        {paymentPreview ? (
                          <div className="relative w-full h-full">
                            <img src={paymentPreview} alt="Preview" className="w-full h-full object-cover opacity-50" />
                            <button type="button" onClick={() => { setPaymentImage(null); setPaymentPreview(""); }} className="absolute inset-0 flex items-center justify-center font-bold text-rose-500">Remove</button>
                          </div>
                        ) : (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setPaymentImage(file);
                                  const reader = new FileReader();
                                  reader.onloadend = () => setPaymentPreview(reader.result as string);
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <div className="text-[#D14D7E] text-xs font-bold">Click to upload screenshot</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--foreground)] opacity-60 mb-2 block">Txn ID (Optional)</label>
                      <input
                        type="text"
                        className="w-full bg-black/5 dark:bg-black/60 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-[var(--foreground)] text-sm"
                        value={upiTxnId}
                        onChange={e => setUpiTxnId(e.target.value)}
                        placeholder="Ex: 123456789012"
                      />
                    </div>
                  </div>

                  {/* Immediate Assistance Section in Step 2 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-2">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mb-3 text-center">Trouble paying? Contact Owner</p>
                    <div className="flex gap-2 justify-center flex-wrap mb-4">
                      {contactNumbers.map(num => (
                        <button key={num} type="button" onClick={() => setSelectedContact(num)} className={`px-2 py-1 text-[10px] rounded-full ${selectedContact === num ? "bg-[#D14D7E] text-white" : "bg-white/5 text-white/50"}`}>{num}</button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a href={`https://wa.me/91${selectedContact}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366]/10 text-[#25D366] text-center py-2 rounded-xl text-[10px] font-bold border border-[#25D366]/20">WhatsApp</a>
                      <a href={`tel:+91${selectedContact}`} className="flex-1 bg-blue-500/10 text-blue-400 text-center py-2 rounded-xl text-[10px] font-bold border border-blue-500/20">Call</a>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">Back</button>
                      <button type="submit" disabled={isSubmitting || !paymentImage} className="flex-[2] py-4 rounded-full bg-[#D14D7E] text-white font-bold text-[10px] uppercase tracking-widest disabled:opacity-40">{isSubmitting ? "Updating..." : "Submit Proof"}</button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSuccessMsg("Inquiry persistence restored. Admin will verify manually.")
                        // We already saved in step 1, so we just show success.
                      }}
                      className="w-full py-4 rounded-full border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] text-[10px] font-bold uppercase tracking-widest"
                    >
                      Can&apos;t Pay? Submit for Manual Review
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
