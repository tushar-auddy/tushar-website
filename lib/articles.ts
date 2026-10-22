import publishedArticles from './published-articles.json';
import type { OnlineArticle } from './content';
export type Category = 'Politics' | 'Lifestyle' | 'Entertainment' | 'Personal notes';
export type Article = { slug: string; title: string; excerpt: string; category: Category; image: string; imageAlt?: string; date: string; readTime: string; body: string; sample?: boolean; status?: 'draft' | 'published' };
export const categories: Category[] = ['Politics', 'Lifestyle', 'Entertainment', 'Personal notes'];
export const articles = publishedArticles as OnlineArticle[];
export const storageKey = 'tushar-writing-room-v1';
export function getLocalArticles(): Article[] {
  try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(value) ? value.filter((v: Article) => v && typeof v.slug === 'string' && typeof v.title === 'string' && typeof v.body === 'string' && categories.includes(v.category)) : []; } catch { return []; }
}
export function formatDate(date: string) { return new Date(date.includes('T') ? date : `${date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }

