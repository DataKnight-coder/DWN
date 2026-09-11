import React from 'react';
import { motion } from 'framer-motion';

const ImpactResults: React.FC = () => {
  return (
    <section className="bg-dark text-ivory py-24 border-y border-primary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Proven Results</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Measurable Impact Across the Diaspora</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-5xl md:text-7xl font-black text-accent mb-2">10K+</div>
            <div className="text-sm md:text-base font-semibold uppercase tracking-wider opacity-80">Professionals Reached</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-5xl md:text-7xl font-black text-accent mb-2">25+</div>
            <div className="text-sm md:text-base font-semibold uppercase tracking-wider opacity-80">Countries Represented</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-5xl md:text-7xl font-black text-accent mb-2">100+</div>
            <div className="text-sm md:text-base font-semibold uppercase tracking-wider opacity-80">Sessions & Events</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-5xl md:text-7xl font-black text-accent mb-2">500+</div>
            <div className="text-sm md:text-base font-semibold uppercase tracking-wider opacity-80">Community Members</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImpactResults;
