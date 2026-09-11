import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Journey: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
    <section className="bg-primary text-ivory py-32 overflow-hidden relative cursor-default">
      
      {/* Floating Hover Image */}
      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="fixed pointer-events-none z-[100] w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-ivory/20"
            style={{ 
              left: mousePos.x, 
              top: mousePos.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <img 
              src={steps[hoveredIdx].image} 
              alt={steps[hoveredIdx].title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            One Career Was<br />
            <span className="font-serif italic font-light text-accent">Never the Limit.</span>
          </h2>
          <p className="text-xl opacity-80 max-w-2xl mx-auto font-medium leading-relaxed">
            Each stage of her career expanded what she could build, own, teach and contribute. These are not random career switches—they are compound layers of expertise.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-ivory/10 transform md:-translate-x-1/2" />
          
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
                className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 group transition-opacity duration-300 ${hoveredIdx !== null && hoveredIdx !== idx ? 'opacity-30' : 'opacity-100'} ${idx % 2 === 0 ? 'md:flex-row-reverse text-left md:text-right' : 'text-left'}`}
              >
                <div className="w-full md:w-1/2" />
                
                {/* Node */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-ivory group-hover:bg-accent group-hover:scale-150 transition-all duration-300 rounded-full transform -translate-x-[6px] md:-translate-x-1/2 mt-2 md:mt-0 shadow-[0_0_15px_rgba(212,246,112,0)] group-hover:shadow-[0_0_20px_rgba(212,246,112,0.8)] z-10" />
                
                <div className="w-full md:w-1/2 pl-12 md:pl-0">
                  <h3 className="text-3xl md:text-5xl font-black mb-2 text-ivory group-hover:text-accent transition-colors duration-300">{step.title}</h3>
                  <p className="text-ivory/60 font-medium text-lg">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;
