import { db } from "@/lib/firebase-admin"
import { serializeFirestoreData } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  try {
    // REMOVED orderBy for compatibility. Sorting in-memory to prevent hangs/crashes 
    // if the user hasn't created the Firestore composite index yet.
    const bookingsSnapshot = await db.collection("bookings")
      .where("customerEmail", "==", email)
      .get()

    const roomsSnapshot = await db.collection("rooms").get()
    const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }))

    const bookings = bookingsSnapshot.docs.map(doc => {
      const data = serializeFirestoreData(doc.data())
      const room = rooms.find(r => r.id === data.roomId)
      return {
        id: doc.id,
        ...data,
        room
      }
    })

    // Manual Sort by createdAt (descending) - works perfectly without cloud index
    bookings.sort((a: any, b: any) => {
      const dateA = a.createdAt?._seconds || new Date(a.createdAt).getTime() || 0
      const dateB = b.createdAt?._seconds || new Date(b.createdAt).getTime() || 0
      return dateB - dateA
    })

    return NextResponse.json(bookings)
  } catch (error: any) {
    console.error("Bookings Fetch Error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch bookings", 
      details: error.message 
    }, { status: 500 })
  }
}
