"use client"
 
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Navigation, Compass, Clock } from "lucide-react"

export default function MapSection() {
  const [activeLocation, setActiveLocation] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const locations = [
    {
      name: "Chaliha Nagar",
      desc: "Our Main Branch - Near Thana Chariali",
      address: "Chaliha Nagar, Tinsukia, Assam 786125",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.0681345479633!2d95.3616944!3d27.4965556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDI5JzQ3LjYiTiA5NcKwMjEnNDIuMSJF!5e0!3m2!1sen!2sin!4v1715785000000!5m2!1sen!2sin",
      navUrl: "https://maps.app.goo.gl/hRp5v7fiHNQ2TuYa8",
      icon: MapPin
    },
    {
      name: "Bordoloi Nagar (Lake)",
      desc: "Serene views by the Lake side",
      address: "Bordoloi Nagar, near Lake, Tinsukia, Assam 786125",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.0681345479633!2d95.3541111!3d27.5041389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDMwJzE0LjkiTiA5NcKwMjEnMTQuOCJF!5e0!3m2!1sen!2sin!4v1715785000000!5m2!1sen!2sin",
      navUrl: "https://maps.app.goo.gl/JwLYU1VHeYQ6onZY8",
      icon: Compass
    },
    {
      name: "Bordoloi Nagar (Income Tax)",
      desc: "Strategic location near Income Tax office",
      address: "Ramdhenu Path, Sector 3, Bordoloi Nagar, Tinsukia, Assam 786126",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.0681345479633!2d95.35928!3d27.50293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x373f6ba9dc8fe061%3A0x5d6e4e8877d4991c!2sRamdhenu%20Path%2C%20Sector%203%2C%20Bordoloi%20Nagar%2C%20Tinsukia%2C%20Assam%20786126!5e0!3m2!1sen!2sin!4v1715785000000!5m2!1sen!2sin",
      navUrl: "https://maps.app.goo.gl/syysA9TrnmfZ1drk7",
      icon: Navigation
    }
  ]

  // Auto-slide logic
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setActiveLocation((prev) => (prev + 1) % locations.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [isPaused, locations.length])

  // Listen for custom event from Footer
  useEffect(() => {
    const handleLocationChange = (e: any) => {
      const idx = e.detail?.index
      if (typeof idx === 'number') {
        setActiveLocation(idx)
        setIsPaused(true) // Pause auto-slide if user manually selected
      }
    }
    window.addEventListener('map-change-location', handleLocationChange)
    return () => window.removeEventListener('map-change-location', handleLocationChange)
  }, [])

  // Handle initial location from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const locParam = params.get('loc')
    if (locParam !== null) {
      const idx = parseInt(locParam)
      if (!isNaN(idx) && idx >= 0 && idx < locations.length) {
        setActiveLocation(idx)
        setIsPaused(true)
      }
  }, [locations.length])

  return (
    <section id="map-section" className="py-24 px-4 bg-[var(--background)] relative">
      <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--gold-primary)]/20 bg-[var(--gold-primary)]/5 mb-6"
          >
            <Compass size={14} className="text-[var(--gold-primary)]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--gold-primary)]">Navigate to Paradise</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-7xl font-heading font-black tracking-tighter mb-6">
            Finding <span className="text-[var(--gold-primary)]">Your</span> <span className="text-[var(--accent-primary)]">Sanctuary</span>
          </h2>
          <p className="opacity-50 font-light text-lg max-w-2xl mx-auto italic">
            Located in the vibrant heart of Tinsukia. 
            Select a branch below to view its location on the map.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative group"
        >
          {/* Ornate Gold Frame */}
          <div className="absolute -inset-4 border border-[var(--gold-primary)]/10 rounded-[2.5rem] pointer-events-none" />
          <div className="absolute -inset-1 border-2 border-[var(--gold-primary)]/20 rounded-[2rem] pointer-events-none" />
          
          {/* Map Container */}
          <div className="relative h-[500px] md:h-[600px] w-full rounded-[1.8rem] overflow-hidden shadow-2xl glass-panel">
            <AnimatePresence mode="wait">
              <motion.iframe
                key={activeLocation}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={locations[activeLocation].mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.5) contrast(1.1) invert(0)' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="dark:invert-[0.9] dark:hue-rotate-[180deg]"
              />
            </AnimatePresence>
            
            {/* Interactive Floaties */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-4">
              <a 
                href={locations[activeLocation].navUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary !py-4 !px-8 flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            </div>

            {/* Location Label Overlay */}
            <div className="absolute top-8 left-8 p-6 glass-panel border border-white/10 max-w-xs backdrop-blur-xl">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
                    <MapPin className="text-[var(--accent-primary)]" size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-xl tracking-tight">{locations[activeLocation].name}</h3>
               </div>
               <p className="text-xs font-light opacity-60 leading-relaxed mb-4">
                 {locations[activeLocation].address}
               </p>
               <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                  <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--accent-primary)] mb-1">
                    <Clock size={12} /> 24/7 Concierge
                  </span>
                  <a href="tel:7002475079" className="text-sm font-bold hover:text-[var(--accent-primary)] transition-colors tracking-tight">+91 70024 75079</a>
                  <a href="tel:8133819414" className="text-sm font-bold hover:text-[var(--accent-primary)] transition-colors tracking-tight">+91 81338 19414</a>
                  <a href="tel:9181042005" className="text-sm font-bold hover:text-[var(--accent-primary)] transition-colors tracking-tight">+91 91810 42005</a>
               </div>
            </div>
          </div>

          {/* 3 Location Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {locations.map((loc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  setActiveLocation(i)
                  setIsPaused(true)
                }}
                className={`group p-8 rounded-[2rem] border cursor-pointer transition-all duration-500 ${
                  activeLocation === i 
                  ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] shadow-lg scale-[1.02]" 
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                  activeLocation === i ? "bg-[var(--accent-primary)] text-white" : "bg-white/5 text-[var(--accent-primary)]"
                }`}>
                  <loc.icon size={24} />
                </div>
                <h4 className="font-heading font-bold text-xl mb-2">{loc.name}</h4>
                <p className="text-sm font-light opacity-40 mb-6 leading-relaxed">{loc.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--gold-primary)]">
                  View on Map <Navigation size={12} className={activeLocation === i ? "translate-x-1 -translate-y-1" : ""} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
