export const dynamic = "force-dynamic";

import Hero from "@/components/Hero";
import SuiteShowcase from "@/components/SuiteShowcase";
import QuotesMarquee from "@/components/QuotesMarquee";
import Amenities from "@/components/Amenities";
import WelcomePopup from "@/components/WelcomePopup";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase-admin"
import { serializeFirestoreData } from "@/lib/utils"

export default async function Home() {
  const roomsSnapshot = await db.collection("rooms").get();
  const rooms = roomsSnapshot.docs.map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() }));

  return (
    <>
      <WelcomePopup />
      <QuotesMarquee />
      <Hero />
      <Amenities />
      <SuiteShowcase rooms={rooms} />
      <Footer />
    </>
  );
}
