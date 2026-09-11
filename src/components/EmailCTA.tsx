import React from 'react';
import { motion } from 'framer-motion';

const EmailCTA: React.FC = () => {
  return (
    <section className="bg-sage text-primary py-32 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-ivory/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Build More Than a Career. <br className="hidden md:block" />
            <span className="text-ivory drop-shadow-sm">Build Options.</span>
          </h2>
          <p className="text-xl md:text-2xl font-medium opacity-90 mb-12 max-w-2xl mx-auto">
            Get practical insights on career growth, entrepreneurship, wealth and opportunities for diaspora professionals.
          </p>

          <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="First name" 
              required
              className="flex-grow px-6 py-4 rounded-full bg-ivory/90 border border-primary/10 text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
            <input 
              type="email" 
              placeholder="Email address" 
              required
              className="flex-grow px-6 py-4 rounded-full bg-ivory/90 border border-primary/10 text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
            <button 
              type="submit" 
              className="bg-primary text-ivory font-bold px-8 py-4 rounded-full hover:bg-dark transition-colors whitespace-nowrap shadow-xl"
            >
              Join the Community
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default EmailCTA;
