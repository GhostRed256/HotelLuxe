"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { addRoom } from "./actions"
import ManualBookingForm from "@/components/ManualBookingForm"
import AdminRoomList from "@/components/AdminRoomList"
import AdminBookingsTable from "./AdminBookingsTable"
import { Plus, X, Calendar, Home, Download, ChevronDown, Loader2 } from "lucide-react"

const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.5
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export default function AdminDashboardClient({ rooms, bookings }: { rooms: any[], bookings: any[] }) {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get("tab") as "bookings" | "manual" | "rooms") || "bookings"
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [activeTab, setActiveTab] = useState<"bookings" | "manual" | "rooms">(initialTab)
  const [showCsvExport, setShowCsvExport] = useState(false)

  const [csvStartDate, setCsvStartDate] = useState("")
  const [csvEndDate, setCsvEndDate] = useState("")
  const [isSubmittingRoom, setIsSubmittingRoom] = useState(false)

  const handleSubmitRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingRoom(true)
    
    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      
      const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput && fileInput.files) {
        const files = Array.from(fileInput.files)
        // Clear standard images
        formData.delete("images")
        
        // Add compressed images
        for (const file of files) {
          if (file.size === 0) continue
          const compressed = await compressImage(file)
          formData.append("images", compressed)
        }
      }
      
      await addRoom(formData)
      setShowAddRoom(false)
    } catch(err) {
      console.error("Error establishing suite", err)
    } finally {
      setIsSubmittingRoom(false)
    }
  }

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "manual" || tab === "bookings" || tab === "rooms") {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    if (bookings && bookings.length > 0) {
      try {
        const min = new Date(Math.min(...bookings.map(b => new Date(b.checkIn).getTime()))).toISOString().split('T')[0]
        const approvedBookings = bookings.filter(b => b.status === 'APPROVED')
        const max = approvedBookings.length > 0 
          ? new Date(Math.max(...approvedBookings.map(b => new Date(b.checkOut).getTime()))).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
        setCsvStartDate(min)
        setCsvEndDate(max)
      } catch(e) {}
    }
  }, [bookings])

  const handleExportCSV = () => {
    const csvBookings = bookings.filter(b => {
      try {
        const bIn = new Date(b.checkIn).toISOString().split('T')[0]
        if (csvStartDate && bIn < csvStartDate) return false
        if (csvEndDate && bIn > csvEndDate) return false
      } catch(e) { return false }
      return true
    })

    const headers = ["ID", "Customer Name", "Customer Email", "Phone", "Room", "Check In", "Check Out", "Status"]
    const csvContent = [
      headers.join(","),
      ...csvBookings.map(b => [
        b.id,
        `"${b.customerName}"`,
        `"${b.customerEmail}"`,
        `"${b.customerPhone || ''}"`,
        `"${b.room?.name || 'Unknown'}"`,
        new Date(b.checkIn).toLocaleDateString(),
        new Date(b.checkOut).toLocaleDateString(),
        b.status
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `bookings_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowCsvExport(false)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-12 min-h-screen bg-[var(--background)]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-2">
            Palace <span className="text-[var(--accent-primary)]">Control</span>
          </h1>
          <p className="opacity-50 font-light italic text-lg">Curating the royal experience for every guest.</p>
        </div>
      </div>

      {/* Conditionally Show Add Room Form */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[100] flex items-center justify-center p-4">
          <div className="glass-panel p-10 w-full max-w-2xl relative animate-in fade-in zoom-in duration-500 border-white/10">
            <button 
              onClick={() => setShowAddRoom(false)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-heading font-black mb-10 tracking-tight">Establish <span className="text-[var(--accent-primary)]">Suite</span></h2>
            <form onSubmit={handleSubmitRoom} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-2 block">Name</label>
                <input type="text" name="name" placeholder="E.g. Royal Rose" required disabled={isSubmittingRoom} className="form-input" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-2 block">Description</label>
                <textarea name="description" placeholder="What makes this stay unique?" required disabled={isSubmittingRoom} className="form-input min-h-[100px]" />
              </div>
              
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-2 block">Price (₹)</label>
                <input type="number" name="price" placeholder="1999" required disabled={isSubmittingRoom} className="form-input" />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-2 block">Floor / Level</label>
                <input type="text" name="floor" placeholder="Ground Level" required disabled={isSubmittingRoom} className="form-input" />
              </div>

              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-2 block">Location</label>
                <select name="location" className="form-select" required disabled={isSubmittingRoom}>
                  <option value="Chaliha Nagar">Chaliha Nagar</option>
                  <option value="Bordoloi Nagar (Near Lake)">Bordoloi Nagar (Near Lake)</option>
                  <option value="Bordoloi Nagar (Near Income Tax Office)">Bordoloi Nagar (Near Income Tax Office)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-2 block">Suite Category</label>
                <select name="type" className="form-select" disabled={isSubmittingRoom}>
                  <option value="Cozy Pink Room">Cozy Pink Room</option>
                  <option value="Deluxe Room">Deluxe Room</option>
                  <option value="Premium 1BHK Suite">Premium 1BHK Suite</option>
                  <option value="2BHK House">2BHK House</option>
                  <option value="1BHK">1BHK</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-4 block">Visual Assets (Max 10)</label>
                <input type="file" name="images" multiple accept="image/*" disabled={isSubmittingRoom} className="block w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[var(--accent-primary)] file:text-white hover:file:bg-[var(--accent-primary)]/80 cursor-pointer" />
              </div>
              
              <button type="submit" disabled={isSubmittingRoom} className="md:col-span-2 btn-primary !py-4 mt-4 shadow-none hover:shadow-2xl flex items-center justify-center gap-2">
                {isSubmittingRoom ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Compressing & Establishing...</span>
                  </>
                ) : (
                  <span>Confirm Establishment</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tabs Selection */}
      <div className="flex flex-wrap md:grid md:grid-cols-3 gap-4 md:gap-2 mb-8 backdrop-blur-md bg-white/5 p-2 rounded-2xl border border-white/5 w-fit md:w-full md:max-w-2xl">
        {[
          { id: "bookings", label: "Guest Registry", icon: Calendar },
          { id: "manual", label: "Manual Intake", icon: Plus },
          { id: "rooms", label: "Suite Inventory", icon: Home },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center justify-center gap-3 px-8 py-3 rounded-xl transition-all font-bold tracking-[0.1em] uppercase text-[10px] w-full
              ${activeTab === tab.id ? 'bg-[var(--accent-primary)] text-white shadow-xl' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* CSV Export - Positioned below the tabs selection, collapsible on both mobile and PC */}
      <div className="relative mb-12 w-full max-w-2xl animate-in fade-in duration-500">
        <button 
          onClick={() => setShowCsvExport(!showCsvExport)}
          className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Download size={14} className="text-[var(--accent-primary)]" />
            DOWNLOAD HOMESTAY RECORDS DATA
          </span>
          <ChevronDown size={14} className={`transition-transform duration-300 ${showCsvExport ? 'rotate-180' : ''}`} />
        </button>

        {showCsvExport && (
          <div className="mt-3 p-6 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-3">Filter date range for data export</span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-widest opacity-35">From</span>
                <input 
                  type="date" 
                  value={csvStartDate} 
                  onChange={e => setCsvStartDate(e.target.value)} 
                  className="form-input !py-3 !pl-14 !pr-4 !text-sm w-full cursor-pointer"
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-widest opacity-35">To</span>
                <input 
                  type="date" 
                  value={csvEndDate} 
                  onChange={e => setCsvEndDate(e.target.value)} 
                  className="form-input !py-3 !pl-12 !pr-4 !text-sm w-full cursor-pointer"
                />
              </div>
              <button 
                onClick={handleExportCSV} 
                className="flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-[var(--accent-primary)] text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                <Download size={13} /> Download
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
        {activeTab === "bookings" && (
          <div className="glass-panel p-10 border-white/5">
            <h2 className="text-3xl font-heading font-black mb-10 tracking-tight">Registry <span className="text-[var(--accent-primary)]">Insights</span></h2>
            <AdminBookingsTable bookings={bookings} />
          </div>
        )}

        {activeTab === "manual" && (
          <div className="animate-in fade-in duration-500">
            <ManualBookingForm rooms={rooms} />
          </div>
        )}

        {activeTab === "rooms" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 glass-panel p-10 border-white/5">
              <h2 className="text-3xl font-heading font-black mb-10 tracking-tight">Active <span className="text-[var(--accent-primary)]">Inventory</span></h2>
              <AdminRoomList rooms={rooms} bookings={bookings} />

              {/* Add New Room - Hidden at bottom */}
              <div className="mt-12 pt-8 border-t border-white/5">
                <button
                  onClick={() => setShowAddRoom(!showAddRoom)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
                >
                  {showAddRoom ? <X size={14} /> : <Plus size={14} />}
                  {showAddRoom ? 'Cancel' : 'Add New Suite'}
                </button>
              </div>
            </div>
            <div className="glass-panel p-10 border-white/5 bg-gradient-to-br from-white/5 to-transparent">
               <h2 className="text-xl font-heading font-bold mb-6">Manager Notes</h2>
               <ul className="space-y-6">
                 <li className="flex gap-4 opacity-60 hover:opacity-100 transition-opacity">
                   <div className="h-6 w-6 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] text-[10px] font-bold">1</div>
                   <p className="text-sm font-light italic leading-relaxed">Respond to pending requests within 12h for maximum royalty points.</p>
                 </li>
                 <li className="flex gap-4 opacity-60 hover:opacity-100 transition-opacity">
                   <div className="h-6 w-6 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] text-[10px] font-bold">2</div>
                   <p className="text-sm font-light italic leading-relaxed">Manual bookings trigger immediate confirmation protocols.</p>
                 </li>
                 <li className="flex gap-4 opacity-60 hover:opacity-100 transition-opacity">
                   <div className="h-6 w-6 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] text-[10px] font-bold">3</div>
                   <p className="text-sm font-light italic leading-relaxed">Maintain high resolution assets for the best suite presentation.</p>
                 </li>
               </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
