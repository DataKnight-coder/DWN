import React, { useState } from 'react';
import SEO from './components/SEO';
import CustomCursor from './components/CustomCursor';
import MobileNav from './components/MobileNav';
import PathwayQuiz from './components/PathwayQuiz';
import SmoothScroll from './components/SmoothScroll';
import Preloader from './components/Preloader';
import ConversionDrawer from './components/ConversionDrawer';

import Header from './components/Header';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import Journey from './components/Journey';
import AuthorityPillars from './components/AuthorityPillars';
import FeatureRealEstate from './components/FeatureRealEstate';
import FeatureCyber from './components/FeatureCyber';
import FeatureBrand from './components/FeatureBrand';
import FeatureMarketing from './components/FeatureMarketing';
import DWNSection from './components/DWNSection';
import Portfolio from './components/Portfolio';
import Ecosystem from './components/Ecosystem';
import ImpactResults from './components/ImpactResults';
import Programs from './components/Programs';
import Story from './components/Story';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import MediaContent from './components/MediaContent';
import EmailCTA from './components/EmailCTA';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <SmoothScroll>
      <Preloader />
      <ConversionDrawer />
      <div className="noise-bg mix-blend-overlay"></div>
      <div className="flex flex-col min-h-screen bg-ivory font-sans pt-24 selection:bg-accent selection:text-dark relative z-0">
        <SEO />
        <CustomCursor />
      
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
      <main className="flex-grow">
        <Hero />
        <TrustStrip />
        <Journey />
        <AuthorityPillars />
        <FeatureRealEstate />
        <FeatureCyber />
        <FeatureBrand />
        <FeatureMarketing />
        <DWNSection />
        <Portfolio />
        <Ecosystem />
        <ImpactResults />
        <Programs />
        <Story />
        <Process />
        <Testimonials />
        <MediaContent />
        <EmailCTA />
        <FAQ />
        <FinalCTA onOpenQuiz={() => setIsQuizOpen(true)} />
      </main>
      <Footer />
    </div>
    </SmoothScroll>
  );
};

export default App;
