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

  let rooms: any[] = []
  let bookings: any[] = []

  try {
    const [roomsSnapshot, bookingsSnapshot] = await Promise.all([
      db.collection("rooms").get(),
      db.collection("bookings").orderBy("createdAt", "desc").get().catch(() => db.collection("bookings").get())
    ])

    rooms = roomsSnapshot.docs
      .map((doc: any) => {
        try {
          return serializeFirestoreData({ id: doc.id, ...doc.data() as any })
        } catch (e) {
          console.error("Error serializing room:", doc.id, e)
          return null
        }
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a.floor === b.floor) {
          return (a.roomNumber || "").localeCompare(b.roomNumber || "");
        }
        return (a.floor || 0) - (b.floor || 0);
      });

    bookings = bookingsSnapshot.docs.map((doc: any) => {
      try {
        const data = serializeFirestoreData(doc.data())
        const associatedRoom = rooms.find(r => r.id === data.roomId)
        return {
          id: doc.id,
          ...data,
          room: associatedRoom || { name: "Unknown Room" }
        }
      } catch (e) {
        console.error("Error serializing booking:", doc.id, e)
        return null
      }
    }).filter(Boolean)

    // Manual fallback sort to ensure newest bookings are always first
    bookings.sort((a, b) => {
      const dateA = a.createdAt?._seconds || new Date(a.createdAt).getTime() || 0
      const dateB = b.createdAt?._seconds || new Date(b.createdAt).getTime() || 0
      return dateB - dateA
    })
  } catch (error) {
    console.error("CRITICAL_DATA_FETCH_ERROR in AdminDashboard:", error)
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-20">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Homestay Control...</div>}>
          <AdminDashboardClient rooms={rooms} bookings={bookings} />
        </Suspense>
      </div>
    </div>
  )
}
