"use client"

import { Phone, Mail, MapPin, MessageSquare, Send, ArrowRight } from "lucide-react"
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
                  <div
                    key={i}
                    className="flex flex-col gap-4 p-6 rounded-3xl border border-white/5 bg-white/5 transition-all group/item hover:border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/5"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] group-hover/item:scale-110 transition-transform">
                        <Phone size={20} />
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`tel:+91${item.number}`}
                          className="w-10 h-10 rounded-xl bg-blue-500/10 hover:bg-blue-500 hover:text-white border border-blue-500/20 text-blue-400 flex items-center justify-center transition-all"
                          title="Call"
                        >
                          <Phone size={16} />
                        </a>
                        <a
                          href={`https://wa.me/91${item.number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white border border-[#25D366]/20 text-[#25D366] flex items-center justify-center transition-all"
                          title="WhatsApp"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </a>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold tracking-[0.1em] uppercase opacity-40 mb-1">{item.label}</span>
                      <span className="block text-lg font-black tracking-tighter">{item.formatted}</span>
                    </div>
                  </div>
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
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=staynjoy05@gmail.com"
                  target="_blank"
                  className="flex items-center gap-6 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold tracking-[0.1em] uppercase opacity-40">General Inquiry</span>
                    <span className="block font-bold">staynjoy05@gmail.com</span>
                  </div>
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=redlio8473@gmail.com"
                  target="_blank"
                  className="flex items-center gap-6 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-all">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold tracking-[0.1em] uppercase opacity-40">Direct Support</span>
                    <span className="block font-bold">redlio8473@gmail.com</span>
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

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name");
                const phone = formData.get("phone");
                const msg = formData.get("message");
                const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\n\nMessage:\n${msg}`);
                window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=staynjoy05@gmail.com&su=StayNJoy Inquiry from ${name}&body=${body}`, '_blank');
              }}
            >
              <div>
                <label className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Full Name</label>
                <input type="text" name="name" required className="form-input bg-white/5 border-white/10 focus:border-[var(--accent-primary)]" placeholder="Name" />
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Contact Number</label>
                <input type="tel" name="phone" required className="form-input bg-white/5 border-white/10 focus:border-[var(--accent-primary)]" placeholder="Phone" />
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Message Details</label>
                <textarea name="message" required className="form-input bg-white/5 border-white/10 focus:border-[var(--accent-primary)] min-h-[150px] resize-none" placeholder="Your inquiry..."></textarea>
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
