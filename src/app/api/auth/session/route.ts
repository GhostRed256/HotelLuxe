import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { adminAuth } from "@/lib/firebase-admin"

export async function POST(req: Request) {
  const { idToken } = await req.json()

  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 401 })
  }

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(idToken)
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error)
    return NextResponse.json({ error: "Unauthorized or invalid token" }, { status: 401 })
  }

  const { email, phone_number: phoneNumber, uid } = decodedToken

  // SECURITY: Independently verify admin status on the server using non-public variables
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "staynjoy05@gmail.com")
    .split(",")
    .map(e => e.trim().toLowerCase())

  const adminPhones = (process.env.ADMIN_PHONES || process.env.NEXT_PUBLIC_ADMIN_PHONE || "+918133819414")
    .split(",")
    .map(p => p.trim())

  const userEmail = email?.trim().toLowerCase() || ""
  const userPhone = phoneNumber?.trim() || ""

  const isEmailAdmin = adminEmails.includes(userEmail)
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
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })

  // Return isAdmin so client-side can verify access level immediately
  return NextResponse.json({ success: true, isAdmin: isServerVerifiedAdmin })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  return NextResponse.json({ success: true })
}
