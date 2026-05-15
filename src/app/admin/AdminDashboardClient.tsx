"use client"

import { useState } from "react"
import { addRoom } from "./actions"
import ManualBookingForm from "@/components/ManualBookingForm"
import AdminRoomList from "@/components/AdminRoomList"
import AdminBookingsTable from "./AdminBookingsTable"
import { Plus, X, Calendar, Home } from "lucide-react"

export default function AdminDashboardClient({ rooms, bookings }: { rooms: any[], bookings: any[] }) {
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [activeTab, setActiveTab] = useState<"bookings" | "manual" | "rooms">("bookings")

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 palace-bg min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-cinzel text-[var(--accent-primary)] mb-2">
            Palace <span className="text-[var(--gold-primary)]">Admin</span>
          </h1>
          <p className="opacity-70 italic">Manage your royal domain and guest experiences.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowAddRoom(!showAddRoom)}
            className={`btn-primary flex items-center gap-2 ${showAddRoom ? 'bg-red-600' : ''}`}
          >
            {showAddRoom ? <X size={18} /> : <Plus size={18} />}
            {showAddRoom ? 'Cancel' : 'Add New Room'}
          </button>
          <a href="/api/admin/export" download className="btn-outline flex items-center gap-2">
            Export Data
          </a>
        </div>
      </div>

      {/* Conditionally Show Add Room Form */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="glass-panel p-8 w-full max-w-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowAddRoom(false)}
              className="absolute top-4 right-4 text-[var(--accent-primary)] hover:scale-110 transition-transform"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 font-cinzel gold-shimmer">Establish New Suite</h2>
            <form action={async (fd) => { await addRoom(fd); setShowAddRoom(false); }} className="flex flex-col gap-4">
              <input type="text" name="name" placeholder="Room Name" required className="form-input" />
              <textarea name="description" placeholder="Description" required className="form-input min-h-[100px]" />
              
              <div className="flex gap-4">
                <input type="number" name="price" placeholder="Price (₹)" required className="form-input w-full" />
                <input type="text" name="floor" placeholder="Floor (e.g. 1st, Top, Left)" required className="form-input w-full" />
              </div>

              <div className="flex gap-4">
                <select name="location" className="form-select w-full" required>
                  <option value="Chaliha Nagar">Chaliha Nagar</option>
                  <option value="Bordoloi Nagar (Near Lake)">Bordoloi Nagar (Near Lake)</option>
                  <option value="Bordoloi Nagar (Near Income Tax Office)">Bordoloi Nagar (Near Income Tax Office)</option>
                </select>
              </div>

              <div className="flex gap-4">
                <select name="type" className="form-select w-full">
                  <option value="Cozy Pink Room">Cozy Pink Room</option>
                  <option value="Deluxe Room">Deluxe Room</option>
                  <option value="Premium 1BHK Suite">Premium 1BHK Suite</option>
                  <option value="2BHK House">2BHK House</option>
                  <option value="1RK">1RK</option>
                </select>
                <input type="text" name="roomNumber" placeholder="Number" required className="form-input w-full" />
              </div>

              <label className="form-label mt-2">Suite Images (0-10)</label>
              <input type="file" name="images" multiple accept="image/*" className="form-input" />
              
              <button type="submit" className="btn-primary mt-4">Confirm New Suite</button>
            </form>
          </div>
        </div>
      )}

      {/* Tabs Selection */}
      <div className="flex gap-2 mb-8 border-b border-black/10 dark:border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all font-cinzel tracking-widest uppercase text-xs
            ${activeTab === "bookings" ? 'bg-[var(--accent-primary)] text-white' : 'opacity-60 hover:opacity-100'}`}
        >
          <Calendar size={16} /> Guest Bookings
        </button>
        <button 
          onClick={() => setActiveTab("manual")}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all font-cinzel tracking-widest uppercase text-xs
            ${activeTab === "manual" ? 'bg-[var(--gold-primary)] text-white' : 'opacity-60 hover:opacity-100'}`}
        >
          <Plus size={16} /> New Booking
        </button>
        <button 
          onClick={() => setActiveTab("rooms")}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all font-cinzel tracking-widest uppercase text-xs
            ${activeTab === "rooms" ? 'bg-[var(--accent-primary)] text-white' : 'opacity-60 hover:opacity-100'}`}
        >
          <Home size={16} /> Manage Suites
        </button>
      </div>

      <div className="animate-in fade-in duration-500">
        {activeTab === "bookings" && (
          <div className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-6 font-cinzel text-[var(--accent-primary)]">Current Guest List</h2>
            <AdminBookingsTable bookings={bookings} />
          </div>
        )}

        {activeTab === "manual" && (
          <ManualBookingForm rooms={rooms} />
        )}

        {activeTab === "rooms" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8">
              <h2 className="text-2xl font-bold mb-6 font-cinzel">Active Suites</h2>
              <AdminRoomList rooms={rooms} bookings={bookings} />
            </div>
            <div className="glass-panel p-8">
               <h2 className="text-2xl font-bold mb-4 font-cinzel">Management Tips</h2>
               <ul className="list-disc pl-6 opacity-80 flex flex-col gap-3 italic">
                 <li>Ensure all "Pending" requests are addressed within 24 hours.</li>
                 <li>Manual bookings automatically send confirmation emails to guests.</li>
                 <li>You can update room images (up to 10) in the "Active Suites" list.</li>
               </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
