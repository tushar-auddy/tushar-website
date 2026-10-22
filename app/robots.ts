import { siteUrl, basePath } from '@/lib/site';
import type { MetadataRoute } from 'next';
export const dynamic='force-static';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:[`${basePath}/studio/`,`${basePath}/read/`]},sitemap:`${siteUrl}/sitemap.xml`};}
