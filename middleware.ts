import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /quantframe/dashboard routes
  if (request.nextUrl.pathname.startsWith('/quantframe/dashboard')) {
    // No user session - redirect to login
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/quantframe/login'
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // User not verified - redirect to verify-email page
    if (!user.email_confirmed_at) {
      const url = request.nextUrl.clone()
      url.pathname = '/quantframe/verify-email'
      return NextResponse.redirect(url)
    }
  }

  // If logged in user tries to access login/register, redirect to dashboard
  if (user && user.email_confirmed_at) {
    if (
      request.nextUrl.pathname === '/quantframe/login' ||
      request.nextUrl.pathname === '/quantframe/register'
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/quantframe/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/quantframe/dashboard/:path*', '/quantframe/login', '/quantframe/register'],
}