import type { OnlineArticle } from './content';

export function articleSchema(article: OnlineArticle, url: string, image: string): Record<string, unknown>[] {
 const type = ['Article', 'BlogPosting', 'NewsArticle'].includes(article.schema?.type || '') ? article.schema!.type : 'BlogPosting';
 const result: Record<string, unknown>[] = [{
  '@context': 'https://schema.org', '@type': type, '@id': `${url}#article`,
  headline: article.title, description: article.seo?.description || article.excerpt,
  mainEntityOfPage: url, image: [image], datePublished: article.date,
  dateModified: article.modifiedAt || article.date,
  author: { '@type': 'Person', name: 'Tushar Auddy', url: 'https://www.linkedin.com/in/tushar-auddy/' },
  articleSection: article.category,
  keywords: [article.keywords?.focus, ...(article.keywords?.related || [])].filter(Boolean).join(', '),
 }];
 const faq = article.faq?.filter(item => item.question?.trim() && item.answer?.trim());
 if (article.schema?.includeFaq && faq?.length) result.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) });
 if (article.schema?.customJson) {
  try {
   const custom: unknown = JSON.parse(article.schema.customJson);
   for (const item of Array.isArray(custom) ? custom : [custom]) {
    if (item && typeof item === 'object' && !Array.isArray(item) && (item['@type'] || item['@graph'])) result.push({ ...item, '@context': 'https://schema.org' });
   }
  } catch { /* Invalid legacy data must not break the article. Studio validates new input. */ }
 }
 return result;
}
