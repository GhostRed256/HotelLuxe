export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/firebase-admin";
import { serializeFirestoreData } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

export default async function PreBookingWindow() {
  const roomsSnapshot = await db.collection("rooms").get();
  const rooms = roomsSnapshot.docs.map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() }));

  const bookingsSnapshot = await db.collection("bookings").where("status", "==", "APPROVED").get();
  const bookings = bookingsSnapshot.docs.map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() }));

  const suiteTypes = ["Cozy Pink Room", "Deluxe Room", "Premium 1BHK Suite", "2BHK House"];
  
  const categories = suiteTypes.map(type => {
    const typeRooms = rooms.filter((r: any) => r.type === type);
    if (typeRooms.length === 0) return null;
    const rep = typeRooms[0];
    
    let img = "";
    try {
      const imgs = typeof rep.images === 'string' ? JSON.parse(rep.images) : (rep.images || []);
      img = imgs?.[0] || "";
    } catch { img = ""; }
    
    if (!img) {
      const t = type.toLowerCase();
      img = t.includes("cozy") ? "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
        : t.includes("deluxe") ? "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800"
        : t.includes("1bhk") ? "https://images.unsplash.com/photo-1560185016-6c3717c37668?auto=format&fit=crop&q=80&w=800"
        : "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800";
    }

    const availableCount = typeRooms.filter((r: any) => {
      return !bookings.some(b => 
        b.roomId === r.id && 
        b.status === 'APPROVED' &&
        new Date(b.checkIn) <= new Date() && 
        new Date(b.checkOut) >= new Date()
      );
    }).length;

    return {
      type,
      price: rep.price,
      image: img,
      available: availableCount,
      description: rep.description?.slice(0, 80) + "..." || "Premium stay in Tinsukia."
    };
  }).filter(Boolean) as any[];

  // Only show categories that have available rooms
  const availableCategories = categories.filter(c => c.available > 0);

  return (
    <div className="min-h-screen bg-[var(--background)] py-20 px-6 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-4 text-center">
          Book Your <span className="text-[var(--accent-primary)]">Stay</span>
        </h1>
        <p className="opacity-60 text-center mb-12 max-w-2xl mx-auto">
          Select a room category below to proceed with your booking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {availableCategories.map((cat, i) => (
            <Link key={cat.type} href={`/rooms?suite=${encodeURIComponent(cat.type)}`} className="block group">
              <div className="relative h-[400px] rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-black shadow-2xl">
                <img 
                  src={cat.image} 
                  alt={cat.type}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute top-6 right-6">
                  <span className="px-5 py-2 rounded-full bg-black/60 backdrop-blur-md text-white font-bold border border-white/20">
                    ₹{cat.price} / night
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl font-heading font-black text-white mb-2 leading-tight">
                    {cat.type}
                  </h3>
                  <p className="text-white/70 font-light text-sm mb-4">
                    {cat.description}
                  </p>
                  <div className="inline-flex items-center justify-center w-full py-3 rounded-full bg-[var(--accent-primary)] text-white font-bold uppercase tracking-widest text-xs hover:bg-rose-600 transition-colors">
                    Book Now
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {availableCategories.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-20">
              <p className="text-xl opacity-60">We are currently fully booked. Please check back later.</p>
            </div>
          )}
        </div>

        <div className="mt-20 pt-8 border-t border-black/10 dark:border-white/10 flex justify-center">
          <Link 
            href="/staff-login" 
            className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-rose-500/60 hover:text-rose-500 transition-colors"
          >
            <ShieldCheck size={16} />
            Admin / Staff Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
