import React from 'react';
import { motion } from 'framer-motion';

const TrustStrip: React.FC = () => {
  // Topics, not endorsements or partner logos.
  const logos = [
    "CAREER", "REAL ESTATE", "GLOBAL DIASPORA", "TECHNOLOGY", "ENTREPRENEURSHIP", "DIGITAL BUSINESS", "COMMUNITY", "PERSONAL BRAND",
    // Duplicate for seamless loop
    "CAREER", "REAL ESTATE", "GLOBAL DIASPORA", "TECHNOLOGY", "ENTREPRENEURSHIP", "DIGITAL BUSINESS", "COMMUNITY", "PERSONAL BRAND"
  ];

  return (
    <section aria-label="Focus areas" className="bg-primary py-8 border-y border-ivory/10 overflow-hidden relative flex items-center">
      
      {/* Edge Gradients for smooth fade in/out */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />

      {/* Infinite Marquee Track */}
      <motion.div 
        aria-hidden="true"
        className="flex whitespace-nowrap items-center gap-16"
        animate={{ x: [0, -1920] }} // Adjust depending on content width
        transition={{ 
          repeat: Infinity, 
          duration: 30, 
          ease: "linear" 
        }}
      >
        {logos.map((logo, index) => (
          <div key={index} className="flex items-center gap-16">
            <span className="text-xl md:text-2xl font-black text-ivory/70 uppercase tracking-widest hover:text-accent transition-colors duration-300">
              {logo}
            </span>
            {/* Dot Separator */}
            <span className="w-2 h-2 rounded-full bg-accent/50" />
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default TrustStrip;
