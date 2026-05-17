import { Article, ApiResponse, ClientInfo } from './types';


const API_BASE = process.env.API_BASE_URL || 'https://api.meetingmaker.tech';
const SERVICE_API_KEY = process.env.SERVICE_API_KEY;


export async function getClientByDomain(host: string): Promise<ClientInfo | null> {
  try {
    const response = await fetch(
      `${API_BASE}/blog/ssr/client/by-domain/${host}`,
      {
        headers: {
          'X-Service-API-Key': SERVICE_API_KEY!,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error(`Failed to lookup domain ${host}:`, error);
    return null;
  }
}

export async function fetchArticles(clientId: string, page: number = 1, limit: number = 10): Promise<ApiResponse> {
  try {
    const url = `${API_BASE}/blog/ssr/articles?clientId=${clientId}&page=${page}&limit=${limit}`;
    console.log('[fetchArticles] URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'X-Service-API-Key': SERVICE_API_KEY!,
        'Content-Type': 'application/json',
      },
    });

    console.log('[fetchArticles] Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Failed to fetch articles for client ${clientId}:`, error);
    return { 
      articles: [], 
      total: 0, 
      pagination: { page: 1, limit: 10, totalPages: 0 }, 
      settings: { title: 'Blog', layout: 'grid' } 
    };
  }
}

export async function fetchArticle(clientId: string, slug: string): Promise<Article | null> {
  try {
    const url = `${API_BASE}/blog/ssr/articles?clientId=${clientId}&slug=${slug}`;
    console.log('[fetchArticle] URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'X-Service-API-Key': SERVICE_API_KEY!,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.article;
  } catch (error) {
    console.error(`Failed to fetch article ${slug}:`, error);
    return null;
  }
}