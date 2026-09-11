import React from 'react';
import { motion } from 'framer-motion';

const waNumber = "18253655299";

const programs = [
  {
    title: "Career Accelerator Roadmap",
    category: "CAREER DEVELOPMENT",
    desc: "Position your experience to land high-paying roles in the Canadian and US tech markets.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80",
    whatsappMessage: "Hi Dr. Hauwa, I'm interested in learning more about the Career Accelerator Roadmap."
  },
  {
    title: "Real Estate & Asset Building",
    category: "WEALTH EDUCATION",
    desc: "Step-by-step strategies for first-time buyers and property investors.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
    whatsappMessage: "Hi Dr. Hauwa, I'm interested in the Real Estate & Asset Building program."
  },
  {
    title: "Digital Income Systems",
    category: "ENTREPRENEURSHIP",
    desc: "Launch scalable digital products and businesses using modern tools.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    whatsappMessage: "Hi Dr. Hauwa, I'm interested in the Digital Income Systems program."
  },
  {
    title: "Diaspora Wealth Mentorship",
    category: "COMMUNITY PROGRAMS",
    desc: "Direct guidance, accountability, and networking for ambitious professionals.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    whatsappMessage: "Hi Dr. Hauwa, I'm interested in joining the Diaspora Wealth Mentorship."
  }
];

const Programs: React.FC = () => {
  return (
    <section id="all-programs" className="bg-ivory py-32 overflow-hidden border-t border-primary/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-5xl md:text-6xl font-black text-primary tracking-tighter mb-4">
              Frameworks for <span className="font-serif italic font-light text-accent drop-shadow-sm">Success.</span>
            </h2>
          </div>
          <a 
            href={`https://wa.me/${waNumber}?text=Hi%20Dr.%20Hauwa,%20I%20want%20to%20know%20more%20about%20your%20programs.`}
            target="_blank"
            rel="noreferrer"
            className="text-primary font-bold uppercase tracking-widest text-sm hover:text-accent transition-colors flex items-center gap-2"
          >
            Chat on WhatsApp →
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((prog, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer flex flex-col"
            >
              <a 
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(prog.whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="block relative w-full aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden mb-6 bg-primary shadow-lg"
              >
                <img 
                  src={prog.image} 
                  alt={prog.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 mix-blend-luminosity group-hover:mix-blend-normal"
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply group-hover:opacity-0 transition-opacity" />
              </a>
              
              <div className="text-accent font-bold uppercase tracking-widest text-[10px] mb-3">{prog.category}</div>
              <h3 className="text-2xl font-bold text-primary mb-3 leading-tight tracking-tight">{prog.title}</h3>
              <p className="text-primary/70 font-medium text-sm mb-8 flex-grow leading-relaxed">{prog.desc}</p>
              
              <a 
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(prog.whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between w-full p-4 rounded-xl border border-primary/10 text-primary font-black uppercase tracking-widest text-xs hover:bg-accent hover:border-accent transition-all mt-auto"
              >
                Explore Program <span className="text-lg leading-none">→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
