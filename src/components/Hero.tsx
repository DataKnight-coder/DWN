import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 100]);

  return (
    <section className="relative bg-ivory text-primary min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6">

        {/* Mobile: Stack vertically, image on top */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-24 items-center gap-10">

          {/* Image — shown first on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-lg mx-auto aspect-[4/5] order-first lg:order-none"
          >
            {/* Organic pill mask */}
            <div className="w-full h-full rounded-[120px_120px_0_120px] lg:rounded-[200px_200px_0_200px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(14,51,40,0.4)] relative bg-primary z-10">
              <motion.img
                style={{ y }}
                src="/dr-hauwa.jpg"
                alt="Dr. Hauwa"
                className="w-full h-[120%] object-cover object-top opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 absolute -top-[10%]"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply pointer-events-none" />
            </div>

            {/* Glassmorphic Badge — hidden on very small screens to prevent overflow */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute top-1/4 -left-4 sm:-left-10 z-20 bg-ivory/80 backdrop-blur-xl border border-white/50 p-3 sm:p-5 rounded-2xl shadow-2xl flex items-center gap-3"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-full flex items-center justify-center font-black text-primary text-lg sm:text-xl shrink-0">
                D
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary/50">Founder</div>
                <div className="font-black text-primary text-sm sm:text-base leading-tight">Diaspora Wealth<br/>Network</div>
              </div>
            </motion.div>

            {/* Decorative glow */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-8 w-32 h-32 sm:w-40 sm:h-40 bg-accent rounded-full -z-10 blur-2xl opacity-60"
            />
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-center lg:text-left"
          >
            <h1 className="text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] font-black leading-[0.95] tracking-tighter mb-6 sm:mb-8 text-primary">
              Building Careers.<br />
              Brands.<br />
              Businesses.<br />
              Assets.<br />
              <span className="font-serif italic font-light text-accent drop-shadow-sm">Wealth.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-primary/80 mb-8 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
              Dr. Hauwa brings together expertise across cybersecurity, real estate, digital marketing, personal branding, and entrepreneurship to help professionals create stronger careers, income opportunities, and long-term assets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center lg:justify-start">
              <a
                href="#expertise"
                className="bg-primary text-ivory font-bold text-base py-4 px-8 rounded-full hover:bg-dark transition-colors shadow-xl text-center"
              >
                Explore Dr. Hauwa
              </a>
              <a
                href="#join-dwn"
                className="bg-accent text-primary font-bold text-base py-4 px-8 rounded-full shadow-xl hover:scale-105 transition-transform text-center"
              >
                Join Diaspora Wealth Network
              </a>
            </div>

            {/* Expertise strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-3 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-primary/60">
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
      </div>
    </section>
  );
};

export default Hero;
