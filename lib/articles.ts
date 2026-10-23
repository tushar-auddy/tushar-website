import publishedArticles from './published-articles.json';
import type { OnlineArticle } from './content';
export type Category = 'Politics' | 'Lifestyle' | 'Entertainment' | 'Personal notes';
export type Article = { slug: string; title: string; excerpt: string; category: Category; image: string; imageAlt?: string; date: string; readTime: string; body: string; sample?: boolean; status?: 'draft' | 'published' };
export const categories: Category[] = ['Politics', 'Lifestyle', 'Entertainment', 'Personal notes'];
export const articles = (publishedArticles as OnlineArticle[]).slice().sort((a,b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
export const storageKey = 'tushar-writing-room-v1';
export function getLocalArticles(): Article[] {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(value) ? value.filter((v: Article) => v && typeof v.slug === 'string' && typeof v.title === 'string' && typeof v.body === 'string' && typeof v.category === 'string').map(v => ({ ...v, category: categories.includes(v.category) ? v.category : 'Personal notes', excerpt: typeof v.excerpt === 'string' ? v.excerpt : '', date: typeof v.date === 'string' ? v.date : '', image: typeof v.image === 'string' ? v.image : '/images/writing.jpg', readTime: typeof v.readTime === 'string' ? v.readTime : `${Math.max(1,Math.ceil(v.body.trim().split(/\s+/).length/200))} min read`, status: v.status === 'published' ? 'published' : 'draft' })) : [];
  } catch { return []; }
}
export function formatDate(date: string) { if (!date) return 'Date unavailable'; const parsed = new Date(date.includes('T') ? date : `${date}T12:00:00Z`); return Number.isNaN(parsed.getTime()) ? 'Date unavailable' : parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }); }

