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
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedRoomId, setSelectedRoomId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Unique locations from rooms
  const locations = useMemo(() => [...new Set(rooms.map(r => r.location))].sort(), [rooms])

  // Filter types based on location
  const availableTypes = useMemo(() => {
    if (!selectedLocation) return []
    return [...new Set(rooms.filter(r => r.location === selectedLocation).map(r => r.type))].sort()
  }, [selectedLocation, rooms])

  // Filter rooms based on type and location
  const availableRooms = useMemo(() => {
    if (!selectedLocation || !selectedType) return []
    return rooms.filter(r => r.location === selectedLocation && r.type === selectedType)
  }, [selectedLocation, selectedType, rooms])

  // Reset dependent selections
  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc)
    setSelectedType("")
    setSelectedRoomId("")
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setSelectedRoomId("")
  }

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
      setSelectedLocation("")
      setSelectedType("")
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
        {/* Step 1: Location */}
        <div>
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">1. Target Location</label>
          <div className="relative">
            <select
              className="form-select w-full"
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              <option value="">Select Location</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
          </div>
        </div>

        {/* Step 2: Room Type (Filtered) */}
        {selectedLocation && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">2. Category Selection</label>
            <div className="relative">
              <select
                className="form-select w-full"
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="">Select Category</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Specific Room (Filtered) */}
        {selectedType && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">3. Suite Designation</label>
            <div className="relative">
              <select
                className="form-select w-full"
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
              >
                <option value="">Select Suite</option>
                {availableRooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} — {room.floor} (₹{room.price})
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
            </div>
          </motion.div>
        )}

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
              onChange={(e) => setCheckOut(e.target.value)}
              className="form-input" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || !selectedRoomId}
          className="btn-primary !py-5 shadow-none hover:shadow-2xl"
        >
          {isSubmitting ? "Processing..." : "Authorize Royal Booking"}
        </button>
      </form>
    </div>
  )
}
