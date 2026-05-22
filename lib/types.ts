export interface Article {
  _id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string | null;
  featuredImageAttribution: string | null;
  publishedAt: string;
  readTime: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface ClientInfo {
  clientId: string;
  blogTitle: string;
  layout: 'grid' | 'list';
}

export interface ApiResponse {
  articles: Article[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  settings: {
    title: string;
    layout: 'grid' | 'list';
  };
}