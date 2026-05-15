import { Camera, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[var(--background)] text-[var(--foreground)] mt-auto border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
          {/* Left: Locations */}
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-black mb-10 tracking-tight">Our <span className="text-[var(--accent-primary)]">Sanctuaries</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Chaliha Nagar", "Bordoloi Nagar (Near Lake)", "Bordoloi Nagar (Income Tax)"].map((loc, idx) => (
                <div key={idx} className="glass-panel p-6 border-white/5 flex items-center gap-4">
                  <MapPin size={20} className="text-[var(--accent-primary)] opacity-60" />
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">{loc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Connect */}
          <div className="flex flex-col justify-center">
            <div className="glass-panel p-10 border-white/10 bg-white/5 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">
                <a 
                  href="https://www.instagram.com/stayn_joy_tinsukia" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-6 group"
                >
                  <div className="p-4 rounded-3xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-2xl group-hover:scale-110 transition-transform">
                    <Camera size={32} className="text-white" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold tracking-[0.3em] uppercase opacity-50 mb-1">Follow Us</span>
                    <span className="text-xl font-bold tracking-tight">@stayn_joy_tinsukia</span>
                  </div>
                </a>

                <div className="hidden md:block w-[1px] h-12 bg-white/10"></div>

                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-3xl bg-[var(--accent-primary)] shadow-2xl">
                    <Phone size={32} className="text-white" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold tracking-[0.3em] uppercase opacity-50 mb-1">Reservations</span>
                    <div className="flex flex-col font-bold tracking-tight text-lg">
                      <a href="tel:7002475079" className="hover:text-[var(--accent-primary)] transition-colors">7002475079</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 text-[10px] font-bold tracking-[0.3em] uppercase">
          <p>© 2026 StayNjoy Palace. Crafted for Excellence.</p>
          <div className="flex gap-10">
             <a href="#" className="hover:text-[var(--accent-primary)]">Privacy</a>
             <a href="#" className="hover:text-[var(--accent-primary)]">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
