import Link from 'next/link';
import { ArrowUpRight, BookOpen, Home } from 'lucide-react';
import { DinoGame } from '@/components/dino-game';
import './not-found.css';

export default function NotFound() {
  return <main id="main" className="lost-page">
    <div className="container lost-inner">
      <div className="lost-message">
        <p className="lost-code" aria-hidden="true">404</p>
        <div className="eyebrow lost-eyebrow"><span/> ERROR 404 · PAGE NOT FOUND</div>
        <h1>Oops, this page <em>doesn’t exist.</em></h1>
        <p className="lost-lede">The link may be broken, or the page may have been moved or removed.</p>
        <div className="lost-actions">
          <Link href="/" className="primary-button"><Home size={16}/> Back to home</Link>
          <Link href="/journal/" className="outline-button"><BookOpen size={16}/> The journal <ArrowUpRight size={15}/></Link>
        </div>
      </div>
      <div className="lost-game">
        <div className="lost-game-bar"><span className="lost-dots" aria-hidden="true"><i/><i/><i/></span><span>Stuck here? Play a quick round.</span></div>
        <DinoGame/>
        <div className="lost-keys"><span><kbd>Space</kbd> or <kbd>↑</kbd> to jump</span><span><kbd>↓</kbd> to drop faster</span><span className="lost-tap">Tap the game to jump</span></div>
      </div>
    </div>
  </main>;
}
