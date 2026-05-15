import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number, timestamp: number }>()

export async function proxy(req: NextRequest) {
  // 1. Rate Limiting (DDoS mitigation)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "127.0.0.1"
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 100 // 100 requests per minute

  let record = rateLimitMap.get(ip)
  if (!record || (now - record.timestamp > windowMs)) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
  } else {
    record.count++
    if (record.count > maxRequests) {
      return new NextResponse("Too Many Requests. Rate limit exceeded to prevent DDoS.", { status: 429 })
    }
  }

  // 2. Route Protection
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isApiAdminRoute = req.nextUrl.pathname.startsWith('/api/admin')

  if (isAdminRoute || isApiAdminRoute) {
    // Read custom cookie set by our auth api route
    const sessionCookie = req.cookies.get("admin_session")
    
    let isAdmin = false
    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie.value)
        isAdmin = session.isAdmin
      } catch (e) {
        // invalid cookie
      }
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Apply middleware to all routes except static assets
  matcher: ['/((?!_next/static|_next/image|uploads|favicon.ico).*)'],
}
