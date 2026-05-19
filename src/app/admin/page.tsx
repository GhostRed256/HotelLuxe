export const dynamic = "force-dynamic"
import { getAdminSession } from "@/lib/server-auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/firebase-admin"
import AdminDashboardClient from "./AdminDashboardClient"
import { serializeFirestoreData } from "@/lib/utils"
import { Suspense } from "react"

export default async function AdminDashboard() {
  const session = await getAdminSession()
  
  if (!session || !session.isAdmin) {
    redirect("/staff-login")
  }

  const [roomsSnapshot, bookingsSnapshot] = await Promise.all([
    db.collection("rooms").get(),
    db.collection("bookings").orderBy("createdAt", "desc").get().catch(() => db.collection("bookings").get())
  ])

  const rooms = roomsSnapshot.docs
    .map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() as any }))
    .sort((a, b) => {
      if (a.floor === b.floor) {
        return (a.roomNumber || "").localeCompare(b.roomNumber || "");
      }
      return (a.floor || 0) - (b.floor || 0);
    });

  const bookings = bookingsSnapshot.docs.map((doc: any) => {
    const data = serializeFirestoreData(doc.data())
    const associatedRoom = rooms.find(r => r.id === data.roomId)
    return {
      id: doc.id,
      ...data,
      room: associatedRoom || { name: "Unknown Room" }
    }
  })

  // Manual fallback sort to ensure newest bookings are always first
  bookings.sort((a: any, b: any) => {
    const dateA = a.createdAt?._seconds || new Date(a.createdAt).getTime() || 0
    const dateB = b.createdAt?._seconds || new Date(b.createdAt).getTime() || 0
    return dateB - dateA
  })

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Palace Control...</div>}>
      <AdminDashboardClient rooms={rooms} bookings={bookings} />
    </Suspense>
  )
}
