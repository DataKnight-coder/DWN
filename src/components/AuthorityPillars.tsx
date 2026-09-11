import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pillars = [
  {
    id: "cybersecurity",
    num: "01",
    title: "Cybersecurity & Technology",
    subtitle: "Technology careers, digital risk awareness, and professional transition.",
    bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Cybersecurity",
  },
  {
    id: "real-estate",
    num: "02",
    title: "Real Estate & Asset Building",
    subtitle: "Property ownership, investment awareness, and long-term wealth strategy.",
    bgImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Real Estate",
  },
  {
    id: "personal-brand",
    num: "03",
    title: "Personal Brand",
    subtitle: "Authority building, professional positioning, and online visibility.",
    bgImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Branding",
  },
  {
    id: "digital-marketing",
    num: "04",
    title: "Digital Marketing",
    subtitle: "Content strategy, audience growth, and customer acquisition systems.",
    bgImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Marketing",
  },
  {
    id: "entrepreneurship",
    num: "05",
    title: "Entrepreneurship & Wealth",
    subtitle: "Multiple income channels, strategic growth, and business development.",
    bgImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Wealth",
  }
];

const AuthorityPillars: React.FC = () => {
  const [activeId, setActiveId] = useState<string>("cybersecurity");

  return (
    <section id="expertise" className="bg-ivory py-32 overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="mb-16 md:text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-6">
            Core <span className="font-serif italic font-light text-accent">Expertise.</span>
          </h2>
          <p className="text-xl text-primary/80 font-medium">
            Building expertise, ownership, visibility, income and long-term opportunity.
          </p>
        </div>

        {/* Expanding Accordion Layout */}
        <div className="flex flex-col lg:flex-row h-[800px] lg:h-[600px] w-full gap-4">
          {pillars.map((pillar) => {
            const isActive = activeId === pillar.id;

            return (
              <motion.div
                key={pillar.id}
                layout
                onMouseEnter={() => setActiveId(pillar.id)}
                className={`group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl flex-1 flex flex-col justify-end transition-all duration-700 ease-[0.16,1,0.3,1] ${
                  isActive ? 'lg:grow-[3] grow-[2]' : 'lg:grow-[1] grow-[1]'
                }`}
              >
                {/* Background Image & Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${pillar.bgImage})` }}
                  animate={{ scale: isActive ? 1 : 1.1 }}
                  transition={{ duration: 0.7 }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${isActive ? 'from-dark/95 via-dark/40 to-transparent' : 'from-dark/90 to-dark/40'}`} />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                
                {/* Content */}
                <motion.div layout="position" className="relative z-10 p-6 md:p-10 w-full">
                  <div className={`text-accent font-bold uppercase tracking-widest text-xs mb-4 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 lg:opacity-100 lg:-rotate-90 lg:origin-bottom-left lg:absolute lg:bottom-10 lg:left-10'}`}>
                    {pillar.num}
                  </div>
                  
                  <div className={`transition-all duration-500 delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute pointer-events-none'}`}>
                    <h3 className="text-3xl md:text-4xl font-black text-ivory mb-3 leading-tight tracking-tight whitespace-nowrap">
                      {pillar.title}
                    </h3>
                    <p className="text-base font-medium text-ivory/80 mb-8 max-w-sm line-clamp-3">
                      {pillar.subtitle}
                    </p>
                    
                    <div className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-accent hover:text-ivory transition-colors">
                      {pillar.cta} 
                      <span className="w-8 h-8 rounded-full border border-accent flex items-center justify-center hover:bg-accent hover:text-dark transition-all">
                        →
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Vertical title for inactive states (Desktop only) */}
                <div className={`hidden lg:block absolute bottom-10 left-10 origin-bottom-left -rotate-90 whitespace-nowrap transition-all duration-500 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                   <h3 className="text-2xl font-black text-ivory/50 tracking-widest uppercase">{pillar.title}</h3>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AuthorityPillars;
