export const dynamic = "force-dynamic";

import Hero from "@/components/Hero";
import SuiteBanner from "@/components/SuiteBanner";
import QuotesMarquee from "@/components/QuotesMarquee";
import Amenities from "@/components/Amenities";
import LocationShowcase from "@/components/LocationShowcase";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import JaapiDivider from "@/components/JaapiDivider";
import { db } from "@/lib/firebase-admin"
import { serializeFirestoreData } from "@/lib/utils"
 
 export default async function Home() {
   const roomsSnapshot = await db.collection("rooms").get();
   const rooms = roomsSnapshot.docs.map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() }));
 
   const bookingsSnapshot = await db.collection("bookings").where("status", "==", "APPROVED").get();
   const bookings = bookingsSnapshot.docs.map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() }));
 
   return (
     <>
       <Hero />
       <JaapiDivider />
       <QuotesMarquee />
       <SuiteBanner rooms={rooms} bookings={bookings} />
       <JaapiDivider />
       <Amenities />
       <LocationShowcase />
       <MapSection />
       <Footer />
     </>
   );
 }
