'use client';
import { useEffect } from 'react';

// Share one update per animation frame, including layout changes after images load.
export function usePageScroll(update: (progress: number, scrollY: number) => void) {
 useEffect(() => {
  let frame = 0;
  const measure = () => {
   frame = 0;
   const length = document.documentElement.scrollHeight - window.innerHeight;
   update(length > 0 ? Math.max(0, Math.min(1, window.scrollY / length)) : 0, window.scrollY);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
  const observer = new ResizeObserver(schedule);
  observer.observe(document.body);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('load', schedule, true);
  schedule();
  return () => {
   cancelAnimationFrame(frame);
   observer.disconnect();
   window.removeEventListener('scroll', schedule);
   window.removeEventListener('resize', schedule);
   document.removeEventListener('load', schedule, true);
  };
 }, [update]);
}
