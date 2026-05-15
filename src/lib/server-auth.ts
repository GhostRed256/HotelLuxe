import { cookies } from "next/headers"

export async function getAdminSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("admin_session")
  if (!sessionCookie) return null

  try {
    const session = JSON.parse(sessionCookie.value)
    return session
  } catch (e) {
    return null
  }
}
