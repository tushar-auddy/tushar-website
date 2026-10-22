import { LocalReader } from '@/components/reader';
import type { Metadata } from 'next';
export const metadata: Metadata={title:'Your story',robots:{index:true,follow:true}};
export default function ReadPage(){return <main id="main"><LocalReader/></main>;}
