import { getAdminSession } from "@/lib/server-auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/firebase-admin"
import AdminDashboardClient from "./AdminDashboardClient"
import { serializeFirestoreData } from "@/lib/utils"

export default async function AdminDashboard() {
  const session = await getAdminSession()
  
  if (!session || !session.isAdmin) {
    redirect("/login")
  }

  const roomsSnapshot = await db.collection("rooms").get()
  const rooms = roomsSnapshot.docs
    .map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() as any }))
    .sort((a, b) => {
      if (a.floor === b.floor) {
        return (a.roomNumber || "").localeCompare(b.roomNumber || "");
      }
      return (a.floor || 0) - (b.floor || 0);
    });

  const bookingsSnapshot = await db.collection("bookings").orderBy("createdAt", "desc").get()
  const bookings = bookingsSnapshot.docs.map((doc: any) => {
    const data = serializeFirestoreData(doc.data())
    const associatedRoom = rooms.find(r => r.id === data.roomId)
    return {
      id: doc.id,
      ...data,
      room: associatedRoom || { name: "Unknown Room" }
    }
  })

  return <AdminDashboardClient rooms={rooms} bookings={bookings} />
}
