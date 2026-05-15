"use client"

import { Wifi, Car, Clock, Utensils, Wind, Cctv, Zap, Brush, PawPrint, Droplets, MonitorPlay, Sofa, Heart, Music } from "lucide-react"

const amenitiesList = [
  { icon: <Wifi size={32} />, text: "Free\nWi-Fi" },
  { icon: <Car size={32} />, text: "Free\nParking" },
  { icon: <Clock size={32} />, text: "24×7 Check-In &\nCheck-Out" },
  { icon: <Utensils size={32} />, text: "24×7 Room\nService" },
  { icon: <Wind size={32} />, text: "AC & Non-AC\nRooms" },
  { icon: <Cctv size={32} />, text: "CCTV\nSurveillance" },
  { icon: <Zap size={32} />, text: "Power\nBackup" },
  { icon: <Brush size={32} />, text: "Daily\nHousekeeping" },
  { icon: <PawPrint size={32} />, text: "Pet\nFriendly" },
  { icon: <Droplets size={32} />, text: "Toiletry &\nDental Kit" },
  { icon: <MonitorPlay size={32} />, text: "Projector for\nEntertainment" },
  { icon: <Sofa size={32} />, text: "Beautiful\nAmbiance" }
]

export default function Amenities() {
  return (
    <section className="py-16 px-4" style={{ backgroundColor: "#120610", color: "var(--gold-primary)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 flex items-center justify-center gap-4">
          <div className="h-[1px] bg-[var(--gold-primary)] w-16 opacity-50"></div>
          <h2 className="text-2xl tracking-widest font-cinzel uppercase" style={{ color: "var(--gold-primary)" }}>
            Premium Amenities
          </h2>
          <div className="h-[1px] bg-[var(--gold-primary)] w-16 opacity-50"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {amenitiesList.map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center justify-center text-center p-4 rounded-xl transition-all duration-300 hover:scale-105"
              style={{ 
                border: "1px solid var(--gold-primary)", 
                backgroundColor: "rgba(184, 143, 84, 0.05)"
              }}
            >
              <div className="mb-3" style={{ color: "var(--gold-primary)" }}>
                {item.icon}
              </div>
              <p className="text-xs font-semibold tracking-wider uppercase whitespace-pre-line leading-tight">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <div 
            className="flex-1 flex items-center p-4 rounded-xl"
            style={{ border: "1px solid var(--gold-primary)", backgroundColor: "rgba(184, 143, 84, 0.05)" }}
          >
            <div className="mr-4" style={{ color: "var(--accent-primary)" }}>
              <Heart size={40} />
            </div>
            <div>
              <h3 className="text-[var(--accent-primary)] font-bold tracking-wider uppercase mb-1">Couple Friendly</h3>
              <p className="text-sm opacity-80" style={{ color: "var(--gold-light)" }}>A Comfortable & Safe Stay for Couples</p>
            </div>
          </div>
          
          <div 
            className="flex-1 flex items-center p-4 rounded-xl"
            style={{ border: "1px solid var(--gold-primary)", backgroundColor: "rgba(184, 143, 84, 0.05)" }}
          >
            <div className="mr-4" style={{ color: "var(--accent-primary)" }}>
              <Music size={40} />
            </div>
            <div>
              <h3 className="text-[var(--accent-primary)] font-bold tracking-wider uppercase mb-1">Party Friendly</h3>
              <p className="text-sm opacity-80" style={{ color: "var(--gold-light)" }}>Celebrate Moments, Create Memories</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
