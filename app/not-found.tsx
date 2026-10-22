import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export default function NotFound(){return <main id="main" className="not-found"><div className="eyebrow" style={{justifyContent:'center'}}>404 · A SMALL DETOUR</div><h1>Not every path<br/>leads to a <em>story.</em></h1><p>Let’s get you back to the ones that do.</p><Link href="/journal/" className="primary-button">Back to the journal <ArrowUpRight size={17}/></Link></main>;}
