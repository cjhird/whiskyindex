import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/mock/auth';

export function middleware(request: NextRequest) {
  const session = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthed = Boolean(session);
  const path = request.nextUrl.pathname;

  if (!isAuthed && (path.startsWith('/portfolio') || path.startsWith('/watchlist'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portfolio/:path*', '/watchlist/:path*'],
};
