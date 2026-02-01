import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: Request & { nextUrl: URL }) {
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const url = new URL(req.nextUrl)
    url.pathname = '/admin/login'
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
