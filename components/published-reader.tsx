'use client';
import { useEffect, useState } from 'react';
import { fetchPublishedArticles, type OnlineArticle } from '@/lib/content';
import { Reader } from './reader';

export function PublishedReader({ initialArticle }: { initialArticle: OnlineArticle }) {
 const [article, setArticle] = useState(initialArticle);
 useEffect(() => {
  const controller = new AbortController();
  fetchPublishedArticles(controller.signal).then(items => {
   const current = items.find(item => item.slug === initialArticle.slug);
   if (current) setArticle(current);
  }).catch(() => {});
  return () => controller.abort();
 }, [initialArticle.slug]);
 return <Reader article={article}/>;
}
