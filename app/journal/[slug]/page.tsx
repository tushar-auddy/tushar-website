import { assetPath, siteUrl } from '@/lib/site';
import { articles } from '@/lib/articles';
import { PublishedReader } from '@/components/published-reader';
import { articleSchema } from '@/lib/article-schema';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
export const dynamicParams = false;
export function generateStaticParams(){return articles.map(a=>({slug:a.slug}));}
export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata>{
 const {slug}=await params;const article=articles.find(a=>a.slug===slug);
 if(!article)return {title:'Story not found'};
 const image=new URL(assetPath(article.image),new URL(siteUrl).origin).href;
 const title=article.seo?.title||article.title;const description=article.seo?.description||article.excerpt;
 return {title,description,authors:[{name:'Tushar Auddy'}],alternates:{canonical:`${siteUrl}/journal/${slug}/`},openGraph:{title,description,type:'article',publishedTime:article.date,authors:['Tushar Auddy'],url:`${siteUrl}/journal/${slug}/`,images:[{url:image,alt:article.imageAlt}]},twitter:{card:'summary_large_image',title,description,images:[image]}};
}
export default async function ArticlePage({params}: {params: Promise<{slug:string}>}){
 const {slug}=await params;const article=articles.find(a=>a.slug===slug);if(!article)notFound();
 const image=new URL(assetPath(article.image),new URL(siteUrl).origin).href;
 const schema=JSON.stringify(articleSchema(article,`${siteUrl}/journal/${slug}/`,image)).replace(/</g,'\\u003c');
 return <main id="main"><script id="article-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{__html:schema}}/><PublishedReader initialArticle={article}/></main>;
}
