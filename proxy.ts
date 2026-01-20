import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Enforce role-based access for dashboard routes
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/dashboard/admin')
  const isCustomerRoute = pathname === '/dashboard/customer' || pathname.startsWith('/dashboard/customer')
  const isProtected = isAdminRoute || isCustomerRoute

  if (!isProtected) {
    // For non-protected routes, just continue
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data, error } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (error || !claims) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  const userId = claims.sub as string | undefined
  if (!userId) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .single()

  if (profileError || !profile?.role) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  const role = profile.role as 'admin' | 'customer'

  if (isAdminRoute && role !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = role === 'customer' ? '/dashboard/customer' : '/'
    return NextResponse.redirect(url)
  }

  if (isCustomerRoute && role !== 'customer') {
    const url = request.nextUrl.clone()
    url.pathname = role === 'admin' ? '/dashboard/admin' : '/'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
