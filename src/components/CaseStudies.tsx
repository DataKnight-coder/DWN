import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const cases = [
  {
    category: "Cybersecurity Career Transition",
    situation: "Amina K. (Toronto) needed to transition her career and didn't know where to start.",
    strategy: "LinkedIn optimization + targeted networking strategy.",
    outcome: "Landed a cybersecurity role paying $92,000 within 3 months of joining.",
  },
  {
    category: "Career & Digital Growth",
    situation: "Maria S. (Vancouver) came to Canada with a marketing background but couldn't find her footing.",
    strategy: "Followed the practical roadmap to build digital visibility and clear direction.",
    outcome: "Found her professional footing and established a successful career path.",
  },
  {
    category: "Real Estate & Wealth",
    situation: "David O. (Calgary) wanted to enter the housing market but lacked newcomer credit history and guidance.",
    strategy: "Real estate investing module + first-time buyer strategy.",
    outcome: "Purchased first property within 18 months of arriving in Canada. Building generational wealth.",
  }
];

const CaseStudies: React.FC = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section ref={containerRef} className="bg-dark text-ivory py-32 overflow-hidden">
      <div className="container mx-auto px-6 mb-16">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          What <span className="text-accent">Progress</span> Looks Like
        </h2>
        <p className="text-xl opacity-80">Real strategies. Real outcomes.</p>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="pl-6 md:pl-16">
        <motion.div style={{ x }} className="flex gap-8 w-max">
          {cases.map((item, idx) => (
            <div key={idx} className="w-[400px] md:w-[600px] bg-primary rounded-[2rem] p-8 md:p-12 flex flex-col justify-between shrink-0 border border-sage/10 shadow-2xl">
              <div>
                <div className="text-accent font-bold tracking-widest uppercase text-sm mb-8">
                  {item.category}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sage font-semibold mb-2">Situation</h4>
                    <p className="text-lg text-ivory/90">{item.situation}</p>
                  </div>
                  <div>
                    <h4 className="text-sage font-semibold mb-2">Strategy</h4>
                    <p className="text-lg text-ivory/90">{item.strategy}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-ivory/10">
                <h4 className="text-accent font-semibold mb-2">Outcome</h4>
                <p className="text-2xl md:text-3xl font-bold leading-tight">{item.outcome}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudies;
