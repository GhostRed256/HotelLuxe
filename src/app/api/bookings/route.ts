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
    const bookingsSnapshot = await db.collection("bookings")
      .where("customerEmail", "==", email)
      .orderBy("createdAt", "desc")
      .get()

    const roomsSnapshot = await db.collection("rooms").get()
    const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

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
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
