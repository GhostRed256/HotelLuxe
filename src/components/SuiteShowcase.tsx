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
    <section id="gallery" className="py-24 px-8 palace-bg min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--accent-primary)]/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--accent-primary)]/10 to-transparent pointer-events-none" />
      
      {/* Floating decorative particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[var(--accent-primary)] opacity-10 text-4xl"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          >
            {i % 3 === 0 ? "✦" : i % 3 === 1 ? "❖" : "✧"}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 relative">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-50"
          />
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-cinzel font-bold mb-6 gold-gradient-text drop-shadow-lg inline-block bg-[var(--background)] px-8 relative z-10"
          >
            Our Rooms
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="opacity-80 max-w-3xl mx-auto text-lg md:text-xl italic"
          >
            From cozy rooms to full houses — find the perfect stay for every occasion.
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
