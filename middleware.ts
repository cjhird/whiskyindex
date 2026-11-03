import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/mock/auth';

export function middleware(request: NextRequest) {
  const session = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthed = Boolean(session);

  if (!isAuthed && request.nextUrl.pathname.startsWith('/portfolio')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', '/portfolio');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portfolio/:path*'],
};
