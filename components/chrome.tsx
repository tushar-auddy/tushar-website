'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowUp, Menu, X, Linkedin, Feather } from 'lucide-react';

export function Header() {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState('');
  const [compact, setCompact] = useState(false);
  const path = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;
      // Separate thresholds prevent the changing header height from making it flicker.
      setCompact(previous => previous ? scrollY > 24 : scrollY > 96);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuRef.current?.focus(); }
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const close = (nextHash = '') => { setOpen(false); setHash(nextHash); };
  const homeActive = path === '/' && hash !== '#about';
  const aboutActive = path === '/' && hash === '#about';
  const journalActive = path.startsWith('/journal') || path.startsWith('/read');

  return <header className={`header restored-header${compact ? ' header-compact' : ''}`} ref={headerRef}>
    <div className="container nav-inner">
      <Link href="/" className="header-brand" aria-label="Tushar Auddy — home" onClick={() => close()}>
        <span className="brand-monogram" aria-hidden="true">ta<span>.</span><span className="monogram-corner"/></span>
        <span className="wordmark">Tushar Auddy<span>.</span></span>
      </Link>
      <button className="menu-toggle icon-button" ref={menuRef} onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="primary-navigation">{open ? <X size={23}/> : <Menu size={23}/>}</button>
      <nav className={open ? 'navigation open' : 'navigation'} id="primary-navigation" aria-label="Main navigation">
        <Link href="/" className={homeActive ? 'active' : ''} aria-current={homeActive ? 'page' : undefined} onClick={() => close()}>Home</Link>
        <Link href="/#about" className={aboutActive ? 'active' : ''} aria-current={aboutActive ? 'location' : undefined} onClick={() => close('#about')}>About me</Link>
        <Link href="/journal/" className={journalActive ? 'active' : ''} aria-current={journalActive ? 'page' : undefined} onClick={() => close()}>The journal</Link>
        <a className="nav-contact" href="mailto:auddytushar@gmail.com" onClick={() => close()}>Let’s talk <ArrowUpRight size={17}/></a>
      </nav>
    </div>
  </header>;
}
export function Footer() {
  return <footer><div className="container footer-top"><div><Link className="wordmark" href="/">Tushar Auddy<span>.</span></Link><p>Always curious. Always a story to tell.</p></div><div className="footer-links"><a href="https://www.linkedin.com/in/tushar-auddy/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15}/></a><a href="mailto:auddytushar@gmail.com">Email <ArrowUpRight size={15}/></a><Link href="/studio/"><Feather size={14}/> Writing room</Link></div></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} Tushar Auddy. Written with intention.</p><a href="#top" onClick={e => {e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'});}}>Back to top <ArrowUp size={14}/></a></div></footer>;
}
export function Contact() {
  return <section className="contact-section" id="contact"><div className="container contact-inner"><div><div className="eyebrow light"><span/> A GOOD STORY STARTS WITH A CONVERSATION</div><h2>Have something in mind?<br/>Let’s find the right <em>words.</em></h2><p>For writing opportunities, collaborations, or just a thoughtful hello.</p></div><a className="contact-circle" href="mailto:auddytushar@gmail.com" aria-label="Email Tushar Auddy"><ArrowUpRight size={37} strokeWidth={1.3}/></a><a className="contact-email" href="mailto:auddytushar@gmail.com">auddytushar@gmail.com <ArrowUpRight size={17}/></a></div></section>;
}
