import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // 1. Define protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/welcome');

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Optional: Verify token integrity
    const decoded = await verifyToken(token);
    if (!decoded) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token'); // Clear invalid token
      return response;
    }
  }

  // 2. Prevent logged-in users from accessing login/signup
  const isAuthRoute = request.nextUrl.pathname === '/login' || 
                      request.nextUrl.pathname === '/signup' || 
                      request.nextUrl.pathname === '/verify';

  if (isAuthRoute && token) {
    const decoded = await verifyToken(token);
    if (decoded) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/welcome', '/login', '/signup', '/verify'],
};
