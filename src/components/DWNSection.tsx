import React from 'react';
import { motion } from 'framer-motion';

const props = [
  { id: "01", title: "CAREER", desc: "Develop stronger professional opportunities." },
  { id: "02", title: "BUSINESS", desc: "Learn how professionals can build and grow businesses." },
  { id: "03", title: "REAL ESTATE", desc: "Understand property and asset-building opportunities." },
  { id: "04", title: "TECHNOLOGY", desc: "Explore cybersecurity and technology careers." },
  { id: "05", title: "BRAND", desc: "Build professional authority and visibility." },
  { id: "06", title: "COMMUNITY", desc: "Connect with ambitious diaspora professionals." },
];

const DWNSection: React.FC = () => {
  return (
    <section id="dwn" className="bg-primary text-ivory py-32 relative overflow-hidden">
      {/* Background Networking Visual */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80" 
          alt="DWN Community" 
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1]"
          >
            Build More Than<br />
            <span className="text-accent italic font-serif font-medium">A Career.</span>
          </motion.h2>
          <p className="text-xl font-medium opacity-80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Diaspora Wealth Network connects ambitious professionals, entrepreneurs and investors who want to develop careers, businesses, brands, income opportunities and long-term assets.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#join-dwn" className="inline-block bg-accent text-primary font-bold tracking-widest uppercase text-sm py-4 px-10 rounded-full hover:scale-105 transition-all shadow-xl">
              Join Diaspora Wealth Network
            </a>
            <a href="#discover-dwn" className="inline-block bg-transparent border-2 border-ivory text-ivory font-bold tracking-widest uppercase text-sm py-4 px-10 rounded-full hover:bg-ivory hover:text-primary transition-all">
              Discover DWN
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
          {props.map((prop, idx) => (
            <motion.div 
              key={prop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden text-left p-8 rounded-[2rem] bg-ivory/5 border border-ivory/10 hover:border-accent hover:bg-dark/80 transition-all duration-500 backdrop-blur-sm"
            >
              <div className="text-accent font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                <span className="w-6 h-px bg-accent"></span> {prop.id}
              </div>
              <h3 className="text-2xl font-black tracking-widest mb-3 text-ivory group-hover:text-accent transition-colors">{prop.title}</h3>
              <p className="text-ivory/70 font-medium leading-relaxed">{prop.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DWNSection;
