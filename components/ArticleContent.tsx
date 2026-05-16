'use client';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div 
      className="mm-article-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}