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

  // ✅ Check if first path segment looks like a MongoDB ObjectId (24 hex chars)
  const firstSegment = pathname.split('/')[1];
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(firstSegment);
  
  if (isObjectId && firstSegment) {
    // Direct client ID in URL path - use it directly
    console.log(`[Middleware] Using client ID from path: ${firstSegment}`);
    // Already in the correct format, just continue
    return NextResponse.next();
  }

  // Otherwise, try to get client by domain
  const client = await getClientByDomain(host);

  if (!client) {
    console.log(`[Middleware] No client found for domain: ${host}`);
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