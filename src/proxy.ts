import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const adminCookie = request.cookies.get('admin_session')
  
  if (adminCookie) {
    try {
      const session = JSON.parse(adminCookie.value)
      if (session.isAdmin) {
        // If they are an admin and trying to visit public pages or login pages, send them to dashboard
        const url = request.nextUrl.clone()
        if (url.pathname === '/' || url.pathname === '/login' || url.pathname === '/staff-login') {
          url.pathname = '/admin'
          return NextResponse.redirect(url)
        }
      }
    } catch (e) {
      // Ignore invalid cookies
    }
  }
  
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/login', '/staff-login'],
}
