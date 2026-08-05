import { Camera, MapPin, Mail, ArrowUpRight, Heart, Music } from "lucide-react"
import Logo from "./Logo"

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)] pt-32 pb-12 border-t border-[var(--border-color)] relative overflow-hidden">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary)]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <Logo className="h-24 md:h-32 -ml-4" />
            </div>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[var(--accent-primary)] mb-8">
              A Legacy of Palatial Warmth
            </p>
            <p className="opacity-60 font-light text-lg max-w-md leading-relaxed mb-10">
              Discover curated living amidst the emerald tea estates of Upper Assam. A soulful sanctuary designed for the modern traveler.
            </p>
            <div className="flex gap-6">
              <a
                href="https://www.instagram.com/stayn_joy_tinsukia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page"
                className="w-12 h-12 rounded-full border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-500"
              >
                <Camera size={20} />
              </a>
              <a
                href="https://wa.me/919181042005"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                className="w-12 h-12 rounded-full border border-[var(--border-color)] flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all duration-500"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=staynjoy05@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Send us an email"
                className="w-12 h-12 rounded-full border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-500"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Locations Column */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mb-8 text-[var(--accent-primary)]">Our Sanctuaries</h4>
            <ul className="flex flex-col gap-6">
              {[
                { name: "Chaliha Nagar", desc: "Main Branch", map: "https://www.google.com/maps/search/?api=1&query=StayNJoy+Homestay+Chaliha+Nagar+Tinsukia" },
                { name: "Bordoloi Nagar", desc: "Lake View", map: "https://www.google.com/maps/search/?api=1&query=StayNJoy+Homestay+Bordoloi+Nagar+Tinsukia" },
                { name: "Bordoloi Nagar", desc: "Income Tax", map: "https://www.google.com/maps/search/?api=1&query=StayNJoy+Homestay+Income+Tax+Office+Tinsukia" }
              ].map((loc, i) => (
                <li key={i} className="group flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <MapPin size={18} className="mt-1 text-[var(--accent-primary)] opacity-40 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <span className="block font-bold text-sm tracking-tight">{loc.name}</span>
                      <span className="block text-[10px] font-light opacity-40 uppercase tracking-widest">{loc.desc}</span>
                    </div>
                  </div>
                  <a
                    href={loc.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${loc.name} (${loc.desc}) in Google Maps`}
                    className="p-2 rounded-full bg-[var(--accent-primary)]/5 border border-[var(--gold-primary)]/20 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all shadow-sm"
                    title="Open in Maps"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Contact Column */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mb-8 text-[var(--accent-primary)]">Reservations</h4>
            <div className="flex flex-col gap-10">
              <div className="group">
                <span className="block text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 mb-3">Speak With Us</span>
                <div className="flex flex-col gap-2">
                  <a href="tel:7002475079" className="text-xl font-black tracking-tighter hover:text-[var(--accent-primary)] transition-colors">
                    +91 70024 75079
                  </a>
                  <a href="tel:8133819414" className="text-xl font-black tracking-tighter hover:text-[var(--accent-primary)] transition-colors">
                    +91 81338 19414
                  </a>
                  <a href="tel:9181042005" className="text-xl font-black tracking-tighter hover:text-[var(--accent-primary)] transition-colors">
                    +91 91810 42005
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--accent-primary)]/5 border border-[var(--border-color)] hover:border-[var(--accent-primary)]/30 transition-colors group">
                <p className="text-[10px] font-light opacity-60 leading-relaxed mb-4">
                  Need a custom arrangement? Our concierge is ready to assist.
                </p>
                <a href="tel:7002475079" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--accent-primary)] group-hover:gap-4 transition-all">
                  Request Concierge <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
            <span>© 2026 StayNJoy Homestay</span>
            <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)]/20" />
            <span>Tinsukia, Assam</span>
            <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)]/20" />
            <span className="text-[var(--accent-primary)] font-bold">আপোনালৈ স্বাগতম</span>
          </div>

          <div className="flex gap-10 text-[10px] font-bold tracking-[0.2em] uppercase">
            <a href="https://bio-portfolio-seven.vercel.app/" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:text-[var(--accent-primary)] transition-colors">
              Developed by <span className="text-white">Redlio</span>
            </a>
            <a href="/admin/login" className="opacity-40 hover:text-[var(--accent-primary)] transition-colors">Staff Login</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
