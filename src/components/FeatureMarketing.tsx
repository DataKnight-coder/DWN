import React from 'react';
import { motion } from 'framer-motion';

const FeatureMarketing: React.FC = () => {
  const cases = [
    {
      client: "B2B Tech Founder",
      challenge: "High expertise, zero digital footprint.",
      strategy: "Executive content strategy + LinkedIn ecosystem.",
      execution: "90-day sprint of high-value technical insights.",
      result: "10,000+ targeted followers and 3 major enterprise contracts."
    },
    {
      client: "Real Estate Brokerage",
      challenge: "Relying purely on referrals, unpredictable lead flow.",
      strategy: "Digital acquisition funnel + Educational content.",
      execution: "Launched 'First-Time Buyer' automated webinar.",
      result: "Generated 40+ qualified buyer consultations per month."
    }
  ];

  return (
    <section className="bg-ivory py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left: Content */}
          <div className="lg:w-1/2">
            <div className="text-primary font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-4">
              <span className="w-12 h-px bg-primary"></span>
              Digital Marketing
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-primary tracking-tighter mb-8 leading-[1.05]">
              Strategy That Turns Visibility Into <span className="text-accent underline decoration-8 underline-offset-4">Growth.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-primary/80 mb-10 font-medium leading-relaxed">
              Dr. Hauwa doesn't just teach theory. Her digital marketing frameworks have been stress-tested across B2B technology, real estate, and personal branding to turn attention into measurable customer acquisition.
            </p>

            <a href="#explore-marketing" className="inline-block bg-primary text-ivory font-bold px-8 py-4 rounded-full hover:bg-dark transition-colors text-lg shadow-xl">
              Explore Digital Marketing
            </a>
          </div>

          {/* Right: Case Studies Layout */}
          <div className="lg:w-1/2 flex flex-col gap-8 w-full">
            {cases.map((c, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-primary/5 hover:border-accent transition-colors"
              >
                <div className="text-xs font-black uppercase tracking-widest text-accent mb-4">Case Study</div>
                <h4 className="text-xl font-bold text-primary mb-4">{c.client}</h4>
                
                <div className="space-y-3 text-sm font-medium">
                  <div className="grid grid-cols-[100px_1fr] gap-4">
                    <span className="text-primary/50 uppercase tracking-wider text-[10px]">Challenge</span>
                    <span className="text-primary/90">{c.challenge}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-4">
                    <span className="text-primary/50 uppercase tracking-wider text-[10px]">Strategy</span>
                    <span className="text-primary/90">{c.strategy}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-4">
                    <span className="text-primary/50 uppercase tracking-wider text-[10px]">Execution</span>
                    <span className="text-primary/90">{c.execution}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-4 pt-3 border-t border-primary/10 mt-2">
                    <span className="text-accent font-black uppercase tracking-wider text-[10px]">Result</span>
                    <span className="text-primary font-bold">{c.result}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureMarketing;
