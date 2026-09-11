import React, { useState } from 'react';
import { motion } from 'framer-motion';

const pillars = [
  {
    id: "cybersecurity",
    num: "01",
    title: "Cybersecurity & Tech",
    subtitle: "Technology careers, digital risk awareness, and professional transition.",
    bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Cybersecurity",
    href: "#cybersecurity"
  },
  {
    id: "real-estate",
    num: "02",
    title: "Real Estate & Assets",
    subtitle: "Property ownership, investment awareness, and long-term wealth strategy.",
    bgImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Real Estate",
    href: "#real-estate"
  },
  {
    id: "personal-brand",
    num: "03",
    title: "Personal Brand",
    subtitle: "Authority building, professional positioning, and online visibility.",
    bgImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Branding",
    href: "#join-dwn"
  },
  {
    id: "digital-marketing",
    num: "04",
    title: "Digital Marketing",
    subtitle: "Content strategy, audience growth, and customer acquisition systems.",
    bgImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Marketing",
    href: "#join-dwn"
  },
  {
    id: "entrepreneurship",
    num: "05",
    title: "Entrepreneurship",
    subtitle: "Multiple income channels, strategic growth, and business development.",
    bgImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    cta: "Explore Wealth",
    href: "#join-dwn"
  }
];

const AuthorityPillars: React.FC = () => {
  const [activeId, setActiveId] = useState<string>("cybersecurity");

  return (
    <section id="expertise" className="bg-ivory py-20 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6 max-w-[1400px]">
        <div className="mb-12 sm:mb-16 max-w-4xl">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-primary tracking-tighter mb-4 sm:mb-6">
            Core <span className="font-serif italic font-light text-accent">Expertise.</span>
          </h2>
          <p className="text-lg sm:text-xl text-primary/80 font-medium">
            Building expertise, ownership, visibility, income and long-term opportunity.
          </p>
        </div>

        {/* Desktop: Horizontal Bento Accordion */}
        <div className="hidden lg:flex h-[580px] w-full gap-4">
          {pillars.map((pillar) => {
            const isActive = activeId === pillar.id;
            return (
              <motion.div
                key={pillar.id}
                layout
                onMouseEnter={() => setActiveId(pillar.id)}
                className={`group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl flex-1 flex flex-col justify-end transition-all duration-700 ease-[0.16,1,0.3,1] ${isActive ? 'grow-[3]' : 'grow-[1]'}`}
              >
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${pillar.bgImage})` }}
                  animate={{ scale: isActive ? 1 : 1.08 }}
                  transition={{ duration: 0.7 }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${isActive ? 'from-dark/95 via-dark/40 to-transparent' : 'from-dark/90 to-dark/40'}`} />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />

                <motion.div layout="position" className="relative z-10 p-8 w-full">
                  <div className={`text-accent font-bold uppercase tracking-widest text-xs mb-4 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    {pillar.num}
                  </div>
                  <div className={`transition-all duration-500 delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute pointer-events-none'}`}>
                    <h3 className="text-3xl font-black text-ivory mb-3 leading-tight tracking-tight whitespace-nowrap">{pillar.title}</h3>
                    <p className="text-base font-medium text-ivory/80 mb-6 max-w-sm">{pillar.subtitle}</p>
                    <a href={pillar.href} className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-accent hover:text-ivory transition-colors">
                      {pillar.cta}
                      <span className="w-8 h-8 rounded-full border border-accent flex items-center justify-center hover:bg-accent hover:text-dark transition-all">→</span>
                    </a>
                  </div>
                </motion.div>

                {/* Vertical title for inactive */}
                <div className={`absolute bottom-10 left-10 origin-bottom-left -rotate-90 whitespace-nowrap transition-all duration-500 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                  <h3 className="text-xl font-black text-ivory/50 tracking-widest uppercase">{pillar.title}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: Vertical Stacked Cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5">
          {pillars.map((pillar, idx) => (
            <motion.a
              href={pillar.href}
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="relative rounded-[1.5rem] overflow-hidden shadow-xl aspect-[4/3] flex flex-col justify-end"
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${pillar.bgImage})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/40 to-transparent" />
              <div className="relative z-10 p-6">
                <div className="text-accent font-bold uppercase tracking-widest text-[10px] mb-2">{pillar.num}</div>
                <h3 className="text-xl font-black text-ivory mb-1 leading-tight">{pillar.title}</h3>
                <p className="text-sm text-ivory/70 line-clamp-2">{pillar.subtitle}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuthorityPillars;
