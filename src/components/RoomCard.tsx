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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel flex flex-col overflow-hidden relative group hover:scale-[1.02]"
    >
      <div className="h-72 md:h-80 overflow-hidden relative">
        <motion.img 
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          src={images[currentImageIndex]} 
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4000ms]"
        />
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-xl text-white px-5 py-2 rounded-full font-bold text-sm border border-white/10 z-10">
          Price: {"\u20B9"}{room.price} <span className="opacity-60 font-normal">/ night</span>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${i === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-10 flex-grow flex flex-col relative bg-white/5">
        <div className="mb-4">
          <h3 className="text-3xl font-heading font-black mb-2 leading-tight text-[var(--foreground)] drop-shadow-sm">
            {room.type || room.name}
          </h3>
        </div>

        <p className="text-sm font-light leading-relaxed opacity-70 flex-grow italic mb-10">
          {room.description}
        </p>
        
        {!hideBookButton && onBook && (
          <div className="mt-auto">
            {isBooked ? (
              <button className="w-full py-4 rounded-full bg-black/5 text-black/30 border border-black/5 dark:bg-white/5 dark:text-white/30 dark:border-white/5 font-bold tracking-widest uppercase cursor-not-allowed text-xs" disabled>
                Reserved
              </button>
            ) : (
              <button 
                className="btn-primary w-full shadow-none hover:shadow-2xl"
                onClick={onBook}
              >
                Reserve Now
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
