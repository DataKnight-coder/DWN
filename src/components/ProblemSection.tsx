import React from 'react';
import { motion } from 'framer-motion';

const ProblemSection: React.FC = () => {
  return (
    <section className="bg-primary text-ivory py-32">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-accent font-bold tracking-widest uppercase text-sm mb-6">
            The Diaspora Reality
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-12 leading-[1.1]">
            Your Job Should Not Be Your <span className="text-accent">Only Source of Growth.</span>
          </h2>
          
          <div className="text-xl leading-relaxed text-ivory/80 space-y-6 max-w-3xl mx-auto font-medium">
            <p>
              Starting again after immigration shouldn't mean staying stuck. Yet many diaspora professionals face career stagnation, limited professional networks, and financial pressure.
            </p>
            <p>
              Without access to trusted information and strong community, building additional income or stepping into entrepreneurship feels uncertain.
            </p>
            <p className="text-ivory text-2xl pt-6 font-semibold">
              Dr. Hauwa provides the strategy, education, and ecosystem to turn your skills into measurable progress.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
