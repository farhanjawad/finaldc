import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'ku_admin_session';

/**
 * Edge Proxy handler to guard protected administration routes
 * and redirect unauthenticated requests to /login.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  // Extract session token from incoming request cookies
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // 1. Intercept unauthenticated visits to /admin routes
  if (isAdminRoute && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Prevent authenticated admins from re-visiting the login screen
  if (isLoginPage && sessionToken) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};