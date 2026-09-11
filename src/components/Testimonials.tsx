import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Amina Y.",
    role: "Tech Executive",
    location: "Toronto, Canada",
    text: "Dr. Hauwa's digital positioning strategy completely changed how recruiters see me. I secured a VP role with an $85K bump simply because we audited and rebuilt my professional brand.",
    colSpan: "col-span-1 md:col-span-2",
    bgColor: "bg-primary text-ivory"
  },
  {
    name: "David O.",
    role: "Real Estate Investor",
    location: "Calgary, Canada",
    text: "Moving from a high salary to actual asset ownership was a mindset shift. The DWN real estate framework gave me the exact blueprint to acquire my first multi-family property.",
    colSpan: "col-span-1",
    bgColor: "bg-ivory text-primary border border-primary/10"
  },
  {
    name: "Maria S.",
    role: "Cybersecurity Analyst",
    location: "London, UK",
    text: "As an immigrant, breaking into tech felt impossible. Dr. Hauwa's specific guidance on cybersecurity career transitions saved me years of trial and error.",
    colSpan: "col-span-1",
    bgColor: "bg-ivory text-primary border border-primary/10"
  },
  {
    name: "Samuel T.",
    role: "Agency Founder",
    location: "Dallas, TX",
    text: "The digital marketing systems she implemented scaled our client acquisition by 300%. She doesn't just teach theory; she builds engines.",
    colSpan: "col-span-1 md:col-span-2",
    bgColor: "bg-dark text-ivory"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-ivory py-32 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-6">
            Proof of <span className="font-serif italic font-light text-accent">Impact.</span>
          </h2>
        </div>

        {/* Masonry-Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`p-10 rounded-[2.5rem] shadow-xl flex flex-col justify-between ${t.colSpan} ${t.bgColor} hover:-translate-y-2 transition-transform duration-500`}
            >
              <div>
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={t.bgColor.includes('bg-ivory') ? 'text-accent' : 'text-accent'}>★</span>
                  ))}
                </div>
                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-10">"{t.text}"</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center font-black text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold tracking-tight">{t.name}</h4>
                  <p className={`text-sm font-medium ${t.bgColor.includes('bg-ivory') ? 'text-primary/60' : 'text-ivory/60'}`}>
                    {t.role} • {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
