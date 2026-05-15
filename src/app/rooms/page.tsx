export const dynamic = "force-dynamic";

import RoomGallery from "@/components/RoomGallery";
import { db } from "@/lib/firebase-admin"
import { serializeFirestoreData } from "@/lib/utils"

export default async function RoomsPage() {
  const roomsSnapshot = await db.collection("rooms").get();
  const rooms = roomsSnapshot.docs.map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() }));

  const bookingsSnapshot = await db.collection("bookings").where("status", "==", "APPROVED").get();
  const bookings = bookingsSnapshot.docs.map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() }));
  
  return (
    <div className="pt-8">
      <RoomGallery rooms={rooms as any} bookings={bookings as any} />
    </div>
  );
}
