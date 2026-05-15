"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"

export default function RoomCard({ room, onBook, isBooked, hideBookButton = false, availableFloors = null }: { room: any, onBook?: () => void, isBooked?: boolean, hideBookButton?: boolean, availableFloors?: string | null }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.5 })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Identify suite type for styling
  const typeLower = (room.type || "").toLowerCase()
  const isCoupleSuite = typeLower.includes("couple")
  const isGrandSuite = typeLower.includes("grand")

  // Parse images. If none or invalid, provide a fallback.
  let images: string[] = []
  try {
    images = typeof room.images === 'string' ? JSON.parse(room.images) : room.images
  } catch (e) {
    images = []
  }
  
  if (!images || images.length === 0) {
    if (room.imageUrl) {
      images = [room.imageUrl]
    } else {
      images = [
        isCoupleSuite ? "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000" :
        isGrandSuite ? "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1000" :
        "https://images.unsplash.com/photo-1560185016-6c3717c37668?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1542314831-c6a4d14d8376?auto=format&fit=crop&q=80&w=1000"
      ]
    }
  }

  // Auto slide show when in view
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isInView && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isInView, images.length])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`glass-panel flex flex-col overflow-hidden relative group 
        ${isCoupleSuite ? 'couple-theme' : ''} 
        ${isGrandSuite ? 'border-4 shadow-[0_0_30px_rgba(209,77,126,0.4)]' : 'ornate-border'}`}
    >
      <div className="h-72 md:h-80 overflow-hidden relative">
        <motion.img 
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          src={images[currentImageIndex]} 
          alt={room.name}
          className="w-full h-full object-cover transition-all duration-[6000ms] ease-out group-hover:scale-[1.15] group-hover:brightness-110"
        />
        
        {/* Intrusive overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />
        
        <div className="absolute top-4 right-4 bg-[var(--accent-primary)] text-white px-4 py-2 rounded font-cinzel font-bold shadow-[0_0_15px_rgba(209,77,126,0.6)] backdrop-blur-sm z-10 flex items-center gap-2">
          {isGrandSuite && <span className="animate-pulse">✨</span>}
          ₹{room.price} <span className="text-sm opacity-80">/ night</span>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-8 bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-8 flex-grow flex flex-col backdrop-blur-md palace-bg relative" style={{ backgroundColor: "rgba(var(--background-rgb, 255,255,255), 0.05)" }}>
        {/* Floating Artifacts */}
        {isCoupleSuite && (
          <div className="absolute top-4 right-8 text-4xl opacity-20 animate-float pointer-events-none">🌹</div>
        )}
        {isGrandSuite && (
           <div className="absolute top-4 right-8 text-4xl opacity-20 animate-float pointer-events-none">👑</div>
        )}

        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-3xl font-cinzel font-bold ${isGrandSuite ? 'gold-shimmer' : 'gold-gradient-text'}`}>
            {room.type || room.name}
          </h3>
        </div>
        
        <div className="mb-4 flex flex-wrap gap-2">
           <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent-primary)] border border-[var(--accent-primary)]/40 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 backdrop-blur-sm whitespace-normal text-center">
             {availableFloors ? availableFloors : `Floor ${room.floor || 1}`}
           </span>
        </div>

        <p className="opacity-90 text-md mb-8 flex-grow italic font-serif leading-relaxed">
          {room.description}
        </p>
        
        {!hideBookButton && onBook && (
          <div className="mt-auto">
            {isBooked ? (
              <button className="bg-black/40 text-white/50 border border-white/10 px-8 py-4 rounded-lg font-cinzel font-bold tracking-widest uppercase cursor-not-allowed w-full shadow-inner" disabled>
                Currently Occupied
              </button>
            ) : (
              <button 
                className={`btn-primary w-full text-lg group-hover:shadow-[0_0_25px_var(--accent-primary)] ${isGrandSuite ? 'bg-gradient-to-r from-pink-700 via-pink-500 to-pink-700' : ''}`}
                onClick={onBook}
              >
                Reserve Suite
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
