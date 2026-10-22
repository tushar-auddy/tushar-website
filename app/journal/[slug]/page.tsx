import { assetPath, siteUrl } from '@/lib/site';
import { articles } from '@/lib/articles';
import { Reader } from '@/components/reader';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
export const dynamicParams = false;
export function generateStaticParams(){return articles.map(a=>({slug:a.slug}));}
export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata>{const {slug}=await params;const article=articles.find(a=>a.slug===slug);return {title: article?.title || 'Story not found',description:article?.excerpt,openGraph:{type:'article',images:[new URL(assetPath(article?.image || '/images/writing.jpg'), new URL(siteUrl).origin).href]}};}
export default async function ArticlePage({params}: {params: Promise<{slug:string}>}){const {slug}=await params;const article=articles.find(a=>a.slug===slug);if(!article)notFound();return <main id="main"><Reader article={article}/></main>;}
