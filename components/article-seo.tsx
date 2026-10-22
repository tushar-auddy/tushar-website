'use client';
import { useEffect } from 'react';
import type { OnlineArticle } from '@/lib/content';
import { assetPath } from '@/lib/site';

// Online articles load in the browser because this site uses static GitHub Pages hosting.
export function ArticleSeo({ article }: { article: OnlineArticle }) {
 useEffect(() => {
  if (!article.online) return;
  const originalTitle = document.title;
  const title = article.seo?.title?.trim() || `${article.title} | Tushar Auddy`;
  const description = article.seo?.description?.trim() || article.excerpt;
  const image = new URL(assetPath(article.seo?.image || article.image), window.location.origin).href;
  const canonical = new URL(window.location.pathname, window.location.origin);
  canonical.searchParams.set('story', article.slug);
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
  meta('name', 'robots', 'index, follow');
  meta('property', 'og:title', title);
  meta('property', 'og:description', description);
  meta('property', 'og:image', image);
  meta('property', 'og:type', 'article');
  meta('property', 'og:url', canonical.href);
  meta('name', 'twitter:card', 'summary_large_image');
  meta('name', 'twitter:title', title);
  meta('name', 'twitter:description', description);
  meta('name', 'twitter:image', image);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const existingLink = link; const previousHref = link?.getAttribute('href');
  if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
  link.href = canonical.href;
  const targetLink = link;
  return () => {
   document.title = originalTitle;
   restore.forEach(fn => fn());
   if (!existingLink) targetLink.remove(); else if (previousHref != null) targetLink.setAttribute('href', previousHref); else targetLink.removeAttribute('href');
  };
 }, [article]);
 return null;
}
