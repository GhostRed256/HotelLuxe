"use server"

import { db } from "@/lib/firebase-admin"
import { revalidatePath } from "next/cache"
import { notifyNewBooking } from "@/lib/notifications"

export async function requestBooking(formData: FormData) {
  const roomId = formData.get("roomId") as string
  const name = formData.get("customerName") as string
  const email = formData.get("customerEmail") as string
  const phone = formData.get("customerPhone") as string
  const checkIn = formData.get("checkIn") as string
  const checkOut = formData.get("checkOut") as string
  
  // Retrieve payment transaction details if present (from the step 2 demo payment)
  const upiTxnId = formData.get("upiTxnId") as string || ""
  const paymentScreenshot = formData.get("paymentScreenshot") as string || ""

  try {
    const roomDoc = await db.collection("rooms").doc(roomId).get()
    const room = roomDoc.exists ? roomDoc.data()! : { name: "Unknown Suite", price: 0 }

    const bookingData = {
      roomId,
      customerName: name,
      customerEmail: email || "N/A",
      customerPhone: phone,
      checkIn,
      checkOut,
      status: "PENDING",
      upiTxnId,
      paymentScreenshot,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await db.collection("bookings").add(bookingData)
    
    // Call the notifications orchestrator to alert both guest and owners
    await notifyNewBooking(
      { id: docRef.id, ...bookingData },
      { name: room.name || "Unknown Suite", price: room.price || 0 }
    )

    revalidatePath("/rooms")
    revalidatePath("/admin")
    revalidatePath("/bookings")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to request booking" }
  }
}

