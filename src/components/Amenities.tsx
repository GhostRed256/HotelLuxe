"use client"

import { motion } from "framer-motion"
import { Heart, Music } from "lucide-react"
const amenitiesList = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
    text: "Free\nWi-Fi"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <rect x="1" y="3" width="15" height="13" /><polyline points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    text: "Free\nParking"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    text: "24×7 Check-In &\nCheck-Out"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    ),
    text: "24×7 Room\nService"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /><path d="M9 13h12" />
      </svg>
    ),
    text: "AC & Non-AC\nRooms"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M12 13v-2" /><path d="M12 9V7" /><circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
      </svg>
    ),
    text: "CCTV\nSurveillance"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <rect x="2" y="7" width="20" height="15" rx="2" /><path d="M17 21v-2" /><path d="M7 21v-2" /><path d="M12 3v4" /><path d="M8 5h8" />
      </svg>
    ),
    text: "Power\nBackup"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M12 3v18" /><path d="M3 12h18" /><path d="M12 7l-5 5 5 5" /><path d="M12 7l5 5-5 5" />
      </svg>
    ),
    text: "Daily\nHousekeeping"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M10 5.172C10 3.782 8.823 2.65 7.42 2.65c-1.402 0-2.538 1.132-2.538 2.522 0 1.39 1.136 2.522 2.538 2.522 1.403 0 2.58-1.132 2.58-2.522Z" /><path d="M19.118 5.172c0-1.39-1.136-2.522-2.538-2.522-1.403 0-2.58 1.132-2.58 2.522 0 1.391 1.136 2.522 2.538 2.522 1.403 0 2.58-1.132 2.58-2.522Z" /><path d="M10.355 12.383c0-1.39-1.136-2.523-2.538-2.523-1.403 0-2.58 1.132-2.58 2.523 0 1.39 1.136 2.522 2.538 2.522 1.403 0 2.58-1.132 2.58-2.522Z" /><path d="M19.118 12.383c0-1.39-1.136-2.523-2.538-2.523-1.403 0-2.58 1.132-2.58 2.523 0 1.39 1.136 2.522 2.538 2.522 1.403 0 2.58-1.132 2.58-2.522Z" /><path d="M14.882 19.594c0-1.39-1.136-2.522-2.538-2.522-1.403 0-2.58 1.132-2.58 2.522 0 1.39 1.136 2.522 2.538 2.522 1.403 0 2.58-1.132 2.58-2.522Z" />
      </svg>
    ),
    text: "Pet\nFriendly"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M7 16.3c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4Z" /><path d="M12 2v20" /><path d="M20 16.3c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4Z" />
      </svg>
    ),
    text: "Toiletry &\nDental Kit"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /><polygon points="10 7 15 10 10 13 10 7" />
      </svg>
    ),
    text: "Projector for\nEntertainment"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M4 11a1 1 0 0 1 1 1v1h14v-1a1 1 0 0 1 1-1 2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" /><path d="M4 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    text: "Beautiful\nAmbiance"
  }
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
              className="glass-panel p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all border border-[var(--gold-primary)]/40 shadow-[0_0_20px_rgba(184,143,84,0.1)] hover:shadow-[0_0_40px_rgba(184,143,84,0.3)] group"
            >
              <div className="mb-4 text-[var(--accent-primary)] transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(var(--accent-primary-rgb),0.5)]">
                {item.icon}
              </div>
              <p className="text-[9px] font-black tracking-[0.3em] uppercase opacity-60 group-hover:opacity-100 whitespace-pre-line leading-relaxed transition-opacity">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel p-10 flex items-center gap-8 border border-[var(--gold-primary)]/40 border-l-4 border-l-[var(--accent-primary)] shadow-[0_0_15px_rgba(184,143,84,0.15)] hover:shadow-[0_0_30px_rgba(184,143,84,0.4)]"
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
            className="glass-panel p-10 flex items-center gap-8 border border-[var(--gold-primary)]/40 border-l-4 border-l-[var(--gold-primary)] shadow-[0_0_15px_rgba(184,143,84,0.15)] hover:shadow-[0_0_30px_rgba(184,143,84,0.4)]"
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
