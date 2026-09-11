import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticElement from './MagneticElement';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  // Parallax: Image moves down slightly as user scrolls down
  const y = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <section className="relative bg-ivory text-primary min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Column: Organic Image Shape with Parallax */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] mx-auto max-w-lg"
        >
          {/* The organic pill mask */}
          <div className="w-full h-full rounded-[200px_200px_0_200px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(14,51,40,0.4)] relative bg-primary z-10">
            <motion.img 
              style={{ y }}
              src="/dr-hauwa.jpg" 
              alt="Dr. Hauwa"
              className="w-full h-[120%] object-cover object-top opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 absolute -top-[10%]"
            />
            {/* Dark green overlay tint */}
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply pointer-events-none" />
          </div>

          {/* Glassmorphic 3D Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute top-1/4 -left-8 md:-left-16 z-20 bg-ivory/80 backdrop-blur-xl border border-white/50 p-4 md:p-6 rounded-3xl shadow-2xl flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center font-black text-primary text-xl">
              D
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary/50">Founder</div>
              <div className="font-black text-primary leading-tight">Diaspora Wealth<br/>Network</div>
            </div>
          </motion.div>
          
          {/* Decorative floating element */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -right-8 w-40 h-40 bg-accent rounded-full -z-10 blur-2xl opacity-60"
          />
        </motion.div>

        {/* Right Column: Massive Typography */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.9] tracking-tighter mb-8 text-primary">
            Building Careers.<br />
            Brands.<br />
            Businesses.<br />
            Assets.<br />
            <span className="font-serif italic font-light text-accent drop-shadow-sm">Wealth.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary/80 mb-10 leading-relaxed font-medium">
            Dr. Hauwa brings together experience across cybersecurity, real estate, digital marketing, personal branding, entrepreneurship and community development to help professionals create stronger careers, income opportunities and long-term assets.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <MagneticElement>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#expertise"
                className="bg-primary text-ivory font-bold text-lg py-4 px-8 rounded-full hover:bg-dark transition-colors shadow-xl block"
              >
                Explore Dr. Hauwa
              </motion.a>
            </MagneticElement>
            
            <MagneticElement>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#join-dwn"
                className="bg-accent text-primary font-bold text-lg py-4 px-8 rounded-full shadow-xl block"
              >
                Join Diaspora Wealth Network
              </motion.a>
            </MagneticElement>
          </div>

          {/* Visual Expertise Strip */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs md:text-sm font-bold uppercase tracking-widest text-primary/60">
            <span>Cybersecurity</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            <span>Real Estate</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            <span>Digital Marketing</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            <span>Personal Brand</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            <span>Entrepreneurship</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
