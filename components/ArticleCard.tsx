import Link from 'next/link';
import { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
  clientId: string;
  layout: 'grid' | 'list';
}

export function ArticleCard({ article, clientId, layout }: ArticleCardProps) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const articleUrl = `/${clientId}/${article.slug}`;

  if (layout === 'list') {
    return (
      <article className="mm-blog-post mm-list-post">
        {article.featuredImage && (
          <div className="mm-post-image">
            <img src={article.featuredImage} alt={article.title} loading="lazy" />
          </div>
        )}
        <div className="mm-post-content">
          <h2 className="mm-post-title">
            <Link href={articleUrl}>{article.title}</Link>
          </h2>
          <div className="mm-post-meta">
            <span>📅 {publishedDate}</span>
            <span>📖 {article.readTime} min read</span>
          </div>
          <p className="mm-post-excerpt">{article.excerpt}...</p>
          <Link href={articleUrl} className="mm-read-more">
            Read more →
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="mm-blog-post mm-grid-post">
      {article.featuredImage && (
        <div className="mm-post-image">
          <img src={article.featuredImage} alt={article.title} loading="lazy" />
          {article.featuredImageAttribution && (
              <div className="mm-image-attribution" dangerouslySetInnerHTML={{ __html: article.featuredImageAttribution }} />
            )}
        </div>
      )}
      <div className="mm-post-content">
        <h2 className="mm-post-title">
          <Link href={articleUrl}>{article.title}</Link>
        </h2>
        <div className="mm-post-meta">
          <span>📅 {publishedDate}</span>
          <span>📖 {article.readTime} min read</span>
        </div>
        <p className="mm-post-excerpt">{article.excerpt}...</p>
        <Link href={articleUrl} className="mm-read-more">
          Read more →
        </Link>
      </div>
    </article>
  );
}