import React, { startTransition, useEffect, useState } from 'react';
import StoryStrip from './StoryStrip';
import YourPath from './YourPath';
import PathFinder from './PathFinder';
import ClosingBand from './ClosingBand';
import Testimonials from './Testimonials';
import Story from './Story';
import AITraining from './AITraining';
import DWNSection from './DWNSection';
import Expertise from './Expertise';
import RealEstate from './RealEstate';
import FAQ from './FAQ';
import EmailCTA from './EmailCTA';

const sections: React.FC[] = [StoryStrip, PathFinder, Testimonials, YourPath, Story, AITraining, DWNSection, Expertise, RealEstate, FAQ, ClosingBand, EmailCTA];

// Hash links that open the enquiry drawer are handled by ConversionDrawer, not by scrolling.
const drawerHashes = new Set(['#contact', '#join-dwn', '#ai-training']);

// Sections mount one at a time in interruptible steps, so the main thread is never blocked by one
// large render. A link to a section further down mounts everything at once and then scrolls to it.
const BelowFold: React.FC = () => {
  const [visible, setVisible] = useState(1);
  const done = visible >= sections.length;

  useEffect(() => {
    if (done) return;
    const id = window.setTimeout(() => startTransition(() => setVisible(count => count + 1)), 40);
    return () => window.clearTimeout(id);
  }, [visible, done]);

  useEffect(() => {
    // A link into the page needs exact positions, so skip the off-screen rendering shortcut for it.
    const mountAll = () => { document.documentElement.classList.add('anchor-jump'); startTransition(() => setVisible(sections.length)); };
    window.addEventListener('hashchange', mountAll);
    if (window.location.hash && !drawerHashes.has(window.location.hash)) mountAll();
    return () => window.removeEventListener('hashchange', mountAll);
  }, []);

  useEffect(() => {
    if (!done) return;
    const hash = window.location.hash;
    if (!hash || drawerHashes.has(hash)) return;
    let target: HTMLElement | null = null;
    try { target = document.querySelector<HTMLElement>(hash); } catch { return; }
    // Wait a frame so the sections have laid out, then restore the position the link asked for.
    if (target) requestAnimationFrame(() => target?.scrollIntoView());
  }, [done]);

  return <>{sections.slice(0, visible).map((Section, index) => <Section key={index} />)}</>;
};

export default BelowFold;
