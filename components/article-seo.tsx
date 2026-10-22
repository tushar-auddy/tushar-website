'use client';
import { useEffect } from 'react';
import type { OnlineArticle } from '@/lib/content';
import { assetPath } from '@/lib/site';
import { articleSchema } from '@/lib/article-schema';

// Online articles load in the browser because this site uses static GitHub Pages hosting.
export function ArticleSeo({ article }: { article: OnlineArticle }) {
 useEffect(() => {
  if (!article.online) return;
  const originalTitle = document.title;
  const title = article.seo?.title?.trim() || `${article.title} | Tushar Auddy`;
  const description = article.seo?.description?.trim() || article.excerpt;
  const image = new URL(assetPath(article.seo?.image || article.image), window.location.origin).href;
  const canonical = new URL(window.location.pathname, window.location.origin);
  if (window.location.pathname.replace(/\/$/,'').endsWith('/read')) canonical.searchParams.set('story', article.slug);
  if (article.seo?.canonicalUrl && /^https?:\/\//i.test(article.seo.canonicalUrl)) canonical.href = article.seo.canonicalUrl;
  const socialTitle = article.seo?.socialTitle?.trim() || title;
  const socialDescription = article.seo?.socialDescription?.trim() || description;
  const restore: (() => void)[] = [];
  document.title = title;
  const meta = (attribute: 'name' | 'property', key: string, content: string) => {
   let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
   const existing = element;
   const previous = element?.getAttribute('content');
   if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.appendChild(element); }
   element.setAttribute('content', content);
   const target = element;
   restore.push(() => { if (!existing) target.remove(); else if (previous === null || previous === undefined) target.removeAttribute('content'); else target.setAttribute('content', previous); });
  };
  meta('name', 'description', description);
  meta('name', 'robots', article.seo?.noIndex ? 'noindex, follow' : 'index, follow');
  meta('property', 'og:title', socialTitle);
  meta('property', 'og:description', socialDescription);
  meta('property', 'og:image', image);
  meta('property', 'og:type', 'article');
  meta('property', 'og:url', canonical.href);
  meta('name', 'twitter:card', 'summary_large_image');
  meta('name', 'twitter:title', socialTitle);
  meta('name', 'twitter:description', socialDescription);
  meta('name', 'twitter:image', image);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const existingLink = link; const previousHref = link?.getAttribute('href');
  if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
  link.href = canonical.href;
  const targetLink = link;
  const existingSchema = document.querySelector<HTMLScriptElement>('#article-structured-data');
  const previousSchema = existingSchema?.textContent;
  const schema = existingSchema || document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify(articleSchema(article, canonical.href, image)).replace(/</g, '\\u003c');
  document.head.appendChild(schema);
  return () => {
   if (existingSchema) schema.textContent = previousSchema || ''; else schema.remove();
   document.title = originalTitle;
   restore.forEach(fn => fn());
   if (!existingLink) targetLink.remove(); else if (previousHref != null) targetLink.setAttribute('href', previousHref); else targetLink.removeAttribute('href');
  };
 }, [article]);
 return null;
}

