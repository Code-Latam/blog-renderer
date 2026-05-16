import { NextResponse } from 'next/server';

export async function GET() {
    const testUrl = 'https://api.meetingmaker.tech/blog/ssr/articles?clientId=6980df60d4dd6be0b8e3081c&limit=1';
    
    console.log('[Debug API] Starting test...');
    console.log('[Debug API] URL:', testUrl);
    console.log('[Debug API] SERVICE_API_KEY exists:', !!process.env.SERVICE_API_KEY);
    
    try {
        const response = await fetch(testUrl, {
            headers: { 
                'X-Service-API-Key': process.env.SERVICE_API_KEY || '' 
            }
        });
        
        const text = await response.text();
        
        console.log('[Debug API] Response status:', response.status);
        console.log('[Debug API] Response preview:', text.substring(0, 200));
        
        return NextResponse.json({ 
            success: true, 
            status: response.status, 
            preview: text.substring(0, 500) 
        });
    } catch (error: any) {
        console.error('[Debug API] Error:', error.message);
        console.error('[Debug API] Error cause:', error.cause);
        
        return NextResponse.json({ 
            success: false, 
            error: error.message, 
            cause: error.cause?.message || 'No cause information'
        });
    }
}