"use client"

import { motion } from "framer-motion"
import { Wifi, Car, Clock, Utensils, Wind, Cctv, Zap, Brush, PawPrint, Droplets, MonitorPlay, Sofa, Heart, Music } from "lucide-react"

const amenitiesList = [
  { icon: <Wifi size={32} />, text: "Free\nWi-Fi" },
  { icon: <Car size={32} />, text: "Free\nParking" },
  { icon: <Clock size={32} />, text: "24×7 Check-In &\nCheck-Out" },
  { icon: <Utensils size={32} />, text: "24×7 Room\nService" },
  { icon: <Wind size={32} />, text: "AC & Non-AC\nRooms" },
  { icon: <Cctv size={32} />, text: "CCTV\nSurveillance" },
  { icon: <Zap size={32} />, text: "Power\nBackup" },
  { icon: <Brush size={32} />, text: "Daily\nHousekeeping" },
  { icon: <PawPrint size={32} />, text: "Pet\nFriendly" },
  { icon: <Droplets size={32} />, text: "Toiletry &\nDental Kit" },
  { icon: <MonitorPlay size={32} />, text: "Projector for\nEntertainment" },
  { icon: <Sofa size={32} />, text: "Beautiful\nAmbiance" }
]

export default function Amenities() {
  return (
    <section className="py-24 px-8 relative overflow-hidden bg-[var(--background)]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-heading font-black mb-4 tracking-tight"
          >
            Exceptional <span className="text-[var(--accent-primary)]">Services</span>
          </motion.h2>
          <p className="opacity-60 font-light italic text-lg">Every detail curated for your royalty.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-16">
          {amenitiesList.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all border-white/5"
            >
              <div className="mb-4 text-[var(--accent-primary)] drop-shadow-lg">
                {item.icon}
              </div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70 whitespace-pre-line leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-panel p-10 flex items-center gap-8 border-l-4 border-l-[var(--accent-primary)]"
          >
            <div className="text-[var(--accent-primary)]">
              <Heart size={48} strokeWidth={1} />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold mb-2">Couple Haven</h3>
              <p className="text-sm font-light opacity-60">Discrete, safe, and curated for moments of intimacy.</p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-panel p-10 flex items-center gap-8 border-l-4 border-l-[var(--gold-primary)]"
          >
            <div className="text-[var(--gold-primary)]">
              <Music size={48} strokeWidth={1} />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold mb-2">Celebration Suite</h3>
              <p className="text-sm font-light opacity-60">Perfectly equipped for your grand milestones and joyous parties.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
