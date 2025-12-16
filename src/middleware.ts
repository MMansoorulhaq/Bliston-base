import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect /admin to /admin/login
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin_session');
    
    if (!session && request.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Role-based access control for admin-only routes
    if (session && request.nextUrl.pathname !== '/admin/login') {
      try {
        const sessionData = JSON.parse(session.value);
        const adminOnlyRoutes = ['/admin/users', '/admin/activity-logs'];
        
        // Check if accessing admin-only route
        if (adminOnlyRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
          if (sessionData.role !== 'admin') {
            // Non-admin users trying to access admin routes - redirect to dashboard
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
          }
        }
      } catch (error) {
        // Invalid session - redirect to login
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
