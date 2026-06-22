import { fetchArticles, getClientById } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';
import { BlogLayout } from '@/components/BlogLayout';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    clientId: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientId } = params;
  
  try {
    const client = await getClientById(clientId);
    
    return {
      title: client?.blog?.title || 'Blog',
      description: `Read Startup articles dealing with AI, LinkedIn outreach automation, and sales technology. Learn how to book more sales meetings and grow your business with the latest tools and strategies from ${client?.name}|| 'our blog'}`,
      alternates: {
          canonical: `/${clientId}`,  // ← ADD THIS LINE
        },
    };
  } catch (error) {
    return {
      title: 'Blog',
      description: 'Read our latest articles',
      alternates: {
        canonical: `/${clientId}`,  // ← ADD THIS LINE
      },
    };
  }
}

export default async function BlogHome({ params, searchParams }: PageProps) {
  const clientId = params.clientId;
  const page = parseInt(searchParams.page || '1');

  console.log('[BlogHome] Starting render for clientId:', clientId);
  console.log('[BlogHome] API_BASE_URL:', process.env.API_BASE_URL);
  console.log('[BlogHome] SERVICE_API_KEY exists:', !!process.env.SERVICE_API_KEY);

  const { articles, pagination, settings } = await fetchArticles(clientId, page);

  if (!articles && page === 1) {
    notFound();
  }

  const layout = settings.layout || 'grid';
  const layoutClass = layout === 'grid' ? 'mm-articles-grid' : 'mm-articles-list';

  return (
    <>
      <BlogLayout blogTitle={settings.title} clientId={clientId}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No articles yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className={layoutClass}>
              {articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  clientId={clientId}
                  layout={layout}
                />
              ))}
            </div>
            
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                {pagination.page > 1 && (
                  <a href={`?page=${pagination.page - 1}`} className="mm-read-more">
                    ← Previous
                  </a>
                )}
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                {pagination.page < pagination.totalPages && (
                  <a href={`?page=${pagination.page + 1}`} className="mm-read-more">
                    Next →
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </BlogLayout>
    </>
  );
}