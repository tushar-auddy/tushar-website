import { siteUrl } from '@/lib/site';
import type { MetadataRoute } from 'next';
import { articles } from '@/lib/articles';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{const base=siteUrl;return [{url:base,priority:1},{url:`${base}/journal/`,priority:0.8},...articles.map(a=>({url:`${base}/journal/${a.slug}/`,lastModified:a.date,priority:0.6}))];}
