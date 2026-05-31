export const dynamic = "force-dynamic";

import { db } from "@/lib/firebase-admin";
import { serializeFirestoreData } from "@/lib/utils";
import RoomGallery from "@/components/RoomGallery";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JaapiDivider from "@/components/JaapiDivider";

/**
 * HomestaysPage - The "Detailed Opening Screen" for browsing all rooms and suites.
 */
export default async function HomestaysPage() {
    // Fetch all rooms and approved bookings for real-time availability in the gallery
    const roomsSnapshot = await db.collection("rooms").get();
    const rooms = roomsSnapshot.docs.map((doc: any) =>
        serializeFirestoreData({ id: doc.id, ...doc.data() })
    );

    const bookingsSnapshot = await db
        .collection("bookings")
        .where("status", "==", "APPROVED")
        .get();
    const bookings = bookingsSnapshot.docs.map((doc: any) =>
        serializeFirestoreData({ id: doc.id, ...doc.data() })
    );

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />

            {/* Immersive Gallery Header */}
            <section className="pt-40 pb-20 px-6 relative overflow-hidden">
                {/* Background Decorative Element */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[var(--accent-primary)]/5 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="mb-6 inline-block py-2 px-6 rounded-full border border-[var(--gold-primary)]/30 bg-[var(--gold-primary)]/5 backdrop-blur-sm">
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[var(--accent-primary)]">
                            Luxury Collections
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-9xl font-heading font-black mb-8 tracking-tighter leading-none">
                        Escape to <span className="text-[var(--accent-primary)]">Elegance</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-2xl font-light italic opacity-60 leading-relaxed mb-12">
                        Explore our curated selection of sanctuaries across Tinsukia. From intimate suites to grand multi-bedroom houses.
                    </p>

                    <div className="ornate-divider mx-auto">
                        <span>✦</span>
                    </div>
                </div>
            </section>

            <JaapiDivider />

            {/* The main interactive room gallery & booking flow */}
            <section className="relative z-10 px-4 md:px-0">
                <RoomGallery rooms={rooms} bookings={bookings} />
            </section>

            <Footer />
        </div>
    );
}
