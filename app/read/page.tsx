import { LocalReader } from '@/components/reader';
import type { Metadata } from 'next';
export const metadata: Metadata={title:'Your story',robots:{index:false,follow:false}};
export default function ReadPage(){return <main id="main"><LocalReader/></main>;}
