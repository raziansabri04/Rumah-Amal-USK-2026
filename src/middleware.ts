import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Jika user sudah login dan mencoba akses halaman login, redirect ke dashboard
  if (pathname === '/admin/login' && req.auth) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Jika belum login dan mencoba akses halaman admin (selain login), redirect ke login
  if (!pathname.startsWith('/admin/login') && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
