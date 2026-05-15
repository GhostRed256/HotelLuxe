"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, Plane, Train, Trees, Mountain } from "lucide-react"

const landmarks = [
  { name: "Tinsukia Junction", distance: "3 KM", time: "8 min", icon: Train },
  { name: "Dibrugarh Airport", distance: "42 KM", time: "55 min", icon: Plane },
  { name: "Dibru-Saikhowa N.P.", distance: "12 KM", time: "25 min", icon: Trees },
  { name: "Digboi Oil Town", distance: "35 KM", time: "45 min", icon: Mountain },
]

const highlights = [
  { label: "Founded", value: "Since 2022" },
  { label: "Assamese Soul", value: "Tradition Reimagined" },
  { label: "Properties", value: "3 Locations" },
  { label: "Connectivity", value: "Tinsukia Hub" },
]

export default function LocationShowcase() {
  return (
    <section className="py-24 px-8 relative overflow-hidden bg-[var(--background)]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left — Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--accent-primary)] mb-6 block">
              The Strategic Gateway
            </span>
            <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-8 leading-[1.1]">
              Where <span className="text-[var(--accent-primary)]">Nature</span> Meets Comfort
            </h2>
            <p className="opacity-60 font-light text-lg leading-relaxed mb-10">
              Situated in the heart of Tinsukia — the gateway to Dibru-Saikhowa National Park. 
              Our properties offer the ideal base for birdwatchers tracking the White-winged Wood Duck 
              or explorers seeking the feral horses of the Dibru valley. Just minutes from Tinsukia 
              Junction, we blend Assamese warmth with modern luxury.
            </p>

            {/* Proximity Pills */}
            <div className="flex flex-wrap gap-3">
              {landmarks.map((lm, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <lm.icon size={16} className="text-[var(--accent-primary)] opacity-60" />
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.15em] uppercase opacity-80 block">{lm.name}</span>
                    <span className="text-[10px] font-bold text-[var(--accent-primary)]">{lm.distance}</span>
                    <span className="text-[9px] opacity-30 ml-2">{lm.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-2 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
              {highlights.map((item, i) => (
                <div key={i} className="p-10 bg-[var(--background)] hover:bg-white/5 transition-colors text-center">
                  <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-30 block mb-3">{item.label}</span>
                  <span className="text-xl font-heading font-bold">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Map Hint */}
            <div className="mt-8 p-8 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-[var(--accent-primary)]/10">
                <MapPin size={28} className="text-[var(--accent-primary)]" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg mb-1">Multiple Sanctuaries</h4>
                <p className="text-sm font-light opacity-50">
                  Chaliha Nagar · Bordoloi Nagar (Lake) · Bordoloi Nagar (Income Tax)
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
