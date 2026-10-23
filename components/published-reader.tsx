'use client';
import { useEffect, useState } from 'react';
import { fetchPublishedArticles, type OnlineArticle } from '@/lib/content';
import { Reader } from './reader';
import Link from 'next/link';

export function PublishedReader({ initialArticle }: { initialArticle: OnlineArticle }) {
 const [article, setArticle] = useState<OnlineArticle|null>(initialArticle);
 useEffect(() => {
  const controller = new AbortController();
  fetchPublishedArticles(controller.signal).then(items => {
   const current = items.find(item => item.slug === initialArticle.slug);
   setArticle(current || null);
  }).catch(() => {});
  return () => controller.abort();
 }, [initialArticle.slug]);
 return article ? <Reader article={article}/> : <section className="not-found"><meta name="robots" content="noindex,follow"/><h1>This story is unavailable.</h1><p>It may have been unpublished or moved.</p><Link className="primary-button" href="/journal/">Back to the journal</Link></section>;
}
