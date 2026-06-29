import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isDashboardRoute = path.startsWith('/doctor') || path.startsWith('/technician') || path.startsWith('/user')

  if (isDashboardRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Retrieve profile role to verify RBAC
    let role = user.user_metadata?.role
    if (!role) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      role = profile?.role
    }

    if (role) {
      if (path.startsWith('/doctor') && role !== 'doctor') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
      if (path.startsWith('/technician') && role !== 'technician') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
      if (path.startsWith('/user') && role !== 'user') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
  }

  if (user && (path === '/login' || path === '/signup')) {
    // Only redirect if they have a valid role/profile in the database
    let role = user.user_metadata?.role
    if (!role) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      role = profile?.role
    }
    if (role) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}
