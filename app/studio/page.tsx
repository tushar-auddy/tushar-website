import { Studio } from '@/components/studio';
import type { Metadata } from 'next';
export const metadata: Metadata={title:'The writing room',description:'A quiet place to draft your next story. Save drafts locally and export your writing as Markdown.',robots:{index:false,follow:false}};
export default function StudioPage(){return <main id="main"><Studio/></main>;}
