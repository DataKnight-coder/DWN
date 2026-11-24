import React, { useEffect, useState } from 'react';
import offers from '../../content/offers.json';
import { NEXT_TRAINING, NEXT_TRAINING_TIMES } from '../config/training';

const training = offers.find(offer => offer.id === 'monetization-masterclass')!;
// A new training date shows the banner again, even for people who closed the last one.
const KEY = `dwn-banner-v1-${NEXT_TRAINING}`;
// "26 December 2026" becomes "26 Dec" on small screens.
const shortDate = NEXT_TRAINING.split(' ').slice(0, 2).map((part, index) => index === 1 ? part.slice(0, 3) : part).join(' ');

// Announcement bar for the next free training. It reserves its own height so the fixed header sits below it.
const TopBanner: React.FC = () => {
  const [open, setOpen] = useState(() => {
    try { return localStorage.getItem(KEY) !== '1'; } catch { return true; }
  });
  useEffect(() => {
    document.documentElement.style.setProperty('--banner-h', open ? '40px' : '0px');
  }, [open]);
  if (!open) return null;
  const close = () => {
    try { localStorage.setItem(KEY, '1'); } catch { /* Remembering the choice is optional. */ }
    setOpen(false);
  };
  return (
    <div role="region" aria-label="Announcement" className="fixed top-0 left-0 right-0 z-[60] h-10 bg-primary text-ivory flex items-center justify-center gap-3 px-10 text-[13px] sm:text-sm">
      <p className="whitespace-nowrap">
        <strong className="font-black"><span className="sm:hidden">Free training · {shortDate}</span><span className="hidden sm:inline">Free online training: {NEXT_TRAINING}</span></strong>
        <span className="hidden md:inline text-ivory/80"> · {NEXT_TRAINING_TIMES}</span>
        {' '}
        <a href={training.url} data-offer-id={training.id} data-cta="banner_training" target="_blank" rel="noreferrer" className="font-bold text-accent underline underline-offset-4"><span className="sm:hidden">Reserve →</span><span className="hidden sm:inline">Reserve your spot →</span></a>
      </p>
      <button type="button" onClick={close} aria-label="Dismiss announcement" className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-ivory/80 hover:text-white">✕</button>
    </div>
  );
};

export default TopBanner;
