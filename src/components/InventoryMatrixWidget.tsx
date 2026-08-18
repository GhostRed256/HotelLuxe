"use client"

import { useState, useMemo, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toggleRoomInventoryStatus } from "@/app/admin/actions"
import { Building2, X, CheckCircle2, XCircle, RefreshCw, LayoutGrid } from "lucide-react"

interface Room {
  id: string
  name: string
  location?: string
  type?: string
  floor?: string
}

interface Booking {
  roomId: string
  checkIn: string
  checkOut: string
  status?: string
}

interface InventoryMatrixWidgetProps {
  rooms: Room[]
  bookings: Booking[]
}

export default function InventoryMatrixWidget({ rooms = [], bookings = [] }: InventoryMatrixWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [optimisticOverrides, setOptimisticOverrides] = useState<Record<string, boolean>>({})
  const [loadingRoomId, setLoadingRoomId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  // Helper to check if room is currently booked
  const isRoomBooked = (roomId: string): boolean => {
    if (optimisticOverrides[roomId] !== undefined) {
      return optimisticOverrides[roomId]
    }
    // Get today in local time YYYY-MM-DD format
    const today = new Date();
    // Offset for local timezone (IST is +5:30)
    const localTodayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    
    return bookings.some(b => {
      if (b.roomId !== roomId) return false
      if (b.status && b.status !== "APPROVED") return false
      
      const inDate = b.checkIn?.split("T")[0] || "";
      const outDate = b.checkOut?.split("T")[0] || "";
      
      // Compare string dates "2026-08-18"
      return inDate <= localTodayStr && outDate >= localTodayStr;
    })
  }

  // Categorize rooms into the 3 locations from the user sketch: LAKE, IT, Chaliha Nagar
  const groupedRooms = useMemo(() => {
    const lake: Room[] = []
    const it: Room[] = []
    const chaliha: Room[] = []

    rooms.forEach(room => {
      const loc = (room.location || "").toLowerCase()
      const name = (room.name || "").toLowerCase()
      const type = (room.type || "").toLowerCase()

      if (loc.includes("lake") || name.includes("lake") || (loc.includes("bordoloi nagar") && (name.includes("lake") || type.includes("lake")))) {
        lake.push(room)
      } else if (loc.includes("income") || loc.includes("it") || name.includes("it") || type.includes("1bhk") || type.includes("2bhk") || type.includes("3bhk") || type.includes("4bhk")) {
        it.push(room)
      } else {
        chaliha.push(room)
      }
    })

    return { lake, it, chaliha }
  }, [rooms])

  // Count totals
  const stats = useMemo(() => {
    let totalAvail = 0
    let totalBooked = 0

    rooms.forEach(r => {
      if (isRoomBooked(r.id)) {
        totalBooked++
      } else {
        totalAvail++
      }
    })

    return { totalAvail, totalBooked, total: rooms.length }
  }, [rooms, optimisticOverrides, bookings])

  const handleToggle = async (roomId: string, setBooked: boolean) => {
    setOptimisticOverrides(prev => ({ ...prev, [roomId]: setBooked }))
    setLoadingRoomId(roomId)

    startTransition(async () => {
      try {
        await toggleRoomInventoryStatus(roomId, setBooked)
      } catch (e) {
        console.error("Error toggling inventory status:", e)
        // Revert optimistic override on failure
        setOptimisticOverrides(prev => {
          const next = { ...prev }
          delete next[roomId]
          return next
        })
      } finally {
        setLoadingRoomId(null)
      }
    })
  }

  return (
    <>
      {/* Floating Action Launcher Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-[120]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Inventory Quick Manager"
          className="group flex items-center gap-3 px-5 py-3.5 bg-[#1A0811] dark:bg-[#0A0307] text-[#B88F54] border border-[#B88F54]/40 hover:border-[#B88F54] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-xl cursor-pointer"
        >
          <div className="relative">
            <LayoutGrid size={20} className="text-[#B88F54]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white">
              Inventory Matrix
            </span>
            <span className="text-[9px] font-bold text-emerald-400">
              Avail: {stats.totalAvail} | Booked: {stats.totalBooked}
            </span>
          </div>
        </button>
      </div>

      {/* Floating Interactive Inventory Box Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 md:inset-auto md:bottom-24 md:right-6 md:w-[750px] md:max-h-[85vh] bg-[#1A0811]/95 dark:bg-[#0A0307]/98 text-white rounded-3xl border border-[#B88F54]/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-[130] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#B88F54]/20 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#B88F54]/15 border border-[#B88F54]/30 text-[#B88F54]">
                  <Building2 size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-black tracking-tight text-white flex items-center gap-2">
                    STAY N JOY HOMESTAY
                  </h2>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B88F54]">
                    Realtime Inventory & Room Status Manager
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close inventory manager"
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-hide">
              {/* Summary Stats Cards (Matching user's left diagram section) */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-400/80">Total Avail</span>
                    <span className="text-2xl font-black text-emerald-400">{stats.totalAvail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <XCircle size={20} className="text-rose-400" />
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-rose-400/80">Total Booked</span>
                    <span className="text-2xl font-black text-rose-400">{stats.totalBooked}</span>
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-white/60">Total Units</span>
                    <span className="text-2xl font-black text-white">{stats.total}</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1" />
                    <span className="text-[10px] font-bold text-white/70">Live Synced</span>
                  </div>
                </div>
              </div>

              {/* 3 Location Boxes Matrix matching handwritten sketch */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. LAKE Box */}
                <div className="bg-black/50 p-4 rounded-2xl border border-[#B88F54]/30 flex flex-col gap-3">
                  <div className="pb-2 border-b border-[#B88F54]/20 flex items-center justify-between">
                    <h3 className="text-sm font-heading font-black tracking-wider text-[#B88F54] uppercase">
                      📍 LAKE
                    </h3>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#B88F54]/20 text-[#B88F54]">
                      Lake View
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {groupedRooms.lake.map(room => (
                      <RoomRadioCard
                        key={room.id}
                        room={room}
                        isBooked={isRoomBooked(room.id)}
                        isLoading={loadingRoomId === room.id}
                        onToggle={(booked) => handleToggle(room.id, booked)}
                      />
                    ))}
                    {groupedRooms.lake.length === 0 && (
                      <p className="text-xs text-white/40 italic py-4 text-center">No Lake units</p>
                    )}
                  </div>
                </div>

                {/* 2. IT Box */}
                <div className="bg-black/50 p-4 rounded-2xl border border-[#8A2BE2]/30 flex flex-col gap-3">
                  <div className="pb-2 border-b border-[#8A2BE2]/20 flex items-center justify-between">
                    <h3 className="text-sm font-heading font-black tracking-wider text-[#A855F7] uppercase">
                      📍 IT
                    </h3>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#8A2BE2]/20 text-[#A855F7]">
                      Income Tax
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {groupedRooms.it.map(room => (
                      <RoomRadioCard
                        key={room.id}
                        room={room}
                        isBooked={isRoomBooked(room.id)}
                        isLoading={loadingRoomId === room.id}
                        onToggle={(booked) => handleToggle(room.id, booked)}
                      />
                    ))}
                    {groupedRooms.it.length === 0 && (
                      <p className="text-xs text-white/40 italic py-4 text-center">No IT units</p>
                    )}
                  </div>
                </div>

                {/* 3. Chaliha Nagar Box */}
                <div className="bg-black/50 p-4 rounded-2xl border border-[#D14D7E]/30 flex flex-col gap-3">
                  <div className="pb-2 border-b border-[#D14D7E]/20 flex items-center justify-between">
                    <h3 className="text-sm font-heading font-black tracking-wider text-[#D14D7E] uppercase">
                      📍 Chaliha Nagar
                    </h3>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#D14D7E]/20 text-[#D14D7E]">
                      Main Branch
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {groupedRooms.chaliha.map(room => (
                      <RoomRadioCard
                        key={room.id}
                        room={room}
                        isBooked={isRoomBooked(room.id)}
                        isLoading={loadingRoomId === room.id}
                        onToggle={(booked) => handleToggle(room.id, booked)}
                      />
                    ))}
                    {groupedRooms.chaliha.length === 0 && (
                      <p className="text-xs text-white/40 italic py-4 text-center">No Chaliha units</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between text-[10px] text-white/60">
              <span className="flex items-center gap-1.5">
                <RefreshCw size={12} className="text-emerald-400 animate-spin" />
                Live synced with website & backend
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
              >
                Close Box
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function RoomRadioCard({
  room,
  isBooked,
  isLoading,
  onToggle
}: {
  room: Room
  isBooked: boolean
  isLoading: boolean
  onToggle: (setBooked: boolean) => void
}) {
  return (
    <div className={`p-3 rounded-xl border transition-all ${isBooked ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-xs text-white tracking-tight truncate max-w-[130px]" title={room.name}>
          {room.name}
        </span>
        {isLoading ? (
          <RefreshCw size={12} className="animate-spin text-white/70" />
        ) : (
          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${isBooked ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-black'}`}>
            {isBooked ? "Booked" : "Avail"}
          </span>
        )}
      </div>

      {/* Radio Controls */}
      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
        <label
          className={`flex items-center justify-center gap-1.5 p-1.5 rounded-lg cursor-pointer transition-all ${!isBooked ? 'bg-emerald-500 text-black shadow-md font-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
        >
          <input
            type="radio"
            name={`room-status-${room.id}`}
            checked={!isBooked}
            onChange={() => onToggle(false)}
            className="hidden"
          />
          <span className={`w-2 h-2 rounded-full ${!isBooked ? 'bg-black' : 'bg-emerald-500'}`} />
          Avail
        </label>

        <label
          className={`flex items-center justify-center gap-1.5 p-1.5 rounded-lg cursor-pointer transition-all ${isBooked ? 'bg-rose-600 text-white shadow-md font-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
        >
          <input
            type="radio"
            name={`room-status-${room.id}`}
            checked={isBooked}
            onChange={() => onToggle(true)}
            className="hidden"
          />
          <span className={`w-2 h-2 rounded-full ${isBooked ? 'bg-white' : 'bg-rose-500'}`} />
          Booked
        </label>
      </div>
    </div>
  )
}
