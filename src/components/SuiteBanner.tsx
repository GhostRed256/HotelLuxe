"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import ProgressiveImage from "./ProgressiveImage"


interface SuiteBannerProps {
  rooms: any[]
  bookings?: any[]
}

export default function SuiteBanner({ rooms, bookings = [] }: SuiteBannerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Group by type - pick one representative per type
  const suiteTypes = ["Cozy Pink Room", "Deluxe Room", "Premium Suite", "2BHK House"]

  const categories = suiteTypes.map(type => {
    const typeRooms = rooms.filter((r: any) => r.type === type)
    if (typeRooms.length === 0) return null
    const rep = typeRooms[0]

    let img = ""
    try {
      const imgs = typeof rep.images === 'string' ? JSON.parse(rep.images) : (rep.images || [])
      img = imgs?.[0] || ""
    } catch { img = "" }

    if (!img) {
      const t = type.toLowerCase()
      img = t.includes("cozy") ? "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
        : t.includes("deluxe") ? "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800"
          : t.includes("1bhk") ? "https://images.unsplash.com/photo-1560185016-6c3717c37668?auto=format&fit=crop&q=80&w=800"
            : "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800"
    }

    const availableCount = typeRooms.filter((r: any) => {
      return !bookings.some(b =>
        b.roomId === r.id &&
        b.status === 'APPROVED' &&
        new Date(b.checkIn) <= new Date() &&
        new Date(b.checkOut) >= new Date()
      )
    }).length

    return {
      type,
      price: rep.price,
      image: img,
      total: typeRooms.length,
      available: availableCount,
      description: rep.description?.slice(0, 80) + "..." || "Premium stay in Tinsukia."
    }
  }).filter(Boolean) as any[]

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const w = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({ left: dir === "left" ? -w : w, behavior: "smooth" })
    }
  }

  return (
    <section className="py-24 relative overflow-hidden bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-heading font-black tracking-tight mb-3"
            >
              Choose Your <span className="text-[var(--accent-primary)]">Haven</span>
            </motion.h2>
            <p className="opacity-50 font-light text-lg italic">Scroll to explore our curated categories.</p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Tiles */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.type}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="snap-start flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[42vw] lg:w-[30vw]"
            >
              <Link href={`/rooms?suite=${encodeURIComponent(cat.type)}`} className="block group">
                <div className="relative h-[50vh] md:h-[60vh] rounded-3xl overflow-hidden border border-white/5 bg-black">
                  {/* Background Image using Progressive Loading */}
                  <ProgressiveImage
                    src={cat.image}
                    alt={cat.type}
                    priority={i === 0}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-0"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Availability Badge */}
                  <div className="absolute top-6 left-6 flex gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold tracking-[0.1em] uppercase backdrop-blur-xl border ${cat.available > 0
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/20'
                      }`}>
                      {cat.available > 0 ? `${cat.available} Available` : 'Fully Booked'}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="px-5 py-2 rounded-full bg-black/40 backdrop-blur-xl text-white text-sm font-bold border border-white/10">
                      From ₹{cat.price}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--gold-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] backdrop-blur-md shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.2)]">
                        {cat.type.toLowerCase().includes("cozy") ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3v18" /><path d="M12.5 3v18" /></svg>
                        ) : cat.type.toLowerCase().includes("deluxe") ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                        ) : cat.type.toLowerCase().includes("suite") ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /><path d="M3 9h18" /></svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        )}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-heading font-black text-white leading-tight">
                        {cat.type}
                      </h3>
                    </div>
                    <p className="text-white/50 font-light text-sm mb-6 max-w-[80%]">
                      {cat.description}
                    </p>
                    <div className="flex items-center gap-3 text-white/70 group-hover:text-[var(--accent-primary)] transition-colors">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Explore Suite</span>
                      <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
