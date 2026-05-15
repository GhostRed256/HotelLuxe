import { Camera, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] text-[var(--foreground)] mt-auto border-t-2 border-[var(--gold-primary)] relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--gold-primary)]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Multiple Locations Section */}
        <div className="text-center mb-12 flex items-center justify-center gap-4">
          <div className="h-[1px] bg-[var(--gold-primary)] w-16 opacity-50"></div>
          <h2 className="text-xl md:text-2xl tracking-widest font-cinzel font-bold uppercase text-[var(--gold-primary)]">
            Our Locations
          </h2>
          <div className="h-[1px] bg-[var(--gold-primary)] w-16 opacity-50"></div>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {["Chaliha Nagar", "Bordoloi Nagar\n(Near Lake)", "Bordoloi Nagar\n(Near Income Tax Office)"].map((loc, idx) => (
            <div 
              key={idx}
              className="text-center p-6 glass-panel flex flex-col items-center justify-center group hover:border-[var(--accent-primary)] transition-colors"
              style={{ backgroundColor: "var(--input-bg)" }}
            >
              <MapPin size={32} className="text-[var(--accent-primary)] mb-4 transform group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold tracking-widest uppercase whitespace-pre-line text-[var(--foreground)]">
                {loc}
              </p>
            </div>
          ))}
        </div>

        {/* Contact & Social Banner (The Instagram Banner) */}
        <div className="glass-panel p-8 md:p-12 border-2 border-[var(--gold-primary)]/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 to-[var(--gold-primary)]/5 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 relative z-10">
            <a 
              href="https://www.instagram.com/stayn_joy_tinsukia" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex flex-col items-center gap-4 group"
            >
              <div className="p-4 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg group-hover:scale-110 transition-transform">
                <Camera size={32} className="text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold tracking-wider text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors">
                @stayn_joy_tinsukia
              </span>
            </a>
            
            <div className="w-[1px] h-24 bg-[var(--gold-primary)] opacity-30 hidden md:block"></div>
            
            <div className="flex items-center gap-6">
              <div className="p-5 rounded-2xl bg-[var(--accent-primary)] shadow-lg animate-float">
                <Phone size={28} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs tracking-[0.3em] uppercase font-bold text-[var(--accent-primary)] mb-2">Reservations</span>
                <div className="flex flex-col font-cinzel text-lg font-bold tracking-widest text-[var(--foreground)]">
                  <a href="tel:7002475079" className="hover:text-[var(--accent-primary)] transition-colors">7002475079</a>
                  <a href="tel:8133819414" className="hover:text-[var(--accent-primary)] transition-colors">8133819414</a>
                  <a href="tel:9181042005" className="hover:text-[var(--accent-primary)] transition-colors">9181042005</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[var(--accent-primary)] text-white text-center py-4 font-cinzel font-bold tracking-[0.2em] text-sm md:text-base uppercase">
        Book Your Stay. Experience Comfort & Luxury.
      </div>
    </footer>
  )
}
