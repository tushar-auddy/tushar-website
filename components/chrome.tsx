'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePageScroll } from '@/lib/use-page-scroll';
import { ArrowUpRight, ArrowUp, Menu, X, Linkedin, Feather } from 'lucide-react';

export function Header() {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState('');
  const [compact, setCompact] = useState(false);
  const [mobile, setMobile] = useState(false);
  const path = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  usePageScroll(useCallback((_, scrollY) => {
    setCompact(previous => previous ? scrollY > 24 : scrollY > 96);
    setHash(window.location.hash);
  }, []));

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const update = () => { setMobile(media.matches); if (!media.matches) setOpen(false); };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
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
    const onPointer = (event: Event) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('focusin', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('focusin', onPointer);
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
      <nav className={open ? 'navigation open' : 'navigation'} inert={mobile && !open} id="primary-navigation" aria-label="Main navigation">
        <Link href="/" className={homeActive ? 'active' : ''} aria-current={homeActive ? 'page' : undefined} onClick={() => close()}>Home</Link>
        <Link href="/#about" className={aboutActive ? 'active' : ''} aria-current={aboutActive ? 'location' : undefined} onClick={() => close('#about')}>About me</Link>
        <Link href="/journal/" className={journalActive ? 'active' : ''} aria-current={journalActive ? 'page' : undefined} onClick={() => close()}>The journal</Link>
        <a className="nav-contact" href="mailto:auddytushar@gmail.com" onClick={() => close()}>Let’s talk <ArrowUpRight size={17}/></a>
      </nav>
    </div>
  </header>;
}
export function ScrollTop() {
  const progressRef = useRef<SVGCircleElement>(null);
  const [visible, setVisible] = useState(false);
  const ring = 2 * Math.PI * 21;
  usePageScroll(useCallback((progress, scrollY) => {
    if (progressRef.current) progressRef.current.style.strokeDashoffset = String(2 * Math.PI * 21 * (1 - progress));
    setVisible(scrollY > 480);
  }, []));

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };
  // Progress ring circumference for r=21.

  return <button type="button" className={`scroll-top${visible ? ' is-visible' : ''}`} onClick={toTop} aria-label="Scroll back to top" tabIndex={visible ? 0 : -1}>
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <circle ref={progressRef} className="scroll-top-progress" cx="22" cy="22" r="21" strokeDasharray={ring} strokeDashoffset={ring}/>
    </svg>
    <ArrowUp size={16} strokeWidth={1.8}/>
  </button>;
}
export function Footer() {
  return <><ScrollTop/><footer className="site-footer">
    <div className="container site-footer-main">
      <div className="site-footer-brand">
        <Link href="/" className="header-brand" aria-label="Tushar Auddy — home">
          <span className="brand-monogram" aria-hidden="true">ta<span>.</span><span className="monogram-corner"/></span>
        </Link>
        <div>
          <p>Always curious. <em>Always a story to tell.</em></p>
          <span className="site-footer-status"><span className="status-dot"/> Open to writing opportunities</span>
        </div>
      </div>
      <a className="site-footer-mail" href="mailto:auddytushar@gmail.com">Let’s talk <span aria-hidden="true"><ArrowUpRight size={18}/></span></a>
    </div>
    <nav className="container site-footer-links" aria-label="Footer">
      <Link href="/journal/">The journal</Link>
      <Link href="/#about">About me</Link>
      <a href="https://www.linkedin.com/in/tushar-auddy/" target="_blank" rel="noopener noreferrer"><Linkedin size={15}/> LinkedIn</a>
      <a href="mailto:auddytushar@gmail.com">auddytushar@gmail.com</a>
      <Link href="/admin/"><Feather size={14}/> Writing room</Link>
    </nav>
    <div className="container site-footer-bottom">
      <p>© {new Date().getFullYear()} Tushar Auddy <span className="site-footer-sep">|</span> Powered by <a className="site-footer-credit" href="https://dcampaign.com" target="_blank" rel="noopener noreferrer">DCampaign Digital</a></p>
      <a href="#top" className="site-footer-top" onClick={e => {e.preventDefault(); window.scrollTo({top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});}}>Back to top <span><ArrowUp size={13}/></span></a>
    </div>
  </footer></>;
}
export function Contact({ light = false }: { light?: boolean }) {
  return <section className={`contact-section${light ? ' contact-light' : ''}`} id="contact"><div className="container contact-inner"><div><div className="eyebrow light"><span/> A GOOD STORY STARTS WITH A CONVERSATION</div><h2>Have something in mind?<br/>Let’s find the right <em>words.</em></h2><p>For writing opportunities, collaborations, or just a thoughtful hello.</p></div><a className="contact-circle" href="mailto:auddytushar@gmail.com" aria-label="Email Tushar Auddy"><ArrowUpRight size={37} strokeWidth={1.3}/></a><a className="contact-email" href="mailto:auddytushar@gmail.com">auddytushar@gmail.com <ArrowUpRight size={17}/></a></div></section>;
}
