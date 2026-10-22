import type { Metadata } from 'next';
import './globals.css';
import './creative.css';
import './typography.css';
import './header.css';
import { Header, Footer } from '@/components/chrome';
import localFont from 'next/font/local';
import { siteUrl, assetPath } from '@/lib/site';

const outfit = localFont({ src: '../public/fonts/outfit-wght.ttf', variable: '--font-outfit', weight: '100 900', display: 'swap' });
const editorial = localFont({ src: [
  { path: '../public/fonts/font-7.ttf', weight: '400', style: 'normal' },
  { path: '../public/fonts/font-6.ttf', weight: '400', style: 'italic' },
], variable: '--font-editorial', display: 'swap', preload: false });
const handwritten = localFont({ src: '../public/fonts/font-0.ttf', variable: '--font-handwritten', weight: '400', display: 'swap', preload: false });

export const metadata: Metadata = {
  title: { default: 'Tushar Auddy — Words with perspective.', template: '%s | Tushar Auddy' },
  description: 'The portfolio and personal journal of Tushar Auddy. News writer, linguistics postgraduate, and curious observer of politics, lifestyle, entertainment, and everyday life.',
  metadataBase: new URL(siteUrl),
  openGraph: { title: 'Tushar Auddy — Words with perspective.', description: 'Stories that inform. Perspectives that stay.', type: 'website', images: [new URL(assetPath('/images/tushar-auddy.webp'), new URL(siteUrl).origin).href] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth" className={`${outfit.variable} ${editorial.variable} ${handwritten.variable}`}><body><a className="skip-link" href="#main">Skip to content</a><Header />{children}<Footer /></body></html>;
}
