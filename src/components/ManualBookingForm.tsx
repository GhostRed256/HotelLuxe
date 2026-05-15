"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { createManualBooking } from "@/app/admin/actions"

interface Room {
  id: string
  name: string
  type: string
  location: string
  price: number
  floor: string
}

export default function ManualBookingForm({ rooms }: { rooms: Room[] }) {
  const [selectedRoomId, setSelectedRoomId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Group rooms by Location + Type for the single dropdown
  const groupedRooms = useMemo(() => {
    const groups: { [key: string]: Room[] } = {}
    rooms.forEach(r => {
      const key = `${r.location} — ${r.type}`
      if (!groups[key]) groups[key] = []
      groups[key].push(r)
    })
    return groups
  }, [rooms])

  const selectedRoomPrice = useMemo(() => {
    const r = rooms.find((r) => r.id === selectedRoomId)
    return r ? (Number(r.price) || 0) : 0
  }, [rooms, selectedRoomId])

  const computedPrice = useMemo(() => {
    if (!checkIn || !checkOut || !selectedRoomPrice) return 0
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    const diffTime = d2.getTime() - d1.getTime()
    if (diffTime <= 0) return 0
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays * selectedRoomPrice
  }, [checkIn, checkOut, selectedRoomPrice])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRoomId) return
    
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("roomId", selectedRoomId)
    formData.append("customerName", customerName)
    formData.append("customerEmail", customerEmail)
    formData.append("checkIn", checkIn)
    formData.append("checkOut", checkOut)
    
    const result = await createManualBooking(formData)
    setIsSubmitting(false)
    
    if (result?.success) {
      alert("Booking created successfully!")
      // Reset form
      setSelectedRoomId("")
      setCustomerName("")
      setCustomerEmail("")
      setCheckIn("")
      setCheckOut("")
    } else {
      alert("Error: " + (result?.error || "Unknown error"))
    }
  }

  return (
    <div className="glass-panel p-10 border-white/5">
      <h2 className="text-3xl font-heading font-black mb-10 tracking-tight">Manual <span className="text-[var(--accent-primary)]">Intake</span></h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {/* Simplified Room Selection */}
        <div>
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Suite Designation</label>
          <div className="relative">
            <select
              className="form-select w-full"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              required
            >
              <option value="">— Select a Suite —</option>
              {Object.entries(groupedRooms).map(([groupName, groupRooms]) => (
                <optgroup key={groupName} label={groupName}>
                  {groupRooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} — Floor {room.floor} (₹{room.price})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-10">
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Guest Name</label>
            <input 
              type="text" 
              required 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="form-input" 
              placeholder="Full Name"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Guest Email</label>
            <input 
              type="email" 
              required 
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="form-input" 
              placeholder="email@example.com"
            />
          </div>
          
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Arrival</label>
            <input 
              type="date" 
              required 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="form-input" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Departure</label>
            <input 
              type="date" 
              required 
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="form-input" 
            />
          </div>
        </div>

        {computedPrice > 0 && (
          <div className="mt-8 mb-6 p-4 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-xl text-center animate-in fade-in zoom-in duration-300">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 block mb-1">Total Stay Value</span>
            <span className="text-2xl font-black text-[var(--accent-primary)]">₹{computedPrice.toLocaleString('en-IN')}</span>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting || !selectedRoomId}
          className="btn-primary w-full !py-5 shadow-none hover:shadow-2xl mt-4"
        >
          {isSubmitting ? "Processing..." : "Authorize Royal Booking"}
        </button>
      </form>
    </div>
  )
}
