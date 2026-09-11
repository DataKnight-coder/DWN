import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConversionDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      e.preventDefault();
      setIsOpen(true);
    };
    
    // Listen for custom event
    window.addEventListener('open-drawer', handleOpen);
    
    // Also intercept any clicks on links with href="#join-dwn"
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href') === '#join-dwn') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('open-drawer', handleOpen);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-dark/80 backdrop-blur-md z-[200]"
          />
          <motion.div
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[500px] bg-primary text-ivory z-[201] p-8 md:p-12 shadow-2xl flex flex-col border-l border-ivory/10"
          >
            <button 
              onClick={() => setIsOpen(false)} 
              className="self-end text-ivory/50 hover:text-accent font-bold uppercase tracking-widest text-sm mb-12 flex items-center gap-2 transition-colors"
            >
              Close <span className="text-xl">✕</span>
            </button>
            
            <div className="flex-grow flex flex-col justify-center">
              <div className="text-accent font-bold uppercase tracking-widest text-xs mb-4">Diaspora Wealth Network</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
                Build More <br/><span className="font-serif italic font-light text-accent">Options.</span>
              </h2>
              <p className="text-ivory/70 mb-10 font-medium leading-relaxed text-lg">
                Get practical insights from Dr. Hauwa on careers, cybersecurity, real estate, entrepreneurship, personal branding, and wealth-building opportunities.
              </p>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="w-full bg-ivory/5 border border-ivory/10 p-5 rounded-2xl text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-accent transition-colors" 
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-ivory/5 border border-ivory/10 p-5 rounded-2xl text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-accent transition-colors" 
                />
                <button className="w-full bg-accent text-primary font-bold py-5 rounded-2xl uppercase tracking-widest hover:scale-[1.02] hover:shadow-lg transition-all mt-6">
                  Join the Community
                </button>
              </div>

              {/* WhatsApp Direct Integration */}
              <div className="mt-10 pt-8 border-t border-ivory/10 text-center">
                <p className="text-ivory/50 text-[10px] uppercase tracking-widest font-bold mb-4">Or message directly on WhatsApp</p>
                <a 
                  href="https://wa.me/18253655299" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-3 text-accent font-black text-xl hover:text-ivory transition-colors hover:-translate-y-1 transform duration-300"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  +1 (825) 365 5299
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConversionDrawer;
