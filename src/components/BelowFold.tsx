import React, { startTransition, useEffect, useState } from 'react';
import Programs from './Programs';
import Journey from './Journey';
import AuthorityPillars from './AuthorityPillars';
import FeatureRealEstate from './FeatureRealEstate';
import FeatureCyber from './FeatureCyber';
import AITraining from './AITraining';
import DWNSection from './DWNSection';
import Testimonials from './Testimonials';
import Story from './Story';
import Process from './Process';
import EmailCTA from './EmailCTA';
import FinalCTA from './FinalCTA';

const sections: React.FC[] = [Programs, Journey, AuthorityPillars, FeatureRealEstate, FeatureCyber, AITraining,
  DWNSection, Testimonials, Story, Process, EmailCTA, FinalCTA];

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
    const mountAll = () => startTransition(() => setVisible(sections.length));
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
