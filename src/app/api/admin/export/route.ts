import { getAdminSession } from "@/lib/server-auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"
import { Parser } from "json2csv"

export async function GET() {
  const session = await getAdminSession()
  if (!session || !session.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const roomsSnapshot = await db.collection("rooms").get()
  const rooms = roomsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))

  const bookingsSnapshot = await db.collection("bookings").orderBy("createdAt", "desc").get()
  const bookings = bookingsSnapshot.docs.map((doc: any) => {
    const data = doc.data()
    const associatedRoom = rooms.find(r => r.id === data.roomId)
    return {
      id: doc.id,
      ...data,
      room: associatedRoom || { name: "Unknown Room" }
    }
  })

  const fields = ['id', 'customerName', 'customerEmail', 'checkIn', 'checkOut', 'status', 'room.name', 'createdAt']
  const json2csvParser = new Parser({ fields })
  const csv = json2csvParser.parse(bookings)

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="staynjoy_bookings_${new Date().toISOString().split('T')[0]}.csv"`
    }
  })
}
