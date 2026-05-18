import { NextRequest, NextResponse } from 'next/server';
import { getClientByDomain } from '@/lib/api';

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.toString();
  
  console.log('[Debug] Host:', host);
  console.log('[Debugs] Full URL:', url);
  
  const client = await getClientByDomain(host);
  
  return NextResponse.json({
    host,
    clientFound: !!client,
    clientId: client?.clientId || null,
    message: client ? 'Client found' : 'Client not found'
  });
}