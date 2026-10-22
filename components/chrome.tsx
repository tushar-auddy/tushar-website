'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, ArrowUp, Menu, X, Linkedin, Feather } from 'lucide-react';

export function Header() {
  const [open, setOpen] = useState(false); const path = usePathname();
  return <header className="header"><div className="container nav-inner"><Link className="wordmark" href="/" onClick={() => setOpen(false)}>tushar auddy<span>.</span></Link><button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>{open ? <X /> : <Menu />}</button><nav className={open ? 'navigation open' : 'navigation'} aria-label="Main navigation"><Link href="/" className={path === '/' ? 'active' : ''} onClick={() => setOpen(false)}>Home</Link><Link href="/#about" onClick={() => setOpen(false)}>About me</Link><Link href="/journal/" className={path.startsWith('/journal') ? 'active' : ''} onClick={() => setOpen(false)}>The journal</Link><a className="nav-contact" href="mailto:auddytushar@gmail.com" onClick={() => setOpen(false)}>Let’s talk <ArrowUpRight size={17}/></a></nav></div></header>;
}
export function Footer() {
  return <footer><div className="container footer-top"><div><Link className="wordmark" href="/">tushar auddy<span>.</span></Link><p>Always curious. Always a story to tell.</p></div><div className="footer-links"><a href="https://www.linkedin.com/in/tushar-auddy/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15}/></a><a href="mailto:auddytushar@gmail.com">Email <ArrowUpRight size={15}/></a><Link href="/studio/"><Feather size={14}/> Writing room</Link></div></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} Tushar Auddy. Written with intention.</p><a href="#top" onClick={e => {e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'});}}>Back to top <ArrowUp size={14}/></a></div></footer>;
}
export function Contact() {
  return <section className="contact-section" id="contact"><div className="container contact-inner"><div><div className="eyebrow light"><span/> A GOOD STORY STARTS WITH A CONVERSATION</div><h2>Have something in mind?<br/>Let’s find the right <em>words.</em></h2><p>For writing opportunities, collaborations, or just a thoughtful hello.</p></div><a className="contact-circle" href="mailto:auddytushar@gmail.com" aria-label="Email Tushar Auddy"><ArrowUpRight size={37} strokeWidth={1.3}/></a><a className="contact-email" href="mailto:auddytushar@gmail.com">auddytushar@gmail.com <ArrowUpRight size={17}/></a></div></section>;
}
