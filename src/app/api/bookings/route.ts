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
    // RESTORED orderBy for "Perfect" Cloud Sorting
    // NOTE: This requires a composite index in Firestore:
    // Collection: bookings
    // Fields: customerEmail (Ascending), createdAt (Descending)
    const bookingsSnapshot = await db.collection("bookings")
      .where("customerEmail", "==", email)
      .orderBy("createdAt", "desc")
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

    return NextResponse.json(bookings)
  } catch (error: any) {
    console.error("Bookings Fetch Error:", error)
    
    // If the error is about a missing index, we provide the link in the logs
    return NextResponse.json({ 
      error: "Cloud sorting requires an index.", 
      details: error.message 
    }, { status: 500 })
  }
}
