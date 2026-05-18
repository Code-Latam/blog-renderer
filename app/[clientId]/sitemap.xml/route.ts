import { NextRequest, NextResponse } from 'next/server';
import { fetchArticles, getClientById } from '@/lib/api';

export const revalidate = 3600; // Revalidate every hour

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const { clientId } = params;

  try {
    // Get client info to determine the base URL
    const client = await getClientById(clientId);
    if (!client || !client.blog?.enabled) {
      return new NextResponse('Client not found', { status: 404 });
    }

    // Determine the base URL for this client's blog
    let baseUrl: string;
    if (client.blog?.ssrCustomDomain) {
      baseUrl = `https://${client.blog.ssrCustomDomain}`;
    } else if (client.blog?.ssrSubdomain) {
      baseUrl = `https://${client.blog.ssrSubdomain}.meetingmaker.tech`;
    } else {
      return new NextResponse('Blog URL not configured', { status: 400 });
    }

    // Fetch all published articles for this client
    const { articles, total } = await fetchArticles(clientId, 1, 1000);

    // Build the sitemap XML
    const urls = [
      // Blog homepage
      {
        loc: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0,
      },
      // All articles
      ...articles.map((article: any) => ({
        loc: `${baseUrl}/${article.slug}`,
        lastmod: new Date(article.updatedAt || article.publishedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      })),
    ];

    const sitemapXml = generateSitemapXml(urls);

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

function generateSitemapXml(urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: number }>): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}