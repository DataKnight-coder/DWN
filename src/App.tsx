import React, { useState } from 'react';
import MobileNav from './components/MobileNav';
import PathwayQuiz from './components/PathwayQuiz';
import UnsubscribePanel from './components/UnsubscribePanel';
import ConversionDrawer from './components/ConversionDrawer';
import TrackingConsent from './components/TrackingConsent';
import OutboundTracking from './components/OutboundTracking';

import Header from './components/Header';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import Journey from './components/Journey';
import AuthorityPillars from './components/AuthorityPillars';
import FeatureRealEstate from './components/FeatureRealEstate';
import FeatureCyber from './components/FeatureCyber';
import DWNSection from './components/DWNSection';
import Testimonials from './components/Testimonials';
import Programs from './components/Programs';
import AITraining from './components/AITraining';
import Story from './components/Story';
import Process from './components/Process';
import MediaContent from './components/MediaContent';
import EmailCTA from './components/EmailCTA';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <>
      <ConversionDrawer />
      <TrackingConsent />
      <OutboundTracking />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[1000] focus:bg-accent focus:text-primary focus:p-3">Skip to content</a>
      <div className="noise-bg mix-blend-overlay"></div>
      <div className="flex flex-col min-h-screen bg-ivory font-sans pt-24 selection:bg-accent selection:text-dark relative z-0">
      
      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
        onOpenQuiz={() => setIsQuizOpen(true)}
      />
      
      <PathwayQuiz 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
      />

      <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} onOpenQuiz={() => setIsQuizOpen(true)} />
      <main id="main-content" className="flex-grow">
        <Hero />
        <TrustStrip />
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
      </main>
      <UnsubscribePanel />
      <Footer />
    </div>
    </>
  );
};

export default App;
