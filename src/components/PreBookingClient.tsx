"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import OpeningBookingModal from "./OpeningBookingModal"

interface Category {
  type: string
  price: number
  roomId: string
  image: string
  available: number
  description: string
}

interface PreBookingClientProps {
  categories: Category[]
  rooms: any[]
  bookings: any[]
}

export default function PreBookingClient({
  categories,
  rooms,
  bookings
}: PreBookingClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCat, setSelectedCat] = useState<Category | null>(null)

  const handleBookNow = (cat: Category) => {
    setSelectedCat(cat)
    setIsOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat, i) => {
          const isPink = cat.type.toLowerCase().includes("pink")
          const isDeluxe = cat.type.toLowerCase().includes("deluxe")
          const isPremium = cat.type.toLowerCase().includes("premium")

          let glowClass = "hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
          let btnClass = "bg-[var(--accent-primary)] hover:bg-rose-600 text-white group-hover:shadow-[0_10px_25px_rgba(209,77,126,0.4)]"

          if (isPink) {
            glowClass = "hover:shadow-[0_20px_60px_rgba(209,77,126,0.4)]"
            btnClass = "bg-[#D14D7E] hover:bg-[#A83860] text-white group-hover:shadow-[0_10px_25px_rgba(209,77,126,0.4)]"
          } else if (isDeluxe) {
            glowClass = "hover:shadow-[0_20px_60px_rgba(138,43,226,0.4)]"
            btnClass = "bg-[#8A2BE2] hover:bg-[#5D1E9B] text-white group-hover:shadow-[0_10px_25px_rgba(138,43,226,0.4)]"
          } else if (isPremium) {
            glowClass = "hover:shadow-[0_20px_80px_rgba(184,143,84,0.5)] ring-1 ring-[#B88F54]/50"
            btnClass = "bg-[#B88F54] hover:bg-[#96713F] text-black group-hover:shadow-[0_10px_25px_rgba(184,143,84,0.5)]"
          }

          const colSpanClass = isPremium ? "md:col-span-2" : "col-span-1"

          return (
            <motion.div
              key={`${cat.type}-${cat.price}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => handleBookNow(cat)}
              className={`block group cursor-pointer ${colSpanClass}`}
            >
              <div className={`relative ${isPremium ? 'h-[500px]' : 'h-[400px]'} rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-black shadow-2xl transition-all duration-500 ornate-border ${glowClass}`}>
                <img
                  src={cat.image}
                  alt={cat.type}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

                {/* Price Tag */}
                <div className="absolute top-6 right-6 z-10">
                  <span className="px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-md text-white font-heading font-black text-sm border border-white/20 shadow-lg">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-40 mr-1.5">Starts from</span>
                    ₹{cat.price} <span className="text-[10px] font-normal opacity-60">/ night</span>
                  </span>
                </div>

                {/* Gold corners to reinforce luxury branding */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[var(--gold-primary)]/40 rounded-tl-lg" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[var(--gold-primary)]/40 rounded-br-lg" />

                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                      {cat.available} Available Now
                    </span>
                  </div>
                  <h3 className="text-3xl font-heading font-black mb-2 leading-tight tracking-tight" style={{ color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)' }}>
                    {cat.type}
                  </h3>
                  <p className={`text-white/70 font-light ${isPremium ? 'text-base mb-8 max-w-2xl' : 'text-sm mb-6 max-w-md'} leading-relaxed`}>
                    {cat.description}
                  </p>
                  <div className={`inline-flex items-center justify-center w-full py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] active:scale-98 transition-all duration-300 shadow-lg ${btnClass}`}>
                    Book Now
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        {categories.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-20 bg-white/5 rounded-3xl border border-white/10 p-10">
            <p className="text-xl opacity-60 italic font-light text-[var(--foreground)]">We are currently fully booked. Please check back later.</p>
          </div>
        )}
      </div>

      {/* Mounting exclusive Booking Modal */}
      <OpeningBookingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        selectedCategory={selectedCat}
        rooms={rooms}
        bookings={bookings}
      />
    </>
  )
}
