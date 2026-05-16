import { fetchArticles } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';
import { BlogLayout } from '@/components/BlogLayout';
import { SEO } from '@/components/SEO';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface PageProps {
  params: {
    clientId: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function BlogHome({ params, searchParams }: PageProps) {
  const clientId = params.clientId;
  const page = parseInt(searchParams.page || '1');
  const { articles, pagination, settings } = await fetchArticles(clientId, page);

  if (!articles && page === 1) {
    notFound();
  }

  const layout = settings.layout || 'grid';
  const layoutClass = layout === 'grid' ? 'mm-articles-grid' : 'mm-articles-list';

  return (
    <>
      <SEO blogTitle={settings.title} clientId={clientId} isHomepage={true} />
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