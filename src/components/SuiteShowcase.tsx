"use client"

import { motion } from "framer-motion"
import RoomCard from "./RoomCard"
import Link from "next/link"

interface SuiteShowcaseProps {
  rooms: any[]
}

export default function SuiteShowcase({ rooms }: SuiteShowcaseProps) {
  // Pick one representative room per suite type
  const suiteTypes = ["Cozy Pink Room", "Deluxe Room", "Premium 1BHK Suite", "2BHK House"]
  
  const showcaseRooms = suiteTypes.map(type => {
    const match = rooms.find((r: any) => r.type === type)
    if (match) {
      // Count how many floors this type is available on
      const floorsForType = [...new Set(rooms.filter((r: any) => r.type === type).map((r: any) => r.floor))].sort()
      const availableFloors = floorsForType.length > 1 
        ? `Lvl ${floorsForType.join(", ")}` 
        : `Lvl ${floorsForType[0]}`
      return { ...match, availableFloors }
    }
    return null
  }).filter(Boolean)

  return (
    <section id="gallery" className="py-24 px-8 relative overflow-hidden bg-[var(--background)]">
      {/* Immersive Background Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-8xl font-heading font-black mb-6 tracking-tight"
          >
            Curated <span className="text-[var(--accent-primary)]">Collections</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="opacity-70 max-w-3xl mx-auto text-lg md:text-xl font-light italic"
          >
            Handpicked stays designed for ultimate comfort and tranquility in Tinsukia.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {showcaseRooms.map((room: any, index: number) => (
            <motion.div 
              key={room.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="transform transition-all duration-500 hover:-translate-y-4 hover:scale-[1.02] z-10 hover:z-20"
            >
              <RoomCard 
                room={room} 
                hideBookButton={true}
                availableFloors={room.availableFloors}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA to view all rooms */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="ornate-divider mb-8">
            <span>✦</span>
          </div>
          <Link href="/rooms" className="btn-primary text-lg px-12 py-4 inline-block">
            View All Rooms &amp; Book Now
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
