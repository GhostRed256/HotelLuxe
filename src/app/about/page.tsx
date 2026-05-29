"use client"

import { useState } from "react"
import { Phone } from "lucide-react"

export default function AboutPage() {
  const [selectedContact, setSelectedContact] = useState("9181042005")
  const contactNumbers = ["9181042005", "8133819414", "7002475079"]

  return (
    <div className="max-w-4xl mx-auto py-20 px-8">
      <div className="glass-panel p-12 text-center">
        <h1 className="text-4xl font-bold mb-6">
          About <span className="text-[var(--accent-primary)]">StayNjoy</span> Homestay
        </h1>
        {/* ... existing content ... */}
        <p className="text-lg opacity-80 leading-relaxed mb-8">
          Welcome to StayNjoy Homestay — your home away from home in the heart of Tinsukia, Assam.
          We offer cozy, well-maintained rooms and homes with all modern amenities for solo travelers,
          couples, families, and groups.
        </p>
        <p className="text-lg opacity-80 leading-relaxed mb-8">
          Whether you&apos;re visiting for work, a weekend getaway, or hosting a house party,
          our spaces are designed to make your stay comfortable and joyful.
          From projector setups to private kitchens, we&apos;ve got everything covered.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-left">
          <div className="p-6 border border-[var(--accent-primary)] rounded-lg">
            <h3 className="text-xl font-bold mb-2">🌸 Cozy Rooms</h3>
            <p className="opacity-70">From ₹1399/night — perfect for solo travelers and backpackers.</p>
          </div>
          <div className="p-6 border border-[var(--accent-primary)] rounded-lg">
            <h3 className="text-xl font-bold mb-2">💖 Couple Friendly</h3>
            <p className="opacity-70">Deluxe rooms with attached bathroom and projector setup from ₹1799/night.</p>
          </div>
          <div className="p-6 border border-[var(--accent-primary)] rounded-lg">
            <h3 className="text-xl font-bold mb-2">🏡 Family Suites</h3>
            <p className="opacity-70">Premium 1BHK with private living room, kitchen & bathroom from ₹2200/night.</p>
          </div>
          <div className="p-6 border border-[var(--accent-primary)] rounded-lg">
            <h3 className="text-xl font-bold mb-2">🏘️ Full Houses</h3>
            <p className="opacity-70">2BHK houses for birthdays & parties — from ₹2700 to ₹4400/night.</p>
          </div>
        </div>

        <div className="mt-12 glass-panel p-8 text-left">
          <h3 className="text-xl font-bold mb-4 text-center">✅ Amenities Included</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <span className="p-3 border border-[var(--border-color)] rounded-lg">Free WiFi</span>
            <span className="p-3 border border-[var(--border-color)] rounded-lg">Projector Setup</span>
            <span className="p-3 border border-[var(--border-color)] rounded-lg">Clean Linen</span>
            <span className="p-3 border border-[var(--border-color)] rounded-lg">Parking</span>
            <span className="p-3 border border-[var(--border-color)] rounded-lg">24×7 Water</span>
            <span className="p-3 border border-[var(--border-color)] rounded-lg">Home Comfort</span>
          </div>
        </div>

        <div className="mt-12 p-8 border border-white/5 bg-white/5 rounded-2xl flex flex-col items-center gap-8 text-center max-w-2xl mx-auto relative z-50">
          <div className="relative z-50">
            <h4 className="font-bold text-lg mb-1">Direct Booking Concierge</h4>
            <p className="text-xs opacity-60">Reach us instantly on WhatsApp or phone for custom arrangements & special booking discounts.</p>
          </div>

          {/* Number Selector */}
          <div className="flex flex-wrap justify-center gap-2 relative z-50">
            {contactNumbers.map(num => (
              <button
                key={num}
                onClick={() => setSelectedContact(num)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${selectedContact === num
                    ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/20"
                    : "bg-white/5 text-[var(--foreground)]/50 border-white/10 hover:bg-white/10"
                  }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full relative z-50">
            <a
              href={`https://wa.me/91${selectedContact}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white border border-[#25D366]/20 px-8 py-4 rounded-xl transition-all text-xs font-bold text-[#25D366] active:scale-95 shadow-lg relative z-50 order-1 md:order-none"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              WhatsApp Us ({selectedContact})
            </a>
            <a
              href={`tel:+91${selectedContact}`}
              className="flex-1 flex items-center justify-center gap-3 bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)] hover:text-white border border-[var(--accent-primary)]/20 px-8 py-4 rounded-xl transition-all text-xs font-bold text-[var(--accent-primary)] active:scale-95 shadow-lg relative z-50 order-2 md:order-none"
            >
              <Phone size={20} />
              Call Now ({selectedContact})
            </a>
          </div>
        </div>

        <div className="mt-8 opacity-70 text-sm">
          📍 Chaliha Nagar, Bordoloi Nagar Near Lake, Tinsukia, Assam
        </div>
      </div>
    </div>
  )
}
