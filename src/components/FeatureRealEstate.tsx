import React from 'react';
import { motion } from 'framer-motion';

const FeatureRealEstate: React.FC = () => {
  return (
    <section id="real-estate" className="bg-ivory py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="bg-primary rounded-[3rem] p-10 md:p-20 relative overflow-hidden flex flex-col lg:flex-row gap-16 items-center shadow-2xl">
          
          {/* Background Accent */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

          {/* Left: Text Content */}
          <div className="lg:w-1/2 relative z-10">
            <h2 className="text-5xl md:text-6xl font-black text-ivory tracking-tighter mb-8 leading-[1.05]">
              Beyond Income:<br />
              <span className="text-accent">Building Assets</span>
            </h2>
            <p className="text-xl text-ivory/80 mb-12 font-medium leading-relaxed">
              Dr. Hauwa approaches real estate not as a quick win, but as a foundational element of long-term wealth strategy. Her philosophy focuses on investment education, moving from earning income toward building generational assets.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center font-black flex-shrink-0">01</div>
                <div>
                  <h4 className="text-2xl font-bold text-ivory mb-2">Property</h4>
                  <p className="text-ivory/70 font-medium">Understanding property as a strategic, leverageable asset.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center font-black flex-shrink-0">02</div>
                <div>
                  <h4 className="text-2xl font-bold text-ivory mb-2">Investment</h4>
                  <p className="text-ivory/70 font-medium">Learning how investment opportunities work in the modern market.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center font-black flex-shrink-0">03</div>
                <div>
                  <h4 className="text-2xl font-bold text-ivory mb-2">Ownership</h4>
                  <p className="text-ivory/70 font-medium">Transitioning your mindset from earning a salary toward building true assets.</p>
                </div>
              </div>
            </div>

            <a href="#explore-real-estate" className="inline-block bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform text-lg shadow-lg">
              Discover Her Real Estate Journey
            </a>
          </div>

          {/* Right: High-End Visual */}
          <div className="lg:w-1/2 relative z-10 w-full h-[600px]">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-ivory/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" 
                alt="Premium Property Investment" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureRealEstate;
