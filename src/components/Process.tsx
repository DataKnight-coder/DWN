import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { num: "01", title: "POSITION", desc: "Understand exactly where you are in your career or business, and map out the strategic gap to where you want to go." },
  { num: "02", title: "BUILD", desc: "Strengthen your career trajectory, personal brand, business systems, or real estate investment knowledge." },
  { num: "03", title: "CONNECT", desc: "Access the Diaspora Wealth Network community—connecting with ambitious people, verified mentors, and unlisted opportunities." },
  { num: "04", title: "GROW", desc: "Turn your accumulated knowledge, skills, digital visibility, and strategic ownership into measurable financial progress." }
];

const Process: React.FC = () => {
  return (
    <section className="bg-primary py-32 text-ivory overflow-hidden relative">
      {/* Aesthetic Background Graphic */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[80%] bg-accent/5 rounded-l-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-20">
          <div className="text-accent font-bold uppercase tracking-widest text-xs mb-4">Methodology</div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            How She <span className="font-serif italic font-light text-accent">Helps.</span>
          </h2>
          <p className="text-xl opacity-80 font-medium max-w-2xl">
            A clean, four-step journey designed to transition professionals from high-earners into asset-owners and industry authorities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="relative p-8 rounded-3xl bg-ivory/5 border border-ivory/10 hover:bg-ivory/10 transition-colors group"
            >
              <div className="text-6xl font-black text-ivory/10 mb-6 group-hover:text-accent/20 transition-colors">{step.num}</div>
              <h3 className="text-2xl font-bold tracking-widest mb-4 text-ivory group-hover:text-accent transition-colors">{step.title}</h3>
              <p className="text-ivory/70 font-medium leading-relaxed">{step.desc}</p>
              
              {/* Connector Line (Hidden on mobile) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 -right-4 w-8 h-px bg-ivory/20" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
