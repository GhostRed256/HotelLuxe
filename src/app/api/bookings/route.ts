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
    let bookings: any[] = []
    
    try {
      // 1. Try with native ordering (High Performance)
      const snapshot = await db.collection("bookings")
        .where("customerEmail", "==", email)
        .orderBy("createdAt", "desc")
        .get()
      
      bookings = snapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }))
    } catch (orderError) {
      console.warn("Index not ready yet, falling back to basic search.")
      // 2. FALLBACK: Basic search if index is missing/building
      const snapshot = await db.collection("bookings")
        .where("customerEmail", "==", email)
        .get()
      
      bookings = snapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }))
      
      // 3. Manual Sort (in-memory) so user still sees the right order
      bookings.sort((a, b) => {
        const dateA = a.createdAt?._seconds || new Date(a.createdAt).getTime() || 0
        const dateB = b.createdAt?._seconds || new Date(b.createdAt).getTime() || 0
        return dateB - dateA
      })
    }

    // Attach room details
    const roomsSnapshot = await db.collection("rooms").get()
    const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }))

    const enrichedBookings = bookings.map(b => ({
      ...b,
      room: rooms.find(r => r.id === b.roomId)
    }))

    return NextResponse.json(enrichedBookings)
  } catch (error: any) {
    console.error("Critical API Failure:", error)
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 })
  }
}
