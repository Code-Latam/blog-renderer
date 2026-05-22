import { fetchArticle } from '@/lib/api';
import { BlogLayout } from '@/components/BlogLayout';
import { ArticleContent } from '@/components/ArticleContent';
import { SEO } from '@/components/SEO';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60;

interface PageProps {
  params: {
    clientId: string;
    slug: string;
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { clientId, slug } = params;
  const article = await fetchArticle(clientId, slug);

  if (!article) {
    notFound();
  }

  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <SEO article={article} blogTitle={article.title} clientId={clientId} />
      <BlogLayout blogTitle={article.title} clientId={clientId}>
        <div className="mm-article-container">
          <Link href={`/${clientId}`} className="mm-back-button">
            ← Back to all articles
          </Link>
          
          {article.featuredImage && (
            <figure style={{ margin: 0 }}>
              <img
                src={article.featuredImage}
                alt={article.title}
                style={{ 
                  width: '100%', 
                  maxHeight: '400px', 
                  objectFit: 'cover', 
                  borderRadius: '8px', 
                  marginBottom: '0.5rem' 
                }}
              />
              {article.featuredImageAttribution && (
                <figcaption 
                  style={{ 
                    fontSize: '0.75rem', 
                    color: '#666', 
                    textAlign: 'right',
                    marginBottom: '1rem'
                  }}
                  dangerouslySetInnerHTML={{ __html: article.featuredImageAttribution }}
                />
              )}
            </figure>
          )}
          
          <h1>{article.title}</h1>
          
          <div style={{ color: '#666', marginBottom: '2rem', fontSize: '0.875rem' }}>
            <span>📅 {publishedDate}</span>
            <span style={{ marginLeft: '1rem' }}>📖 {article.readTime} min read</span>
          </div>
          
          <ArticleContent content={article.content} />
        </div>
      </BlogLayout>
    </>
  );
}