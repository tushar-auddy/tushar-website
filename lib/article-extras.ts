import type { OnlineArticle } from './content';

export function articleHeadings(article: OnlineArticle) {
 if (article.portableBody) return article.portableBody.filter(b => b._type === 'block' && (b.style === 'h2' || b.style === 'h3')).map(b => ({ id: `section-${b._key}`, title: (b.children || []).map(c => c.text).join(''), level: b.style === 'h3' ? 3 : 2 }));
 return article.body.split(/\n\s*\n/).filter(Boolean).flatMap((block, index) => /^#{1,3} /.test(block) ? [{ id: `section-${index}`, title: block.replace(/^#{1,3} /, ''), level: block.startsWith('### ') ? 3 : 2 }] : []);
}
export function relatedArticles(article: OnlineArticle, candidates: OnlineArticle[]) {
 const topics = (a: OnlineArticle) => new Set([a.keywords?.focus, ...(a.keywords?.related || [])].filter((v): v is string => Boolean(v?.trim())).map(v => v.trim().toLowerCase()));
 const current = topics(article);
 const unique = [...new Map(candidates.map(a => [a.slug, a])).values()].filter(a => a.slug !== article.slug);
 const score = (a: OnlineArticle) => (a.category === article.category ? 3 : 0) + [...topics(a)].filter(t => current.has(t)).length * 2;
 return unique.sort((a,b) => score(b) - score(a) || b.date.localeCompare(a.date)).slice(0,3);
}
