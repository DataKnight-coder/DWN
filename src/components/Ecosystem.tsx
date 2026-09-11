import React from 'react';
import { motion } from 'framer-motion';

const brands = [
  { name: "Diaspora Wealth Network", role: "Founder", desc: "The premier network for diaspora professionals building long-term wealth." },
  { name: "Hauwa Consulting", role: "Principal", desc: "Strategic advisory across cybersecurity risk and digital transformation." },
  { name: "Global Real Estate Partners", role: "Investor", desc: "Multi-family asset acquisition and property development." },
  { name: "Digital Brand Architect", role: "Founder", desc: "Executive positioning and digital growth strategies for leaders." }
];

const Ecosystem: React.FC = () => {
  return (
    <section className="bg-primary text-ivory py-32 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl text-center">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
          Built, Not Just <span className="text-accent italic font-serif font-light">Discussed.</span>
        </h2>
        <p className="text-xl font-medium opacity-80 mb-16 max-w-3xl mx-auto">
          Dr. Hauwa doesn't just consult—she builds. This is the ecosystem of businesses, brands, and initiatives actively operating under her leadership.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {brands.map((brand, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-ivory/5 border border-ivory/10 rounded-[2rem] p-10 text-left hover:border-accent transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-full bg-ivory/10 flex items-center justify-center mb-8 text-accent">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </div>
                <div className="text-accent font-bold text-xs uppercase tracking-widest mb-3">{brand.role}</div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">{brand.name}</h3>
                <p className="text-ivory/70 font-medium mb-8 leading-relaxed">{brand.desc}</p>
              </div>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
                Explore <span className="text-accent">→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;
