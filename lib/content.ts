import { categories, type Article } from './articles';
import { contentProject } from './content-project';

export type TextBlock = { _key: string; _type: string; style?: string; listItem?: string; children?: { _key: string; text: string; marks?: string[] }[]; markDefs?: { _key: string; _type: string; href?: string }[] };
export type ArticleSeo = { title?: string; description?: string; image?: string; socialTitle?: string; socialDescription?: string; canonicalUrl?: string; noIndex?: boolean };
export type ArticleExtras = { faq?: { _key: string; question: string; answer: string }[]; keywords?: { focus?: string; related?: string[] }; schema?: { type?: 'Article' | 'BlogPosting' | 'NewsArticle'; includeFaq?: boolean; customJson?: string }; modifiedAt?: string };
export type OnlineArticle = Article & ArticleExtras & { portableBody?: TextBlock[]; online?: boolean; seo?: ArticleSeo };

export async function fetchPublishedArticles(signal?: AbortSignal): Promise<OnlineArticle[]> {
  if (!contentProject.projectId) return [];
  const query = '*[_type == "article" && !(_id in path("drafts.**")) && defined(slug.current)] | order(publishedAt desc){title,"slug":slug.current,excerpt,category,publishedAt,body,faq,keywords,schema,"modifiedAt":_updatedAt,"image":cover.asset->url,"seo":seo{title,description,socialTitle,socialDescription,canonicalUrl,noIndex,"image":image.asset->url}}';
  const url = new URL(`https://${contentProject.projectId}.api.sanity.io/v2026-10-01/data/query/${contentProject.dataset}`);
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', 'published');
  const response = await fetch(url, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error('The journal could not connect. Please try again.');
  const data = await response.json();
  return (data.result || []).map((doc: ArticleExtras & {title: string; slug: string; excerpt?: string; category: Article['category']; publishedAt?: string; body?: TextBlock[]; image?: string; seo?: ArticleSeo}) => {
    const body = (doc.body || []).map(block => (block.children || []).map(child => child.text).join('')).join('\n\n');
    return { title: doc.title, slug: doc.slug, excerpt: doc.excerpt || '', category: categories.includes(doc.category) ? doc.category : 'Personal notes', date: doc.publishedAt || new Date().toISOString(), image: doc.image || '/images/writing.jpg', body, portableBody: doc.body, online: true, seo: doc.seo, faq: doc.faq, keywords: doc.keywords, schema: doc.schema, modifiedAt: doc.modifiedAt, readTime: `${Math.max(1, Math.ceil(body.split(/\s+/).length / 200))} min read`, status: 'published' };
  });
}

