"use server"

import { db } from "@/lib/firebase-admin"
import { revalidatePath } from "next/cache"
import { sendBookingEmail } from "@/lib/email"

export async function requestBooking(formData: FormData) {
  const roomId = formData.get("roomId") as string
  const name = formData.get("customerName") as string
  const email = formData.get("customerEmail") as string
  const checkIn = formData.get("checkIn") as string
  const checkOut = formData.get("checkOut") as string

  try {
    const roomDoc = await db.collection("rooms").doc(roomId).get()
    const room = roomDoc.exists ? roomDoc.data()! : { name: "Unknown Suite" }

    await db.collection("bookings").add({
      roomId,
      customerName: name,
      customerEmail: email,
      checkIn,
      checkOut,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    // Notify Owner
    const ownerEmails = ["owner1@staynjoy.com", "manager@staynjoy.com"]
    await sendBookingEmail({
      to: ownerEmails,
      subject: `[NEW REQUEST] ${name} wants to book ${room.name}`,
      customerName: name,
      roomName: room.name,
      checkIn: checkIn,
      checkOut: checkOut,
      status: "PENDING"
    })

    revalidatePath("/rooms")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to request booking" }
  }
}
