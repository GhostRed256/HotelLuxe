import { motion } from "framer-motion"
import { MapPin, Navigation, Compass, Clock } from "lucide-react"

export default function MapSection() {
  return (
    <section className="py-24 px-4 bg-[var(--background)] relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
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
            Finding <span className="text-[var(--accent-primary)]">Your Sanctuary</span>
          </h2>
          <p className="opacity-50 font-light text-lg max-w-2xl mx-auto italic">
            Located in the vibrant heart of Tinsukia, where the tea estates meet the sky. 
            Follow the scent of emerald leaves to find us.
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
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113426.4716496468!2d95.27430159726562!3d27.50296760000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37409949987a0c8b%3A0xc3485d45d3e09841!2sStayNjoy%20Tinsukia!5e0!3m2!1sen!2sin!4v1715844000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(0.5) contrast(1.1) invert(0)' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="dark:invert-[0.9] dark:hue-rotate-[180deg]"
            />
            
            {/* Interactive Floaties */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-4">
              <a 
                href="https://maps.google.com" 
                target="_blank" 
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
                  <h3 className="font-heading font-bold text-xl tracking-tight">StayNjoy</h3>
               </div>
               <p className="text-xs font-light opacity-60 leading-relaxed mb-4">
                 Chaliha Nagar, Near Thana Chariali, Tinsukia, Assam 786125
               </p>
               <div className="flex items-center gap-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[var(--gold-primary)]">
                 <span className="flex items-center gap-1"><Clock size={12} /> 24/7 Concierge</span>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
