import { fetchArticle, fetchRandomArticles } from '@/lib/api';
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

  // Fetch 10 random related articles (excluding current one)
  const relatedArticles = await fetchRandomArticles(clientId, slug, 10);

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
          
          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div style={{ 
              marginTop: '3rem', 
              borderTop: '1px solid #eaeaea', 
              paddingTop: '2rem' 
            }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Related Articles</h3>
              <div style={{ 
                display: 'grid', 
                gap: '1.5rem',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
              }}>
                {relatedArticles.map((relatedArticle) => (
                  <Link 
                    key={relatedArticle.slug} 
                    href={`/${clientId}/${relatedArticle.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{ 
                      padding: '1rem', 
                      border: '1px solid #eaeaea', 
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      height: '100%',
                      backgroundColor: '#fff'
                    }}>
                      {relatedArticle.featuredImage && (
                        <img 
                          src={relatedArticle.featuredImage} 
                          alt={relatedArticle.title}
                          style={{
                            width: '100%',
                            height: '160px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginBottom: '0.75rem'
                          }}
                        />
                      )}
                      <h4 style={{ 
                        margin: '0 0 0.5rem 0', 
                        fontSize: '1rem',
                        fontWeight: '600',
                        lineHeight: '1.4'
                      }}>
                        {relatedArticle.title}
                      </h4>
                      {relatedArticle.excerpt && (
                        <p style={{ 
                          margin: 0, 
                          color: '#666', 
                          fontSize: '0.875rem',
                          lineHeight: '1.5'
                        }}>
                          {relatedArticle.excerpt.length > 120 
                            ? relatedArticle.excerpt.substring(0, 120) + '...' 
                            : relatedArticle.excerpt}
                        </p>
                      )}
                      <div style={{ 
                        marginTop: '0.75rem', 
                        fontSize: '0.875rem', 
                        color: '#0070f3',
                        fontWeight: '500'
                      }}>
                        Read more →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </BlogLayout>
    </>
  );
}