"use client"

import { useState, useMemo } from "react"
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
    <div className="glass-panel p-8">
      <h2 className="text-2xl font-bold mb-6 font-cinzel gold-shimmer">New Royal Booking</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Step 1: Location */}
        <div>
          <label className="form-label">Select Location</label>
          <div className="flex flex-wrap gap-3">
            {locations.map(loc => (
              <label key={loc} className={`px-4 py-2 rounded-full border cursor-pointer transition-all text-xs font-bold tracking-wider uppercase
                ${selectedLocation === loc 
                  ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-[0_0_15px_var(--accent-primary)]' 
                  : 'bg-transparent border-black/10 dark:border-white/10 opacity-60 hover:opacity-100'}`}>
                <input 
                  type="radio" 
                  name="location" 
                  className="hidden" 
                  checked={selectedLocation === loc}
                  onChange={() => handleLocationChange(loc)}
                />
                {loc}
              </label>
            ))}
          </div>
        </div>

        {/* Step 2: Room Type (Filtered) */}
        {selectedLocation && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="form-label">Room Type at {selectedLocation}</label>
            <div className="flex flex-wrap gap-3">
              {availableTypes.map(type => (
                <label key={type} className={`px-4 py-2 rounded-full border cursor-pointer transition-all text-xs font-bold tracking-wider uppercase
                  ${selectedType === type 
                    ? 'bg-[var(--gold-primary)] border-[var(--gold-primary)] text-white shadow-[0_0_15px_var(--gold-primary)]' 
                    : 'bg-transparent border-black/10 dark:border-white/10 opacity-60 hover:opacity-100'}`}>
                  <input 
                    type="radio" 
                    name="type" 
                    className="hidden" 
                    checked={selectedType === type}
                    onChange={() => handleTypeChange(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Specific Room (Filtered) */}
        {selectedType && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="form-label">Select Suite Number / Floor</label>
            <div className="flex flex-wrap gap-3">
              {availableRooms.map(room => (
                <label key={room.id} className={`px-4 py-2 rounded-lg border cursor-pointer transition-all text-sm
                  ${selectedRoomId === room.id 
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 ring-2 ring-[var(--accent-primary)]' 
                    : 'border-black/10 dark:border-white/10 hover:border-[var(--accent-primary)]/50'}`}>
                  <input 
                    type="radio" 
                    name="roomId" 
                    className="hidden" 
                    checked={selectedRoomId === room.id}
                    onChange={() => setSelectedRoomId(room.id)}
                  />
                  <div className="font-bold">{room.name}</div>
                  <div className="text-[10px] opacity-70 uppercase tracking-tighter">
                    {room.floor} • ₹{room.price}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Customer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Customer Name</label>
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
            <label className="form-label">Customer Email</label>
            <input 
              type="email" 
              required 
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="form-input" 
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Check-In Date</label>
            <input 
              type="date" 
              required 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="form-input" 
            />
          </div>
          <div>
            <label className="form-label">Check-Out Date</label>
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
          className="btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Confirming..." : "Confirm Royal Booking"}
        </button>
      </form>
    </div>
  )
}
