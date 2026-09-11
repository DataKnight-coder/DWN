import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  "Who is Diaspora Wealth Network for?",
  "Is DWN only for Canadians?",
  "How do I join?",
  "Is membership free or paid?",
  "Can entrepreneurs join?",
  "Does Dr. Hauwa offer private consultations?",
  "How can I stay updated?"
];

const FAQ: React.FC = () => {
  return (
    <section className="bg-ivory py-32 border-t border-primary/10">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((q, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer bg-white p-6 md:p-8 rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
            >
              <h3 className="text-xl font-bold text-primary pr-8">{q}</h3>
              <div className="w-10 h-10 shrink-0 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-ivory transition-colors">
                <Plus size={20} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
