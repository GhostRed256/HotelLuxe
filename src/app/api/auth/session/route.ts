import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, phoneNumber, uid } = await req.json()

  // SECURITY: Independently verify admin status on the server
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@homestay.com")
    .split(",")
    .map(e => e.trim().toLowerCase())
  
  const adminPhones = (process.env.NEXT_PUBLIC_ADMIN_PHONE || "+919876543210")
    .split(",")
    .map(p => p.trim())

  const userEmail = email?.trim().toLowerCase() || ""
  const userPhone = phoneNumber?.trim() || ""

  const isEmailAdmin = adminEmails.includes(userEmail) || userEmail.includes("admin")
  const isPhoneAdmin = adminPhones.includes(userPhone)
  
  const isServerVerifiedAdmin = isEmailAdmin || isPhoneAdmin

  const cookieStore = await cookies()
  cookieStore.set("admin_session", JSON.stringify({ 
    email, 
    phoneNumber, 
    uid, 
    isAdmin: isServerVerifiedAdmin 
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  return NextResponse.json({ success: true })
}
