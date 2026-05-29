export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/firebase-admin";
import { serializeFirestoreData } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import PreBookingClient from "@/components/PreBookingClient";

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
  // Exclude 4BHK HOUSE from showing as its own category card — it's a combination of the 3 sub-units
  const availableCategories = categories.filter(c => c.available > 0 && !c.type.toLowerCase().includes('4bhk'));

  return (
    <div className="min-h-screen bg-[var(--background)] py-20 px-6 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-10 select-none animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-5xl md:text-8xl font-heading font-black mb-6 tracking-tight text-black dark:text-white">
            <span>Stay</span>
            <span className="text-[var(--accent-primary)] italic mx-0.5">N</span>
            <span>Joy</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-black/10 dark:bg-white/10" />
            <p className="text-[11px] md:text-xs font-heading font-bold uppercase tracking-[0.3em] text-black dark:text-white opacity-80 [text-shadow:0_0_15px_rgba(255,255,255,1)] dark:[text-shadow:none]">
              Book <span className="text-[#B88F54] font-extrabold">your</span> Stay
            </p>
            <div className="h-[1px] w-6 bg-black/10 dark:bg-white/10" />
          </div>
        </div>
        <p className="opacity-50 text-center text-xs md:text-sm font-light italic mb-6 max-w-2xl mx-auto">
          Select a suite category below to begin your premium homestay experience.
        </p>

        <div className="flex justify-center mb-12 animate-in fade-in duration-1000 delay-200">
          <a
            href="https://airbnb.co.in/h/staynjoytinsukia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3.5 bg-[#FF5A5F]/15 border border-[#FF5A5F]/30 text-[#FF5A5F] hover:bg-[#FF5A5F] hover:text-white rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          >
            <svg viewBox="0 0 32 32" className="w-4 h-4 fill-current">
              <path d="M16 1c-2.007 0-3.666 1.488-3.957 3.42C9.489 8.283 5 15.65 5 21.053c0 5.485 4.433 9.947 9.9 9.947 2.007 0 3.666-1.488 3.957-3.42 2.554-3.863 7.043-11.23 7.043-16.633C25.9 5.462 21.467 1 16 1zm0 2.21c4.27 0 7.733 3.479 7.733 7.766 0 4.148-3.714 10.457-6.076 14.07a3.972 3.972 0 0 1-3.314 1.764c-2.207 0-4-1.797-4-4.004 0-4.148 3.714-10.457 6.076-14.07A3.972 3.972 0 0 1 16 3.21zm0 6.643a1.996 1.996 0 0 0-2 2c0 1.102.898 2 2 2s2-.898 2-2c0-1.102-.898-2-2-2z" />
            </svg>
            Book via Airbnb Listing
          </a>
        </div>

        <PreBookingClient 
          categories={availableCategories} 
          rooms={rooms} 
          bookings={bookings} 
        />

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
