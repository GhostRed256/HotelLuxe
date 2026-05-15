"use server"

import { db } from "@/lib/firebase-admin"
import { revalidatePath } from "next/cache"

export async function requestBooking(formData: FormData) {
  const roomId = formData.get("roomId") as string
  const name = formData.get("customerName") as string
  const email = formData.get("customerEmail") as string
  const checkIn = new Date(formData.get("checkIn") as string)
  const checkOut = new Date(formData.get("checkOut") as string)

  try {
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
    
    revalidatePath("/rooms")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to request booking" }
  }
}
