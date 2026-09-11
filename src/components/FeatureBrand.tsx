import React from 'react';
import { motion } from 'framer-motion';

const FeatureBrand: React.FC = () => {
  return (
    <section className="bg-primary text-ivory py-32 overflow-hidden border-t-8 border-accent">
      <div className="container mx-auto px-6 text-center max-w-4xl mb-20">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1]">
          Building Authority Before <br />
          <span className="text-accent">Asking for Attention.</span>
        </h2>
        <p className="text-xl md:text-2xl opacity-80 font-medium leading-relaxed">
          Dr. Hauwa's personal brand is the ultimate case study of her methodology. She has deliberately crafted professional positioning, online visibility, and thought leadership to build an ecosystem of trust.
        </p>
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Dynamic Social / Content Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1: Article/Thought Leadership */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-ivory text-primary p-8 rounded-[2rem] shadow-2xl"
          >
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-6 text-primary font-black">in</div>
            <p className="font-medium text-lg leading-relaxed mb-6 italic">
              "You cannot scale a secret. If you are a highly skilled professional, it is your responsibility to make your expertise visible to the market."
            </p>
            <div className="font-bold text-sm tracking-widest uppercase opacity-60">Thought Leadership</div>
          </motion.div>

          {/* Card 2: Main Image */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[400px] md:h-auto rounded-[2rem] overflow-hidden shadow-2xl relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80" 
              alt="Brand Visibility" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Card 3: Video/Media thumbnail */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-dark text-ivory p-8 rounded-[2rem] shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 border-2 border-accent rounded-full flex items-center justify-center mb-6 text-accent">
                <span className="ml-1">▶</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">The Blueprint to Digital Authority</h3>
              <p className="opacity-70 font-medium">Over 50+ hours of strategic content breaking down professional positioning.</p>
            </div>
            <div className="mt-8 font-bold text-sm tracking-widest uppercase text-accent">Media & Video</div>
          </motion.div>

        </div>

        <div className="text-center mt-16">
          <a href="#explore-brand" className="inline-block bg-ivory text-primary font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform text-lg shadow-xl">
            Explore Her Brand
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeatureBrand;
