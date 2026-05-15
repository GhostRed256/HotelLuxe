"use client"

import { useState } from "react"
import { uploadRoomImages, deleteRoom } from "@/app/admin/actions"
import { Trash2 } from "lucide-react"

export default function AdminRoomList({ rooms, bookings = [] }: { rooms: any[], bookings?: any[] }) {
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>, roomId: string) => {
    e.preventDefault()
    setUploadingId(roomId)
    const formData = new FormData(e.currentTarget)
    await uploadRoomImages(roomId, formData)
    setUploadingId(null)
    e.currentTarget.reset()
  }

  const handleDelete = async (roomId: string) => {
    if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      setDeletingId(roomId)
      await deleteRoom(roomId)
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {rooms.map(room => {
        let imagesCount = 0
        try {
          const imgs = typeof room.images === 'string' ? JSON.parse(room.images) : (room.images || [])
          imagesCount = imgs?.length || 0
        } catch(e) {
          imagesCount = 0
        }

        const currentOccupant = bookings.find((b: any) => 
          b.roomId === room.id && 
          b.status === 'APPROVED' &&
          new Date(b.checkIn) <= new Date() && 
          new Date(b.checkOut) >= new Date()
        )

        return (
          <div key={room.id} className="p-4 border border-black/10 dark:border-white/10 rounded-lg flex flex-col gap-2 hover:border-[var(--accent-primary)]/50 transition-colors bg-black/5 dark:bg-white/5 relative">
            <button 
              onClick={() => handleDelete(room.id)}
              disabled={deletingId === room.id}
              className="absolute top-4 right-4 text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-colors"
              title="Delete Room"
            >
              <Trash2 size={18} />
            </button>

            <div className="flex justify-between items-start pr-10">
              <div>
                <h3 className="font-bold font-cinzel text-lg">{room.name}</h3>
                <p className="text-sm opacity-70">{room.location} • {room.floor} • {room.type}</p>
                <p className="text-xs text-[var(--accent-primary)] font-bold mt-1">{imagesCount} Images Uploaded</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-[var(--accent-primary)] block">₹{room.price}</span>
                {currentOccupant ? (
                  <span className="text-xs bg-red-500/20 text-red-700 dark:text-red-400 px-2 py-1 rounded font-bold mt-1 block">
                    Occupied: {currentOccupant.customerName}
                  </span>
                ) : (
                  <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded font-bold mt-1 block">
                    Available
                  </span>
                )}
              </div>
            </div>
            
            <form onSubmit={(e) => handleUpload(e, room.id)} className="flex gap-2 items-center mt-2 border-t border-black/5 dark:border-white/5 pt-2">
              <input type="file" name="images" multiple accept="image/*" required className="text-sm flex-1 p-1" />
              <button type="submit" disabled={uploadingId === room.id} className="btn-outline py-1 px-3 text-xs w-auto">
                {uploadingId === room.id ? "..." : "Upload"}
              </button>
            </form>
          </div>
        )
      })}
    </div>
  )
}
