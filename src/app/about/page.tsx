"use client"

import { useState } from "react"
import { Phone, ShieldCheck, MapPin } from "lucide-react"

export default function AboutPage() {
  const [selectedContact, setSelectedContact] = useState("9181042005")
  const contactNumbers = ["9181042005", "8133819414", "7002475079"]

  return (
    <div className="max-w-4xl mx-auto py-20 px-8">
      <div className="glass-panel p-12 text-center">
        <h1 className="text-4xl font-bold mb-6">
          About <span className="text-[var(--accent-primary)]">StayNJoy</span> Homestay
        </h1>
        {/* ... existing content ... */}
        <p className="text-lg opacity-80 leading-relaxed mb-8">
          Welcome to StayNJoy Homestay — your home away from home in the heart of Tinsukia, Assam.
          We offer cozy, well-maintained rooms and homes with all modern amenities for solo travelers,
          couples, families, and groups.
        </p>
        <p className="text-lg opacity-80 leading-relaxed mb-8">
          Whether you&apos;re visiting for work, a weekend getaway, or hosting a house party,
          our spaces are designed to make your stay comfortable and joyful.
          From projector setups to private kitchens, we&apos;ve got everything covered.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-left">
          <div className="p-8 border border-[var(--gold-primary)]/20 rounded-2xl bg-[var(--accent-primary)]/5 backdrop-blur-sm flex items-start gap-6 group hover:bg-[var(--accent-primary)]/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--gold-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3v18" /><path d="M12.5 3v18" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-black mb-2 tracking-tight">Cozy Rooms</h3>
              <p className="opacity-60 text-sm font-light">From ₹1399/night — perfect for solo travelers and backpackers.</p>
            </div>
          </div>
          <div className="p-8 border border-[var(--gold-primary)]/20 rounded-2xl bg-[var(--accent-primary)]/5 backdrop-blur-sm flex items-start gap-6 group hover:bg-[var(--accent-primary)]/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--gold-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-black mb-2 tracking-tight">Couple Friendly</h3>
              <p className="opacity-60 text-sm font-light">Deluxe rooms with attached bathroom and projector setup from ₹1799/night.</p>
            </div>
          </div>
          <div className="p-8 border border-[var(--gold-primary)]/20 rounded-2xl bg-[var(--accent-primary)]/5 backdrop-blur-sm flex items-start gap-6 group hover:bg-[var(--accent-primary)]/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--gold-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /><path d="M3 9h18" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-black mb-2 tracking-tight">Family Suites</h3>
              <p className="opacity-60 text-sm font-light">Premium 1BHK with private living room, kitchen & bathroom from ₹2200/night.</p>
            </div>
          </div>
          <div className="p-8 border border-[var(--gold-primary)]/20 rounded-2xl bg-[var(--accent-primary)]/5 backdrop-blur-sm flex items-start gap-6 group hover:bg-[var(--accent-primary)]/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--gold-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-black mb-2 tracking-tight">Full Houses</h3>
              <p className="opacity-60 text-sm font-light">2BHK houses for birthdays & parties — from ₹2700 to ₹4400/night.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 glass-panel p-8 text-left">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ShieldCheck className="text-[var(--accent-primary)]" size={24} />
            <h3 className="text-xl font-black uppercase tracking-widest text-center">Amenities Included</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
                  </svg>
                ), label: "Free WiFi"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /><polygon points="10 7 15 10 10 13 10 7" />
                  </svg>
                ), label: "Projector Setup"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path d="M12 3v18" /><path d="M3 12h18" /><path d="M12 7l-5 5 5 5" /><path d="M12 7l5 5-5 5" />
                  </svg>
                ), label: "Clean Linen"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <rect x="1" y="3" width="15" height="13" /><polyline points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                ), label: "Free Parking"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path d="M7 16.3c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4Z" /><path d="M12 2v20" /><path d="M20 16.3c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4Z" />
                  </svg>
                ), label: "24×7 Water"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path d="M4 11a1 1 0 0 1 1 1v1h14v-1a1 1-0 0 1 1-1 2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" /><path d="M4 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                  </svg>
                ), label: "Home Comfort"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                  </svg>
                ), label: "Private Kitchen"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /><path d="M9 13h12" />
                  </svg>
                ), label: "AC Rooms"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <circle cx="12" cy="12" r="10" /><path d="M8 11V7a4 4 0 1 1 8 0v4" /><rect x="5" y="11" width="14" height="10" rx="2" />
                  </svg>
                ), label: "Secure Entry"
              },
            ].map(({ icon, label }) => (
              <div key={label} className="p-6 rounded-2xl border border-[var(--gold-primary)]/20 bg-[var(--accent-primary)]/5 hover:bg-[var(--accent-primary)]/10 transition-all group flex flex-col items-center justify-center">
                <div className="text-[var(--accent-primary)] mb-3 group-hover:scale-110 transition-transform">{icon}</div>
                <div className="font-black text-[9px] uppercase tracking-widest group-hover:text-[var(--accent-primary)] transition-colors opacity-70 group-hover:opacity-100">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 p-8 border border-white/5 bg-white/5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left max-w-2xl mx-auto relative z-50">
          <div className="relative z-50 flex-1">
            <h4 className="font-bold text-lg mb-1">Direct Booking Concierge</h4>
            <p className="text-xs opacity-60">Reach us instantly on WhatsApp or phone for custom arrangements & special booking discounts.</p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto relative z-50">
            {/* Number Selector */}
            <div className="flex flex-wrap justify-center md:justify-end gap-2 mb-2">
              {contactNumbers.map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedContact(num)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 border ${selectedContact === num
                    ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/20"
                    : "bg-white/5 text-[var(--foreground)]/50 border-white/10 hover:bg-white/10"
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 w-full relative z-50">
              <a
                href={`https://wa.me/91${selectedContact}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white border border-[#25D366]/20 px-8 py-4 rounded-xl transition-all text-xs font-bold text-[#25D366] active:scale-95 shadow-lg relative z-50 select-none"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                WhatsApp Us
              </a>
              <a
                href={`tel:+91${selectedContact}`}
                className="flex items-center justify-center gap-3 bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)] hover:text-white border border-[var(--accent-primary)]/20 px-8 py-4 rounded-xl transition-all text-xs font-bold text-[var(--accent-primary)] active:scale-95 shadow-lg relative z-50 select-none"
              >
                <Phone size={18} />
                Call Now
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 opacity-70 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <MapPin size={12} className="text-[var(--accent-primary)]" />
          Chaliha Nagar, Bordoloi Nagar Near Lake, Tinsukia, Assam
        </div>
      </div>
    </div>
  )
}
