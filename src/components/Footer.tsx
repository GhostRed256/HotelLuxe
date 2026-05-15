import { Camera, Phone, MapPin, Mail, Globe, ArrowUpRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-white pt-32 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary)]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter mb-8 leading-tight">
              StayNjoy <br />
              <span className="text-[var(--accent-primary)]">Palatial Living</span>
            </h2>
            <p className="text-white/40 font-light text-lg max-w-md leading-relaxed mb-10">
              Redefining hospitality in Tinsukia. A curated collection of sanctuaries designed for the discerning traveler, blending local heritage with modern luxury.
            </p>
            <div className="flex gap-6">
              <a 
                href="https://www.instagram.com/stayn_joy_tinsukia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500"
              >
                <Camera size={20} />
              </a>
              <a 
                href="mailto:contact@staynjoy.com" 
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Locations Column */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 mb-8">Our Sanctuaries</h4>
            <ul className="flex flex-col gap-6">
              {[
                { name: "Chaliha Nagar", desc: "Main Branch" },
                { name: "Bordoloi Nagar", desc: "Lake View" },
                { name: "Bordoloi Nagar", desc: "Income Tax" }
              ].map((loc, i) => (
                <li key={i} className="group cursor-default">
                  <div className="flex items-start gap-4">
                    <MapPin size={18} className="mt-1 text-[var(--accent-primary)] opacity-40 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <span className="block font-bold text-sm tracking-tight">{loc.name}</span>
                      <span className="block text-[10px] font-light opacity-40 uppercase tracking-widest">{loc.desc}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Contact Column */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 mb-8">Reservations</h4>
            <div className="flex flex-col gap-10">
              <div className="group">
                <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--accent-primary)] mb-2">Speak With Us</span>
                <a href="tel:7002475079" className="text-2xl font-black tracking-tighter hover:opacity-70 transition-opacity">
                  +91 70024 75079
                </a>
              </div>
              
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-[var(--accent-primary)]/30 transition-colors group">
                <p className="text-[10px] font-light opacity-50 leading-relaxed mb-4">
                  Need a custom arrangement or group booking? Reach out to our concierge team.
                </p>
                <a href="tel:7002475079" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--accent-primary)] group-hover:gap-4 transition-all">
                  Request Concierge <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase text-white/20">
            <span>© 2026 StayNjoy Palace</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>Tinsukia, Assam</span>
          </div>
          
          <div className="flex gap-10 text-[10px] font-bold tracking-[0.2em] uppercase">
            <a href="#" className="text-white/40 hover:text-[var(--accent-primary)] transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/40 hover:text-[var(--accent-primary)] transition-colors">Terms of Stay</a>
            <a href="/login" className="text-white/40 hover:text-[var(--accent-primary)] transition-colors">Staff Login</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
