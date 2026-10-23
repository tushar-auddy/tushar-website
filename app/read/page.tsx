import { LocalReader } from '@/components/reader';
import type { Metadata } from 'next';
import { Suspense } from 'react';
export const metadata: Metadata={title:'Your story',robots:{index:true,follow:true}};
export default function ReadPage(){return <main id="main"><Suspense fallback={<div className="not-found" role="status"><p>Opening your story…</p></div>}><LocalReader/></Suspense></main>;}
