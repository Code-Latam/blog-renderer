import { NextRequest, NextResponse } from 'next/server';
import { getClientByDomain } from './lib/api';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Skip internal Next.js routes and static files
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Get client by domain
  const client = await getClientByDomain(host);

  if (!client) {
    return new Response('Blog not found', { status: 404 });
  }

  // Rewrite to client-specific route
  const url = request.nextUrl.clone();
  url.pathname = `/${client.clientId}${pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: '/((?!_next/static|favicon.ico).*)',
};