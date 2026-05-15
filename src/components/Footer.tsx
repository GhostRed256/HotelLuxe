import { Camera, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "#0A0307",
      color: "white",
      marginTop: "auto",
      borderTop: "2px solid var(--gold-primary)"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "3rem 2rem",
      }}>
        {/* Multiple Locations Section */}
        <div className="text-center mb-8 flex items-center justify-center gap-4">
          <div className="h-[1px] bg-[var(--gold-primary)] w-16 opacity-50"></div>
          <h2 className="text-xl tracking-widest font-cinzel uppercase" style={{ color: "var(--gold-primary)" }}>
            Multiple Locations
          </h2>
          <div className="h-[1px] bg-[var(--gold-primary)] w-16 opacity-50"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {["Chaliha Nagar", "Bordoloi Nagar\n(Near Lake)", "Bordoloi Nagar\n(Near Income Tax Office)"].map((loc, idx) => (
            <div 
              key={idx}
              className="text-center p-4 rounded-xl flex flex-col items-center justify-center"
              style={{ border: "1px solid var(--gold-primary)", backgroundColor: "rgba(184, 143, 84, 0.05)" }}
            >
              <MapPin size={28} style={{ color: "var(--accent-primary)", marginBottom: "0.5rem" }} />
              <p className="text-sm font-semibold tracking-wider uppercase whitespace-pre-line text-[var(--gold-primary)]">
                {loc}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Links */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-6 rounded-xl" style={{ border: "1px solid var(--gold-primary)", backgroundColor: "rgba(184, 143, 84, 0.05)" }}>
          <a href="https://www.instagram.com/stayn_joy_tinsukia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Camera size={32} style={{ color: "var(--accent-primary)" }} />
            <span className="text-lg tracking-wider" style={{ color: "white" }}>@stayn_joy_tinsukia</span>
          </a>
          
          <div className="w-[1px] h-12 bg-[var(--gold-primary)] opacity-50 hidden md:block"></div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-full w-12 h-12" style={{ backgroundColor: "var(--accent-primary)" }}>
              <Phone size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm tracking-widest uppercase mb-1" style={{ color: "var(--accent-primary)" }}>Contact</span>
              <div className="flex flex-col font-mono text-sm tracking-wider" style={{ color: "white" }}>
                <a href="tel:7002475079" className="hover:text-[var(--gold-primary)]">7002475079</a>
                <a href="tel:8133819414" className="hover:text-[var(--gold-primary)]">8133819414</a>
                <a href="tel:9181042005" className="hover:text-[var(--gold-primary)]">9181042005</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{
        backgroundColor: "var(--accent-primary)",
        color: "white",
        textAlign: "center",
        padding: "1rem",
        fontSize: "1rem",
        fontWeight: "bold",
        letterSpacing: "2px",
        textTransform: "uppercase"
      }}>
        Book Your Stay. Experience Comfort & Luxury.
      </div>
    </footer>
  )
}
