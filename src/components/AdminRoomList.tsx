"use client"

import { useState, useRef, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { uploadRoomImages, removeRoomImage, updateBookingStatus, deleteRoom } from "@/app/admin/actions"
import { ImagePlus, Eye, XCircle, CheckCircle, ChevronDown, ChevronUp, Trash2, Upload, Loader2 } from "lucide-react"

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

export default function AdminRoomList({ rooms, bookings = [] }: { rooms: any[], bookings?: any[] }) {
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [previewFiles, setPreviewFiles] = useState<{ [roomId: string]: { files: File[], previews: string[] } }>({})
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timerId: NodeJS.Timeout
    if (uploadStatus) {
      timerId = setTimeout(() => setUploadStatus(""), 3000)
    }
    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [uploadStatus])

  const handleFilesSelected = (roomId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    
    const previews = files.map(f => URL.createObjectURL(f))
    setPreviewFiles(prev => ({ ...prev, [roomId]: { files, previews } }))
    setUploadStatus("")
  }

  const cancelPreview = (roomId: string) => {
    const data = previewFiles[roomId]
    if (data) data.previews.forEach(URL.revokeObjectURL)
    setPreviewFiles(prev => { const n = { ...prev }; delete n[roomId]; return n })
    if (fileInputRefs.current[roomId]) fileInputRefs.current[roomId]!.value = ""
    setUploadStatus("")
  }

  const confirmUpload = async (roomId: string) => {
    const data = previewFiles[roomId]
    if (!data || data.files.length === 0) return
    
    setUploadingId(roomId)
    setUploadStatus("Uploading...")
    
    const formData = new FormData()
    setUploadStatus("Compressing images...")
    
    for (const f of data.files) {
      const compressed = await compressImage(f)
      formData.append("images", compressed)
    }
    
    setUploadStatus("Uploading...")
    
    startTransition(async () => {
      const result = await uploadRoomImages(roomId, formData)
      
      if (result?.success) {
        setUploadStatus(`✓ ${result.count} image(s) uploaded successfully!`)
        router.refresh()
      } else {
        setUploadStatus("✕ Upload failed. Try again.")
      }
      
      data.previews.forEach(URL.revokeObjectURL)
      setPreviewFiles(prev => { const n = { ...prev }; delete n[roomId]; return n })
      if (fileInputRefs.current[roomId]) fileInputRefs.current[roomId]!.value = ""
      setUploadingId(null)
    })
  }

  const handleRemoveImage = async (roomId: string, idx: number) => {
    if (window.confirm("Remove this image?")) {
      startTransition(async () => {
        await removeRoomImage(roomId, idx)
        router.refresh()
      })
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm("Cancel this approved booking? The guest will be notified via email.")) {
      startTransition(async () => {
        await updateBookingStatus(bookingId, "REJECTED")
        router.refresh()
      })
    }
  }

  const handleApproveBooking = async (bookingId: string) => {
    startTransition(async () => {
      await updateBookingStatus(bookingId, "APPROVED")
      router.refresh()
    })
  }

  const handleDeleteRoom = async () => {
    if (!deleteConfirm) return
    setIsDeleting(true)
    startTransition(async () => {
      await deleteRoom(deleteConfirm.id)
      setDeleteConfirm(null)
      setIsDeleting(false)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="bg-[#111] border-2 border-rose-500/30 rounded-3xl p-8 md:p-10 max-w-md w-full text-center shadow-2xl shadow-rose-500/10">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
              <Trash2 className="text-rose-500" size={28} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-white">Remove Suite</h3>
            <p className="text-sm opacity-60 mb-2">Are you sure you want to permanently remove</p>
            <p className="text-lg font-bold text-rose-500 mb-6">{deleteConfirm.name}?</p>
            <p className="text-[10px] uppercase tracking-widest opacity-30 mb-8">This action cannot be undone. All images and data for this suite will be lost.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 py-4 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRoom}
                disabled={isDeleting}
                className="flex-1 py-4 rounded-2xl bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {rooms.map(room => {
        let images: string[] = []
        try {
          images = typeof room.images === 'string' ? JSON.parse(room.images) : (room.images || [])
        } catch(e) {
          images = []
        }

        const roomBookings = bookings.filter((b: any) => b.roomId === room.id)
        const activeBooking = roomBookings.find((b: any) =>
          b.status === 'APPROVED' &&
          new Date(b.checkIn) <= new Date() &&
          new Date(b.checkOut) >= new Date()
        )
        const isExpanded = expandedId === room.id
        const preview = previewFiles[room.id]

        return (
          <div key={room.id} className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden transition-all hover:border-white/10">
            {/* Room Header */}
            <div 
              className="p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-white/5 transition-colors gap-4"
              onClick={() => setExpandedId(isExpanded ? null : room.id)}
            >
              <div className="flex items-center gap-4 md:gap-6">
                {images.length > 0 ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={images[0]} alt={room.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <ImagePlus size={20} className="text-[var(--accent-primary)] opacity-40" />
                  </div>
                )}
                
                <div>
                  <h3 className="font-heading font-bold text-lg md:text-xl leading-tight">{room.name}</h3>
                  <div className="flex flex-wrap gap-2 md:gap-3 mt-1">
                    <span className="text-[9px] md:text-[10px] font-bold tracking-[0.15em] uppercase opacity-40">{room.location}</span>
                    <span className="text-[9px] md:text-[10px] font-bold tracking-[0.15em] uppercase opacity-40">•</span>
                    <span className="text-[9px] md:text-[10px] font-bold tracking-[0.15em] uppercase opacity-40">{room.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-6 justify-between md:justify-end w-full md:w-auto border-t border-white/5 pt-4 md:border-t-0 md:pt-0">
                <span className="font-bold text-lg text-[var(--accent-primary)]">Price: {"\u20B9"}{room.price}</span>
                
                {activeBooking ? (
                  <span className="px-4 py-1.5 rounded-full text-[9px] font-bold tracking-[0.1em] uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    Occupied
                  </span>
                ) : (
                  <span className="px-4 py-1.5 rounded-full text-[9px] font-bold tracking-[0.1em] uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Available
                  </span>
                )}

                <span className="text-[9px] font-bold tracking-widest uppercase opacity-30">{images.length} img</span>

                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ id: room.id, name: room.name }); }}
                  className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                  title="Remove Suite"
                >
                  <Trash2 size={14} />
                </button>

                {isExpanded ? <ChevronUp size={16} className="opacity-30" /> : <ChevronDown size={16} className="opacity-30" />}
              </div>
            </div>

            {/* Expanded Panel */}
            {isExpanded && (
              <div className="border-t border-white/5 bg-black/5 dark:bg-white/[0.02]">
                {/* Image Gallery */}
                <div className="p-6 border-b border-white/5">
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-4">Visual Assets ({images.length})</h4>
                  {images.length > 0 ? (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {images.map((img: string, i: number) => (
                        <div key={i} className="w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/5 group relative">
                          <img src={img} alt={`${room.name} ${i+1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleRemoveImage(room.id, i); }}
                              className="p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-500"
                              title="Remove image"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm opacity-30 italic">No images uploaded yet.</p>
                  )}
                  
                  {/* Upload Section */}
                  <div className="mt-6">
                    <input 
                      ref={el => { fileInputRefs.current[room.id] = el }}
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={(e) => handleFilesSelected(room.id, e)}
                      className="block w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[var(--accent-primary)] file:text-white hover:file:bg-[var(--accent-primary)]/80 cursor-pointer" 
                    />

                    {/* Preview selected files */}
                    {preview && preview.previews.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-3">Preview ({preview.files.length} selected)</h5>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                          {preview.previews.map((src, i) => (
                            <div key={i} className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-[var(--accent-primary)]/30">
                              <img src={src} alt={`Preview ${i+1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-4 mt-4">
                          <button 
                            onClick={() => confirmUpload(room.id)}
                            disabled={uploadingId === room.id}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold tracking-widest uppercase hover:bg-emerald-400 transition-colors disabled:opacity-50"
                          >
                            {uploadingId === room.id ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                            {uploadingId === room.id ? "Uploading..." : "Confirm Upload"}
                          </button>
                          <button 
                            onClick={() => cancelPreview(room.id)}
                            className="px-6 py-2.5 rounded-full border border-white/10 text-[10px] font-bold tracking-widest uppercase hover:bg-white/5 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Upload Status */}
                    {uploadStatus && expandedId === room.id && (
                      <div className={`mt-4 p-3 rounded-xl text-sm font-bold ${
                        uploadStatus.startsWith("✓") ? "bg-emerald-500/10 text-emerald-500" : 
                        uploadStatus.startsWith("✕") ? "bg-rose-500/10 text-rose-500" : 
                        "bg-amber-500/10 text-amber-500"
                      }`}>
                        {uploadStatus}
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Bookings */}
                <div className="p-6">
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-4">Booking Protocols</h4>
                  {roomBookings.length === 0 ? (
                    <p className="text-sm opacity-30 italic">No booking history for this suite.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {roomBookings.map((b: any) => (
                        <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] gap-4">
                          <div>
                            <span className="font-bold text-sm">{b.customerName}</span>
                            <span className="block text-[9px] opacity-40 tracking-widest">{b.customerEmail}</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="text-[10px] opacity-50">
                              {new Date(b.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })} — {new Date(b.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                            
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.1em] uppercase ${
                              b.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                              b.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                              'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            }`}>
                              {b.status}
                            </span>

                            {b.status === 'APPROVED' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleCancelBooking(b.id); }}
                                className="flex items-center gap-2 text-rose-500 hover:text-rose-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
                              >
                                <XCircle size={14} /> Revoke
                              </button>
                            )}
                            {b.status === 'PENDING' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleApproveBooking(b.id); }}
                                disabled={isPending}
                                className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
