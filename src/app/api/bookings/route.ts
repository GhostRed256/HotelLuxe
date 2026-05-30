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
    let bookings: Record<string, unknown>[] = []

    try {
      // 1. Try with native ordering (High Performance)
      const snapshot = await db.collection("bookings")
        .where("customerEmail", "==", email)
        .orderBy("createdAt", "desc")
        .get()

      bookings = snapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }))
    } catch (_orderError) {
      console.warn("Index not ready yet, falling back to basic search.")
      // 2. FALLBACK: Basic search if index is missing/building
      const snapshot = await db.collection("bookings")
        .where("customerEmail", "==", email)
        .get()

      bookings = snapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }))

      // 3. Manual Sort (in-memory) so user still sees the right order
      bookings.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dateA = (a.createdAt as any)?._seconds || new Date(a.createdAt as any).getTime() || 0
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dateB = (b.createdAt as any)?._seconds || new Date(b.createdAt as any).getTime() || 0
        return dateB - dateA
      })
    }

    // Attach room details
    const roomsSnapshot = await db.collection("rooms").get()
    const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Record<string, unknown> }))

    const enrichedBookings = bookings.map(b => ({
      ...b,
      room: rooms.find(r => r.id === b.roomId)
    }))

    return NextResponse.json(enrichedBookings)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Identification failed"
    console.error("Critical API Failure:", error)
    return NextResponse.json({ error: "Internal Server Error", message }, { status: 500 })
  }
}
