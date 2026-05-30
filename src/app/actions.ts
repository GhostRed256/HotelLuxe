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

    // Determine payment status. If specifically set by frontend (e.g. manual), use that.
    // Otherwise fallback to PAID if proof exists, PENDING if not.
    const explicitStatus = formData.get("paymentStatus") as string
    const paymentStatus: "PAID" | "PENDING" | "MANUAL" =
      explicitStatus === "MANUAL" ? "MANUAL" :
        (upiTxnId || paymentScreenshot) ? "PAID" : "PENDING"

    const bookingData = {
      roomId,
      customerName: name,
      customerEmail: email || "N/A",
      customerPhone: phone,
      checkIn,
      checkOut,
      status: "PENDING",
      paymentStatus,
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
    return { success: true, bookingId: docRef.id }
  } catch (error) {
    console.error(error)
    return { error: "Failed to request booking" }
  }
}

export async function updateBookingPayment(bookingId: string, upiTxnId: string, paymentScreenshot: string) {
  try {
    await db.collection("bookings").doc(bookingId).update({
      upiTxnId,
      paymentScreenshot,
      paymentStatus: (upiTxnId || paymentScreenshot) ? "PAID" : "PENDING",
      updatedAt: new Date()
    })
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Update failed", error)
    return { error: "Failed to update payment proof" }
  }
}

