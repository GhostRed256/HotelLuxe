"use server"

import { db } from "@/lib/firebase-admin"
import { revalidatePath } from "next/cache"
import { notifyBookingStatusChange } from "@/lib/notifications"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function validateAdminSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("admin_session")

  if (!sessionCookie) throw new Error("Unauthorized: No session found")

  try {
    const session = JSON.parse(sessionCookie.value)
    if (!session.isAdmin) throw new Error("Unauthorized: Not an admin")
    return session
  } catch (e) {
    throw new Error("Unauthorized: Invalid session")
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  redirect("/login")
}

// Convert file to base64 data URI for Firestore storage
async function fileToDataUri(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = buffer.toString('base64')
  const mimeType = file.type || 'image/jpeg'
  return `data:${mimeType};base64,${base64}`
}

export async function addRoom(formData: FormData) {
  await validateAdminSession()
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const floor = formData.get("floor") as string || "Ground Floor"
  const type = formData.get("type") as string || "Cozy Pink Room"
  const roomNumber = formData.get("roomNumber") as string || "000"
  const location = formData.get("location") as string || "Chaliha Nagar"

  const files = formData.getAll("images") as File[]
  const uploadedImages: string[] = []

  for (const file of files) {
    if (file.size === 0) continue
    if (file.size > 5 * 1024 * 1024) continue // Skip files > 5MB
    try {
      const dataUri = await fileToDataUri(file)
      uploadedImages.push(dataUri)
    } catch (e) {
      console.error("Failed to process image", e)
    }
  }

  await db.collection("rooms").add({
    name,
    description,
    price,
    floor,
    type,
    roomNumber,
    location,
    images: uploadedImages,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/rooms")
}

export async function uploadRoomImages(roomId: string, formData: FormData) {
  await validateAdminSession()
  const files = formData.getAll("images") as File[]
  const roomDoc = await db.collection("rooms").doc(roomId).get()

  if (!roomDoc.exists) return { success: false, error: "Room not found" }
  const room = roomDoc.data()!

  let currentImages: string[] = []
  try {
    currentImages = typeof room.images === 'string' ? JSON.parse(room.images) : (room.images || [])
  } catch (e) {
    currentImages = []
  }

  const newImages: string[] = []
  for (const file of files) {
    if (file.size === 0) continue
    if (file.size > 5 * 1024 * 1024) continue // Skip files > 5MB
    try {
      const dataUri = await fileToDataUri(file)
      newImages.push(dataUri)
    } catch (e) {
      console.error("Failed to process image", e)
    }
  }

  const allImages = [...currentImages, ...newImages]

  await db.collection("rooms").doc(roomId).update({
    images: allImages,
    updatedAt: new Date()
  })

  revalidatePath("/admin")
  revalidatePath("/rooms")
  revalidatePath("/")
  return { success: true, count: newImages.length }
}

export async function removeRoomImage(roomId: string, imageIndex: number) {
  await validateAdminSession()
  const roomDoc = await db.collection("rooms").doc(roomId).get()
  if (!roomDoc.exists) return
  const room = roomDoc.data()!

  let images: string[] = []
  try {
    images = typeof room.images === 'string' ? JSON.parse(room.images) : (room.images || [])
  } catch (e) {
    images = []
  }

  images.splice(imageIndex, 1)

  await db.collection("rooms").doc(roomId).update({
    images,
    updatedAt: new Date()
  })

  revalidatePath("/admin")
  revalidatePath("/rooms")
  revalidatePath("/")
}

export async function deleteRoom(roomId: string) {
  await validateAdminSession()

  const roomDoc = await db.collection("rooms").doc(roomId).get()
  if (!roomDoc.exists) return { success: false, error: "Room not found" }

  // Delete the room document
  await db.collection("rooms").doc(roomId).delete()

  revalidatePath("/admin")
  revalidatePath("/rooms")
  revalidatePath("/")

  return { success: true }
}

export async function addEmailForReports(formData: FormData) {
  await validateAdminSession()
  const email = formData.get("email") as string
  console.log(`Email ${email} registered for weekly/monthly booking reports.`)
}

export async function updateBookingStatus(bookingId: string, status: "APPROVED" | "REJECTED") {
  await validateAdminSession()
  const bookingDoc = await db.collection("bookings").doc(bookingId).get()
  if (!bookingDoc.exists) return
  const booking = bookingDoc.data()!

  const roomDoc = await db.collection("rooms").doc(booking.roomId).get()
  const room = roomDoc.exists ? roomDoc.data()! : { name: "Unknown Suite", price: 0 }

  await db.collection("bookings").doc(bookingId).update({
    status,
    updatedAt: new Date()
  })

  await notifyBookingStatusChange(
    {
      id: bookingId,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    },
    {
      name: room.name || "Unknown Suite",
      price: room.price || 0,
    },
    status
  )

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/rooms")
}

export async function deleteBooking(bookingId: string) {
  await validateAdminSession()
  await db.collection("bookings").doc(bookingId).delete()
  revalidatePath("/admin")
}


export async function createManualBooking(formData: FormData) {
  await validateAdminSession()
  const roomId = formData.get("roomId") as string
  const customerName = formData.get("customerName") as string
  const customerEmail = formData.get("customerEmail") as string
  const checkIn = formData.get("checkIn") as string
  const checkOut = formData.get("checkOut") as string

  const customerPhone = formData.get("customerPhone") as string

  try {
    const docRef = await db.collection("bookings").add({
      roomId,
      customerName,
      customerEmail,
      customerPhone,
      checkIn,
      checkOut,
      status: "APPROVED",
      paymentStatus: "MANUAL",
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await updateBookingStatus(docRef.id, "APPROVED")

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
