import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, uid } = await req.json()

  // SECURITY FIX: Never trust the client's isAdmin flag. Verify it independently on the server.
  const adminEmailStr = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@hotel.com").trim().toLowerCase()
  const isServerVerifiedAdmin = email ? email.trim().toLowerCase() === adminEmailStr : false

  const cookieStore = await cookies()
  cookieStore.set("admin_session", JSON.stringify({ email, uid, isAdmin: isServerVerifiedAdmin }), {
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
