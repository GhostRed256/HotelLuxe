"use server"

import { db } from "@/lib/firebase-admin"
import { revalidatePath } from "next/cache"
import { sendBookingEmail } from "@/lib/email"

export async function requestBooking(formData: FormData) {
  const roomId = formData.get("roomId") as string
  const name = formData.get("customerName") as string
  const email = formData.get("customerEmail") as string
  const phone = formData.get("customerPhone") as string
  const checkIn = formData.get("checkIn") as string
  const checkOut = formData.get("checkOut") as string

  try {
    const roomDoc = await db.collection("rooms").doc(roomId).get()
    const room = roomDoc.exists ? roomDoc.data()! : { name: "Unknown Suite" }

    await db.collection("bookings").add({
      roomId,
      customerName: name,
      customerEmail: email || "N/A",
      customerPhone: phone,
      checkIn,
      checkOut,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    // Notify Customer
    if (email) {
      await sendBookingEmail({
        to: email,
        subject: `Your Palace Reservation Request: ${room.name}`,
        customerName: name,
        roomName: room.name,
        checkIn: checkIn,
        checkOut: checkOut,
        status: "PENDING"
      });
    }

    // Notify Owners
    const ownerEmails = ["GhostRed256@gmail.com"]; // User specified earlier or common owner email
    await sendBookingEmail({
      to: ownerEmails,
      subject: `[ACTION REQUIRED] New Request from ${name}`,
      customerName: name,
      roomName: room.name,
      checkIn: checkIn,
      checkOut: checkOut,
      status: "PENDING_OWNER_REVIEW"
    });

    revalidatePath("/rooms")
    revalidatePath("/admin")
    revalidatePath("/bookings")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to request booking" }
  }
}
