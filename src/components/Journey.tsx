import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Journey: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const steps = [
    { title: "Technology", desc: "Foundational systems and analytical thinking.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80" },
    { title: "Cybersecurity", desc: "Risk awareness, security, and high-level tech expertise.", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80" },
    { title: "Business", desc: "Commercial strategy and scaling operations.", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80" },
    { title: "Real Estate", desc: "Understanding assets, investment, and wealth generation.", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80" },
    { title: "Brand Building", desc: "Authority, visibility, and audience-building.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80" },
    { title: "Digital Marketing", desc: "Customer acquisition and digital growth.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80" },
    { title: "Diaspora Wealth", desc: "Bringing these experiences together into a complete ecosystem.", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <section className="bg-primary text-ivory py-20 sm:py-32 overflow-hidden relative cursor-default">

      {/* Floating hover image – desktop only */}
      {!isMobile && (
        <AnimatePresence>
          {hoveredIdx !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="fixed pointer-events-none z-[100] w-56 h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-ivory/20"
              style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
            >
              <img src={steps[hoveredIdx].image} alt={steps[hoveredIdx].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div className="container mx-auto px-5 sm:px-6 max-w-5xl">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6">
            One Career Was<br />
            <span className="font-serif italic font-light text-accent">Never the Limit.</span>
          </h2>
          <p className="text-lg sm:text-xl opacity-80 max-w-2xl mx-auto font-medium leading-relaxed">
            Each stage of her career expanded what she could build, own, teach and contribute.
          </p>
        </div>

        {/* Desktop: timeline with hover reveal */}
        <div className="hidden lg:block relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-ivory/10 transform -translate-x-1/2" />
          <div className="space-y-12 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`flex items-center gap-12 group transition-opacity duration-300 ${hoveredIdx !== null && hoveredIdx !== idx ? 'opacity-30' : 'opacity-100'} ${idx % 2 === 0 ? 'flex-row-reverse text-right' : 'text-left'}`}
              >
                <div className="w-1/2" />
                <div className="absolute left-1/2 w-4 h-4 bg-ivory group-hover:bg-accent group-hover:scale-150 transition-all duration-300 rounded-full -translate-x-1/2 shadow-[0_0_15px_rgba(212,246,112,0)] group-hover:shadow-[0_0_20px_rgba(212,246,112,0.8)] z-10" />
                <div className="w-1/2">
                  <h3 className="text-4xl lg:text-5xl font-black mb-2 text-ivory group-hover:text-accent transition-colors">{step.title}</h3>
                  <p className="text-ivory/60 font-medium text-lg">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: image cards grid */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl"
            >
              <img src={step.image} alt={step.title} className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <div className="text-accent font-bold text-[10px] uppercase tracking-widest mb-1">{String(idx + 1).padStart(2, '0')}</div>
                <h3 className="text-xl font-black text-ivory">{step.title}</h3>
                <p className="text-ivory/70 text-sm mt-1">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journey;
