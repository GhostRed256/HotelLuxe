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
    // RESTORED Native Firestore Ordering. Now that you've created the index,
    // this will perform at cloud-scale speed directly on the Google servers.
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
    
    // Fallback logic: If the index is still "Building", return results without order
    // to prevent the "Rotating Loader" from appearing while the index is being created.
    if (error.message?.includes("index")) {
       const fallbackSnapshot = await db.collection("bookings")
        .where("customerEmail", "==", email)
        .get()
       
       const bookings = fallbackSnapshot.docs.map(doc => ({
         id: doc.id,
         ...serializeFirestoreData(doc.data())
       }))
       
       return NextResponse.json(bookings)
    }

    return NextResponse.json({ 
      error: "Failed to fetch bookings", 
      details: error.message 
    }, { status: 500 })
  }
}
