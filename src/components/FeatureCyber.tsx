import React from 'react';
import { motion } from 'framer-motion';

const FeatureCyber: React.FC = () => {
  return (
    <section id="cybersecurity" className="bg-primary text-ivory py-32 overflow-hidden">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Professional Tech Visual (No Hacker Cliches) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full h-[500px] lg:h-[700px] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(14,51,40,0.3)] bg-primary"
        >
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" 
            alt="Enterprise Technology Setup"
            className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          
          {/* Glassmorphism floating data card */}
          <div className="absolute bottom-10 left-10 right-10 bg-ivory/90 backdrop-blur-md p-6 rounded-2xl border border-ivory shadow-xl">
            <div className="text-primary font-black text-xl mb-1">Analytical Thinking</div>
            <div className="text-primary/70 font-bold uppercase tracking-widest text-xs">Foundation of Strategy</div>
          </div>
        </motion.div>

        {/* Right: Narrative */}
        <div className="max-w-xl">
          <div className="inline-block bg-primary text-accent font-bold uppercase tracking-widest text-xs px-4 py-2 rounded-full mb-8">
            Technology & Cybersecurity
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-8 leading-[1]">
            A Career Built in <span className="italic font-serif font-light block mt-2 text-primary/80">Technology.</span>
          </h2>
          
          <div className="text-lg md:text-xl text-primary/80 font-medium leading-relaxed space-y-6 mb-12">
            <p>
              Dr. Hauwa’s foundation is built on the rigorous discipline of enterprise cybersecurity. This is where her analytical framework, risk management, and strategic thinking were forged.
            </p>
            <p>
              She uses this background to demystify the tech industry for diaspora professionals, providing clear education on career transitions, navigating technology leadership, and breaking into high-income tech roles as an immigrant or a woman in technology.
            </p>
          </div>

          <a href="#explore-cybersecurity" className="group inline-flex items-center gap-4 bg-transparent border-2 border-primary text-primary font-bold text-lg px-8 py-4 rounded-full hover:bg-primary hover:text-ivory transition-all">
            Explore Cybersecurity <span className="group-hover:translate-x-2 transition-transform">→</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default FeatureCyber;
