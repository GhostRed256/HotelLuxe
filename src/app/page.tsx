export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/firebase-admin";
import { serializeFirestoreData } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

export default async function PreBookingWindow() {
  const [roomsSnapshot, bookingsSnapshot] = await Promise.all([
    db.collection("rooms").get(),
    db.collection("bookings").where("status", "==", "APPROVED").get()
  ]);

  const rooms = roomsSnapshot.docs.map((doc: any) => {
    const data = doc.data();
    let firstImg = "";
    if (data.images) {
      try {
        const imgs = typeof data.images === 'string' ? JSON.parse(data.images) : data.images;
        firstImg = imgs?.[0] || "";
      } catch {
        firstImg = "";
      }
    }
    return serializeFirestoreData({
      id: doc.id,
      name: data.name,
      type: data.type,
      price: data.price,
      description: data.description,
      location: data.location,
      floor: data.floor,
      images: firstImg ? [firstImg] : []
    });
  });
  const bookings = bookingsSnapshot.docs.map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() }));

  // Group rooms by type AND price to separate the 3 different 2BHK options
  const uniqueCategories: any[] = [];
  const seen = new Set();
  
  for (const r of rooms) {
    const key = `${r.type}-${r.price}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueCategories.push({
        type: r.type,
        price: r.price,
        description: r.description,
        images: r.images,
        id: r.id
      });
    }
  }

  const categories = uniqueCategories.map(cat => {
    const typeRooms = rooms.filter((r: any) => r.type === cat.type && Number(r.price) === Number(cat.price));
    
    let img = "";
    try {
      const imgs = typeof cat.images === 'string' ? JSON.parse(cat.images) : (cat.images || []);
      img = imgs?.[0] || "";
    } catch { img = ""; }
    
    if (!img) {
      const t = cat.type.toLowerCase();
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
      type: cat.type,
      price: cat.price,
      roomId: cat.id,
      image: img,
      available: availableCount,
      description: cat.description?.slice(0, 80) + "..." || "Premium stay in Tinsukia."
    };
  }).filter(Boolean) as any[];

  // Only show categories that have available rooms
  const availableCategories = categories.filter(c => c.available > 0);

  return (
    <div className="min-h-screen bg-[var(--background)] py-20 px-6 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-10 select-none animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-6xl md:text-8xl font-heading italic font-black tracking-tight mb-3 drop-shadow-2xl" style={{ filter: "drop-shadow(0 0 20px rgba(255, 45, 85, 0.35))" }}>
            <span className="text-[#FF2D55]">Stay</span>
            <span className="bg-gradient-to-r from-[#96713F] via-[#B88F54] to-[#96713F] bg-clip-text text-transparent">N</span>
            <span className="text-[#FF2D55]">joy</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-black/10 dark:bg-white/10" />
            <p className="text-[11px] md:text-xs font-heading font-bold uppercase tracking-[0.3em] text-black dark:text-white opacity-80">
              Book <span className="text-[#B88F54] font-extrabold">your</span> Stay
            </p>
            <div className="h-[1px] w-6 bg-black/10 dark:bg-white/10" />
          </div>
        </div>
        <p className="opacity-50 text-center text-xs md:text-sm font-light italic mb-12 max-w-2xl mx-auto">
          Select a suite category below to begin your premium homestay experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {availableCategories.map((cat, i) => {
            // Include price in the URL if it's a 2BHK to differentiate them, or better yet, link to the roomId
            const param = cat.type === "2BHK House" ? `2BHK_${cat.price}` : cat.type;
            return (
            <Link key={`${cat.type}-${cat.price}`} href={`/rooms?suite=${encodeURIComponent(param)}`} className="block group">
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
            );
          })}
          
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
