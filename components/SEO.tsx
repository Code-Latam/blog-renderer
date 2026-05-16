import { Article } from '@/lib/types';

interface SEOProps {
  article?: Article;
  blogTitle: string;
  clientId: string;
  isHomepage?: boolean;
}

export function SEO({ article, blogTitle, clientId, isHomepage = false }: SEOProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blog-renderer.vercel.app';
  
  let title = blogTitle;
  let description = `Blog about industry insights`;
  let url = `${baseUrl}/${clientId}`;
  let image = '';

  if (article && !isHomepage) {
    title = article.seo?.metaTitle || article.title;
    description = article.seo?.metaDescription || article.excerpt;
    url = `${baseUrl}/${clientId}/${article.slug}`;
    image = article.featuredImage || '';
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={isHomepage ? 'website' : 'article'} />
      <meta property="og:site_name" content={blogTitle} />
      {image && <meta property="og:image" content={image} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
      <link rel="canonical" href={url} />
    </>
  );
}