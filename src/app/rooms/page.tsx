export const dynamic = "force-dynamic";

import RoomGallery from "@/components/RoomGallery";
import { Suspense } from "react"
import { db } from "@/lib/firebase-admin"
import { serializeFirestoreData } from "@/lib/utils"

export default async function RoomsPage() {
  const [roomsSnapshot, bookingsSnapshot] = await Promise.all([
    db.collection("rooms").get(),
    db.collection("bookings").where("status", "==", "APPROVED").get()
  ]);

  const rooms = roomsSnapshot.docs.map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() }));
  const bookings = bookingsSnapshot.docs.map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() }));
  
  return (
    <div className="pt-8">
      <Suspense fallback={<div className="h-screen flex items-center justify-center opacity-20 italic">Loading Registry...</div>}>
        <RoomGallery rooms={rooms as any} bookings={bookings as any} />
      </Suspense>
    </div>
  );
}
