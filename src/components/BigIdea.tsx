import React from 'react';
import { motion } from 'framer-motion';

const BigIdea: React.FC = () => {
  return (
    <section className="bg-primary text-ivory py-32">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-12">
            One Career Is Good.<br />
            <span className="text-accent">Options Are Better.</span>
          </h2>
          
          <div className="text-xl md:text-2xl leading-relaxed text-ivory/80 space-y-6 max-w-3xl mx-auto font-medium">
            <p>The modern diaspora professional needs more than employment.</p>
            <p className="text-ivory">
              You need visibility. Transferable skills. Multiple ways to create value. A powerful network. And a strategy for turning income into assets.
            </p>
            <p>
              That is the thinking behind Dr. Hauwa's work and Diaspora Wealth Network.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BigIdea;
