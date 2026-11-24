import React, { Suspense, lazy, useState } from 'react';
import { LazyMotion } from 'framer-motion';
import MobileNav from './components/MobileNav';
import PathwayQuiz from './components/PathwayQuiz';
import UnsubscribePanel from './components/UnsubscribePanel';
import ConversionDrawer from './components/ConversionDrawer';
import TrackingConsent from './components/TrackingConsent';
import OutboundTracking from './components/OutboundTracking';

import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import TopBanner from './components/TopBanner';

const BelowFold = lazy(() => import('./components/BelowFold'));
const loadMotionFeatures = () => import('./motionFeatures').then(module => module.default);

const App: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <LazyMotion features={loadMotionFeatures}>
      <ConversionDrawer />
      <TopBanner />
      <TrackingConsent />
      <OutboundTracking />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[1000] focus:bg-accent focus:text-primary focus:p-3">Skip to content</a>
      <div className="noise-bg" aria-hidden="true"></div>
      <div className="flex flex-col min-h-screen bg-ivory font-sans pt-24 selection:bg-accent selection:text-dark relative z-0" style={{ paddingTop: 'calc(6rem + var(--banner-h, 40px))' }}>
      
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
        <Suspense fallback={<div aria-hidden="true" style={{ minHeight: '100vh' }} />}>
          <BelowFold />
        </Suspense>
      </main>
      <UnsubscribePanel />
      <Footer />
    </div>
    </LazyMotion>
  );
};

export default App;
