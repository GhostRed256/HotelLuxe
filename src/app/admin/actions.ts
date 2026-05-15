"use server"

import { db } from "@/lib/firebase-admin"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import fs from "fs"

export async function addRoom(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const floor = formData.get("floor") as string || "Ground Floor"
  const type = formData.get("type") as string || "Cozy Pink Room"
  const roomNumber = formData.get("roomNumber") as string || "000"
  const location = formData.get("location") as string || "Chaliha Nagar"
  
  const files = formData.getAll("images") as File[]
  const uploadedImages: string[] = []

  const uploadDir = path.join(process.cwd(), "public", "uploads", "rooms")
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  for (const file of files) {
    if (file.size === 0) continue
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
    const filepath = path.join(uploadDir, filename)
    try {
      await writeFile(filepath, buffer)
      uploadedImages.push(`/uploads/rooms/${filename}`)
    } catch(e) {
      console.error("Failed to write file", e)
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
    images: uploadedImages, // Store as array
    createdAt: new Date(),
    updatedAt: new Date()
  })
  
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/rooms")
}

export async function deleteRoom(roomId: string) {
  await db.collection("rooms").doc(roomId).delete()
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/rooms")
}

export async function uploadRoomImages(roomId: string, formData: FormData) {
  const files = formData.getAll("images") as File[]
  const roomDoc = await db.collection("rooms").doc(roomId).get()
  
  if (!roomDoc.exists) return
  const room = roomDoc.data()!

  let currentImages: string[] = []
  try {
    currentImages = typeof room.images === 'string' ? JSON.parse(room.images) : (room.images || [])
  } catch(e) {
    currentImages = []
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "rooms")
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  for (const file of files) {
    if (file.size === 0) continue
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
    const filepath = path.join(uploadDir, filename)
    try {
      await writeFile(filepath, buffer)
      currentImages.push(`/uploads/rooms/${filename}`)
    } catch(e) {}
  }

  await db.collection("rooms").doc(roomId).update({
    images: currentImages, // Store as array
    updatedAt: new Date()
  })
  
  revalidatePath("/admin")
  revalidatePath("/rooms")
}

export async function addEmailForReports(formData: FormData) {
  const email = formData.get("email") as string
  console.log(`Email ${email} registered for weekly/monthly booking reports.`)
}

export async function updateBookingStatus(bookingId: string, status: "APPROVED" | "REJECTED") {
  await db.collection("bookings").doc(bookingId).update({
    status,
    updatedAt: new Date()
  })

  // Simulated Email Notification to Customer
  console.log(`Email sent to customer: Your booking is now ${status}`)

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/rooms")
}
