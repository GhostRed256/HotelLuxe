import { getAdminSession } from "@/lib/server-auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

interface Room {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  customerName?: string;
  customerEmail?: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  roomId?: string;
  createdAt?: unknown;
  room?: Room;
}

export async function GET() {
  // Proactive check for database availability
  try {
    if (!db || !db.collection) {
      console.warn("Export API called but database is uninitialized.");
      return new NextResponse("Service Unavailable", { status: 503 });
    }
  } catch (e) {
    return new NextResponse("Configuration Error", { status: 500 });
  }

  const session = await getAdminSession()
  if (!session || !session.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const roomsSnapshot = await db.collection("rooms").get()
  const rooms = roomsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data() as { name: string }
  }))

  const bookingsSnapshot = await db.collection("bookings").orderBy("createdAt", "desc").get()
  const bookings = bookingsSnapshot.docs.map((doc) => {
    const data = doc.data() as Record<string, unknown>
    const associatedRoom = rooms.find(r => r.id === data.roomId)
    return {
      id: doc.id,
      ...data,
      room: associatedRoom || { name: "Unknown Room" }
    } as Booking
  })

  const fields = ['id', 'customerName', 'customerEmail', 'checkIn', 'checkOut', 'status', 'room.name', 'createdAt']

  const csvRows: string[] = []
  csvRows.push(fields.join(','))
  for (const row of bookings) {
    const values = fields.map(field => {
      const fieldParts = field.split('.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let val: any = row
      for (const part of fieldParts) {
        val = val ? val[part] : ''
      }
      const stringVal = String(val ?? '')
      return `"${stringVal.replace(/"/g, '""')}"`
    })
    csvRows.push(values.join(','))
  }
  const csv = csvRows.join('\n')

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="staynjoy_bookings_${new Date().toISOString().split('T')[0]}.csv"`
    }
  })
}
