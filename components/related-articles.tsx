'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { articles } from '@/lib/articles';
import { relatedArticles } from '@/lib/article-extras';
import { fetchPublishedArticles, type OnlineArticle } from '@/lib/content';
import { ArticleCard } from './journal';

export function RelatedArticles({ article }: { article: OnlineArticle }) {
 const [candidates, setCandidates] = useState<OnlineArticle[]>(article.online ? [] : articles);
 useEffect(() => {
  const controller = new AbortController();
  fetchPublishedArticles(controller.signal).then(remote => setCandidates(remote.length ? remote : article.online ? [] : articles)).catch(() => {});
  return () => controller.abort();
 }, [article.online]);
 const related = relatedArticles(article, candidates);
 if (!related.length) return null;
 return <section className="related-stories"><div className="container"><div className="section-heading"><h2>A little more to <em>explore.</em></h2><Link className="text-link" href="/journal/">All stories <ArrowUpRight size={16}/></Link></div><div className="article-grid">{related.map((a,i)=><ArticleCard key={a.slug} article={a} index={i}/>)}</div></div></section>;
}
