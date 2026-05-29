import { getAdminSession } from "@/lib/server-auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

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
  
  const csvRows: string[] = []
  csvRows.push(fields.join(','))
  for (const row of bookings) {
    const values = fields.map(field => {
      const fieldParts = field.split('.')
      let val = row
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
