"use client"

import { Phone, Mail, MapPin, Clock, MessageSquare, Send, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactPage() {
  const contactNumbers = [
    { label: "Primary Concierge", number: "7002475079", formatted: "+91 70024 75079" },
    { label: "Front Desk", number: "8133819414", formatted: "+91 81338 19414" },
    { label: "Guest Relations", number: "9181042005", formatted: "+91 91810 42005" }
  ]

  return (
    <div className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-heading font-black tracking-tight mb-6"
          >
            Connect With <span className="text-[var(--accent-primary)]">Us</span>
          </motion.h1>
          <p className="opacity-40 font-light italic text-xl max-w-2xl mx-auto">
            Our concierge team is at your service 24/7. Reach out through any of our channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Phone Numbers - HIGH VISIBILITY */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-10 md:col-span-2 border-white/10 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <Phone size={120} />
              </div>
              <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[var(--accent-primary)] mb-10">Instant Reservations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {contactNumbers.map((item, i) => (
                  <a 
                    key={i}
                    href={`tel:${item.number}`}
                    className="flex flex-col gap-4 p-6 rounded-3xl border border-white/5 hover:border-[var(--accent-primary)]/30 bg-white/5 hover:bg-[var(--accent-primary)]/5 transition-all group/item"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] group-hover/item:scale-110 transition-transform">
                      <Phone size={20} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold tracking-[0.1em] uppercase opacity-40 mb-1">{item.label}</span>
                      <span className="block text-lg font-black tracking-tighter">{item.formatted}</span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Email & Support */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-10 border-white/10"
            >
              <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[var(--accent-primary)] mb-8 text-center md:text-left">Electronic Mail</h3>
              <div className="flex flex-col gap-6">
                <a href="mailto:contact@staynjoy.com" className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold tracking-[0.1em] uppercase opacity-40">General Inquiry</span>
                    <span className="block font-bold">contact@staynjoy.com</span>
                  </div>
                </a>
                <a href="mailto:GhostRed256@gmail.com" className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-all">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold tracking-[0.1em] uppercase opacity-40">Direct Support</span>
                    <span className="block font-bold">GhostRed256@gmail.com</span>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Location Address */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-10 border-white/10"
            >
              <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[var(--accent-primary)] mb-8 text-center md:text-left">Our Presence</h3>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex flex-shrink-0 items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold tracking-[0.1em] uppercase opacity-40">Main Sanctuary</span>
                  <p className="font-medium text-sm leading-relaxed">
                    Chaliha Nagar, Bordoloi Nagar,<br />
                    Near Lake side, Tinsukia, Assam<br />
                    India - 786125
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-10 border-white/10 shadow-2xl bg-[var(--accent-primary)]/5"
          >
            <h2 className="text-3xl font-heading font-black mb-2">Send <span className="text-[var(--accent-primary)]">Message</span></h2>
            <p className="text-xs opacity-40 font-light italic mb-10">We usually respond within 15 minutes.</p>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Your message has been received by our concierge."); }}>
              <div>
                <label className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Full Name</label>
                <input type="text" required className="form-input bg-white/5 border-white/10 focus:border-[var(--accent-primary)]" placeholder="Name" />
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Contact Number</label>
                <input type="tel" required className="form-input bg-white/5 border-white/10 focus:border-[var(--accent-primary)]" placeholder="Phone" />
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Message Details</label>
                <textarea required className="form-input bg-white/5 border-white/10 focus:border-[var(--accent-primary)] min-h-[150px] resize-none" placeholder="Your inquiry..."></textarea>
              </div>
              <button type="submit" className="btn-primary w-full !py-4 flex items-center gap-3 group">
                <Send size={16} />
                <span>Dispatch Message</span>
                <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
