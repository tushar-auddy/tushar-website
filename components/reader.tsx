'use client';
import { fetchPublishedArticles, type OnlineArticle } from '@/lib/content';
import { PortableBody } from './portable-body';
import { ArticleSeo } from './article-seo';
import { assetPath } from '@/lib/site';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePageScroll } from '@/lib/use-page-scroll';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Check, Share2 } from 'lucide-react';
import { type Article, articles, formatDate, getLocalArticles } from '@/lib/articles';
import { RelatedArticles } from './related-articles';
import { ArticleContents, ArticleFaq } from './article-extras';

export function ArticleBody({body}: {body: string}) {
 return <div className="reading-body">{body.split(/\n\s*\n/).filter(Boolean).map((block,i)=>block.startsWith('### ')?<h3 id={`section-${i}`} key={i}>{block.slice(4)}</h3>:block.startsWith('## ')?<h2 id={`section-${i}`} key={i}>{block.slice(3)}</h2>:block.startsWith('# ')?<h2 id={`section-${i}`} key={i}>{block.slice(2)}</h2>:<p key={i}>{block.split('\n').map((line,n)=><span key={n}>{n>0&&<br/>}{line}</span>)}</p>)}</div>;
}
export function Reader({article, localOnly = false}: {article: OnlineArticle; localOnly?: boolean}) {
 const shareTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(shareTimer.current)clearTimeout(shareTimer.current);},[]);
 const progressRef=useRef<HTMLDivElement>(null); const [copied,setCopied]=useState(false); const [shareError,setShareError]=useState('');
 usePageScroll(useCallback((progress)=>{if(progressRef.current)progressRef.current.style.transform=`scaleX(${progress})`;},[]));
 const share=async()=>{try{await navigator.clipboard.writeText(window.location.href);setCopied(true);setShareError('');if(shareTimer.current)clearTimeout(shareTimer.current);shareTimer.current=setTimeout(()=>setCopied(false),2500);}catch{setShareError('Copy the link from your browser’s address bar to share this story.');}};
 return <><ArticleSeo article={article}/><div ref={progressRef} className="reading-progress" aria-hidden="true"/><article><header className="reading-header"><Link className="back-link" href="/journal/"><ArrowLeft size={15}/> Back to the journal</Link><div className="eyebrow">{article.category.toUpperCase()}</div><h1>{article.title}</h1><p className="reading-deck">{article.excerpt}</p><div className="reading-byline"><span className="author-monogram">ta.</span><div><strong>Tushar Auddy</strong><span>{formatDate(article.date)} · {article.readTime}</span></div><button className="text-link" onClick={share}>{copied?<Check size={14}/>:<Share2 size={14}/>} {copied?'Link copied':'Share story'}</button></div>{shareError&&<p className="share-status" role="status">{shareError}</p>}</header><img className="reading-cover" src={assetPath(article.image || '/images/writing.jpg')} alt={article.imageAlt || `Illustration for ${article.title}`}/><div className="reading-body" style={{paddingBottom:0}}>{article.sample&&<div className="sample-notice">An illustrative starter article created for this portfolio. It is not a previously published clip or a verified article by Tushar Auddy.</div>}{localOnly&&<div className="sample-notice">Published on this device from the writing room. This post is stored in this browser and is not visible to other visitors.</div>}</div><ArticleContents article={article}/>{article.portableBody ? <PortableBody blocks={article.portableBody}/> : <ArticleBody body={article.body}/>}<ArticleFaq article={article}/><div className="reading-end">✳</div></article><RelatedArticles article={article}/></>;
}
export function LocalReader(){
 const slug=useSearchParams().get('story');
 const [article,setArticle]=useState<OnlineArticle|null>(null);const [ready,setReady]=useState(false);const [error,setError]=useState(false);
 useEffect(()=>{const controller=new AbortController();setReady(false);setError(false);if(!slug){setArticle(null);setReady(true);return()=>controller.abort();}fetchPublishedArticles(controller.signal).then(items=>{setArticle(items.find(a=>a.slug===slug)||getLocalArticles().find(a=>a.slug===slug&&a.status==='published')||null);setReady(true);}).catch(e=>{if(e.name==='AbortError')return;const local=getLocalArticles().find(a=>a.slug===slug&&a.status==='published');setArticle(local||null);setError(!local);setReady(true);});return()=>controller.abort();},[slug]);
 if(!ready)return <div className="not-found" role="status"><p>Opening your story…</p></div>;
 if(!article)return <div className="not-found"><meta name="robots" content="noindex,follow"/><h1>{error?'Unable to load this story.':'This story is still being written.'}</h1><p>{error?'Please check your connection and try again.':'It may be a draft, or the link may have changed.'}</p>{error&&<button className="primary-button" onClick={()=>window.location.reload()}>Try again</button>}<Link className="text-link" href="/journal/">Explore the journal <ArrowUpRight size={17}/></Link></div>;
 return <Reader article={article} localOnly={!article.online}/>;
}
