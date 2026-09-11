import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const projects = [
  { id: 1, category: "Cybersecurity", title: "Enterprise Zero Trust Implementation", desc: "Led architecture for 5,000+ endpoints.", result: "Zero breaches in 24 months", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80" },
  { id: 2, category: "Real Estate", title: "Multi-Family Acquisition", desc: "Structured investment syndication.", result: "$2.4M Asset Value", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" },
  { id: 3, category: "Digital Marketing", title: "Global Launch Campaign", desc: "Digital acquisition strategy for SaaS.", result: "400% ROI in Q1", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" },
  { id: 4, category: "Community", title: "Diaspora Wealth Network Launch", desc: "Foundational community infrastructure.", result: "500+ Founding Members", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" },
  { id: 5, category: "Brand", title: "Executive Positioning", desc: "End-to-end brand architecture.", result: "Industry Keynote Features", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80" },
  { id: 6, category: "Business", title: "Agency Acquisition", desc: "Scaling and exiting digital agency.", result: "Successful Exit", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80" }
];

const categories = ["All", "Cybersecurity", "Real Estate", "Brand", "Digital Marketing", "Business", "Community"];

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState("All");

  const filteredProjects = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <section className="bg-ivory py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-6">Selected Work</h2>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                  filter === cat 
                    ? "bg-primary text-ivory shadow-lg" 
                    : "bg-transparent text-primary/60 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_15px_35px_-15px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all duration-500 cursor-pointer border border-primary/5"
              >
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-500" />
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-ivory text-primary text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    {project.category}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-primary mb-3 leading-tight">{project.title}</h3>
                  <p className="text-primary/70 text-sm font-medium mb-6">{project.desc}</p>
                  <div className="flex items-center justify-between border-t border-primary/10 pt-4">
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-primary/50 font-bold mb-1">Result</span>
                      <span className="text-accent font-black text-sm">{project.result}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-primary transition-colors">
                      →
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
