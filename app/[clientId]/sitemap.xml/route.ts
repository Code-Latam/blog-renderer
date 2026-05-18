import { NextRequest, NextResponse } from 'next/server';
import { fetchArticles, getClientById } from '@/lib/api';

export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const { clientId } = params;

  console.log('[Sitemap] Starting for clientId:', clientId);

  try {
    // Get client info
    const client = await getClientById(clientId);
    
    if (!client || !client.blog?.enabled) {
      console.log('[Sitemap] Client not found');
      return new NextResponse('Client not found', { status: 404 });
    }

    // Get the base URL from the request host
    const host = request.headers.get('host') || '';
    const baseUrl = `https://${host}`;
    console.log('[Sitemap] Base URL:', baseUrl);

    // Fetch articles
    const { articles } = await fetchArticles(clientId, 1, 1000);
    console.log('[Sitemap] Articles found:', articles.length);

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add homepage
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '  </url>\n';
    
    // Add articles - using only publishedAt
    for (const article of articles) {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/${article.slug}</loc>\n`;
      // Use publishedAt only, or fallback to current date if missing
      const articleDate = article.publishedAt ? new Date(article.publishedAt) : new Date();
      xml += `    <lastmod>${articleDate.toISOString()}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';

    console.log('[Sitemap] Generated XML length:', xml.length);
    console.log('[Sitemap] First article slug:', articles[0]?.slug);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[Sitemap] Error:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}