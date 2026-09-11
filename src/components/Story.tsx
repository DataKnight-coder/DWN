import React from 'react';
import { motion } from 'framer-motion';

const Story: React.FC = () => {
  return (
    <section id="about" className="bg-ivory py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left: Editorial Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative"
          >
            <div className="w-full aspect-[3/4] md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img 
                src="/dr-hauwa.jpg" 
                alt="Dr. Hauwa Biography" 
                className="w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-1000"
              />
              {/* Subtle film grain overlay */}
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </div>
            {/* Background decorative block */}
            <div className="absolute -bottom-8 -right-8 w-3/4 h-3/4 bg-primary rounded-3xl -z-10" />
          </motion.div>

          {/* Right: Biography Narrative */}
          <div className="lg:w-1/2">
            <h2 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-8 leading-[1.05]">
              Career. Business.<br />
              Ownership. <span className="font-serif italic font-light text-accent drop-shadow-sm">Impact.</span>
            </h2>
            
            <div className="space-y-6 text-lg text-primary/80 font-medium leading-relaxed mb-12">
              <p>
                Dr. Hauwa's journey is not a collection of random career switches. It is a highly intentional, compounding architecture of expertise. Each stage of her career expanded what she could build, own, teach, and contribute.
              </p>
              <p>
                Starting with the rigorous, high-stakes discipline of enterprise <strong className="text-primary font-black">Cybersecurity</strong>, she developed the analytical framework necessary to evaluate risk and identify massive opportunities.
              </p>
              <p>
                That analytical foundation translated directly into business and <strong className="text-primary font-black">Real Estate</strong>, moving beyond simply earning a high income to building lasting assets, leverage, and true ownership.
              </p>
              <p>
                Recognizing that "you cannot scale a secret," she mastered <strong className="text-primary font-black">Personal Branding and Digital Marketing</strong> to build visibility, authority, and community. Today, the <strong className="text-primary font-black">Diaspora Wealth Network</strong> serves as the culmination of these experiences—an ecosystem designed to help ambitious professionals execute the exact same blueprint.
              </p>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-ivory font-bold px-10 py-4 rounded-full shadow-xl hover:bg-dark transition-colors text-lg"
            >
              Read Dr. Hauwa's Full Story
            </motion.button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Story;
