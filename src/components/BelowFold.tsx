import React, { useEffect } from 'react';
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
import MediaContent from './MediaContent';
import EmailCTA from './EmailCTA';
import FinalCTA from './FinalCTA';

// Hash links that open the enquiry drawer are handled by ConversionDrawer, not by scrolling.
const drawerHashes = new Set(['#contact', '#join-dwn', '#ai-training']);

// Everything below the hero lives in one lazily loaded chunk so the first paint is not blocked by it.
const BelowFold: React.FC = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || drawerHashes.has(hash)) return;
    let target: HTMLElement | null = null;
    try { target = document.querySelector<HTMLElement>(hash); } catch { return; }
    // Wait a frame so the sections have laid out, then restore the position the link asked for.
    if (target) requestAnimationFrame(() => target?.scrollIntoView());
  }, []);
  return (
    <>
      <Programs />
      <Journey />
      <AuthorityPillars />
      <FeatureRealEstate />
      <FeatureCyber />
      <AITraining />
      <DWNSection />
      <Testimonials />
      <Story />
      <Process />
      <MediaContent />
      <EmailCTA />
      <FinalCTA />
    </>
  );
};

export default BelowFold;
