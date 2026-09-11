import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const paths = [
  {
    id: "brand",
    title: "Personal Brand & Career Visibility",
    desc: "Position yourself so the right people understand your value.",
    link: "Explore Brand",
    color: "bg-sage",
    textColor: "text-primary",
  },
  {
    id: "digital",
    title: "Digital Marketing & Online Income",
    desc: "Use digital skills, content and systems to create new economic opportunities.",
    link: "Explore Digital",
    color: "bg-primary",
    textColor: "text-ivory",
  },
  {
    id: "cyber",
    title: "Cybersecurity Career Transition",
    desc: "Create a practical roadmap into one of today's most important digital career fields.",
    link: "Explore Cybersecurity",
    color: "bg-dark",
    textColor: "text-ivory",
  },
  {
    id: "wealth",
    title: "Real Estate & Wealth",
    desc: "Learn how income can become ownership, investment and long-term assets.",
    link: "Explore Wealth",
    color: "bg-accent",
    textColor: "text-dark",
  }
];

const ExpertisePaths: React.FC = () => {
  return (
    <section className="bg-ivory py-32">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-4">
            Build Your Pathways
          </h2>
          <p className="text-xl text-primary/70 max-w-2xl">
            Four specialized routes to accelerate your career, income, and long-term wealth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {paths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-[2rem] p-10 h-[400px] flex flex-col justify-end ${path.color} ${path.textColor}`}
            >
              {/* Image Placeholder (Can be replaced with actual images later) */}
              <div className="absolute inset-0 bg-black/5 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4 pr-10">{path.title}</h3>
                <p className="text-lg opacity-90 mb-8 max-w-md">{path.desc}</p>
                
                <a href={`/${path.id}`} className="inline-flex items-center gap-2 font-semibold text-lg group-hover:gap-4 transition-all">
                  {path.link} <ArrowRight size={24} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertisePaths;
