import { Journal } from '@/components/journal';
import { Contact } from '@/components/chrome';
import type { Metadata } from 'next';
export const metadata: Metadata = {title: 'The journal', description: 'Thoughts on politics, lifestyle, entertainment, and the everyday. Explore the personal journal of Tushar Auddy.'};
export default function JournalPage(){return <main id="main"><Journal full/><Contact/></main>;}
