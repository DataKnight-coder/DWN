import React from 'react';
import { m as motion } from 'framer-motion';
import TestimonialProof from './TestimonialProof';
import { proofVariant, recordProofEvent } from '../utils/testimonialExperiments';

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
    <section id="dwn" className="bg-primary text-ivory py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80"
          alt="DWN Community"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1]"
          >
            Build More Than<br />
            <span className="text-accent italic font-serif font-medium">A Career.</span>
          </motion.h2>
          <p className="text-base sm:text-xl font-medium opacity-80 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
            Diaspora Wealth Network connects ambitious professionals, entrepreneurs and investors who want to develop careers, businesses, brands, income opportunities and long-term assets.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="w-[230px]">
              <video controls playsInline preload="none" poster="/dwn-community-intro-poster.jpg" width={360} height={640} className="w-full h-auto rounded-2xl shadow-xl bg-dark" aria-label="Dr. Hauwa introduces the Diaspora Wealth Network">
                <source src="/dwn-community-intro.mp4" type="video/mp4" />
                Your browser does not support video.
              </video>
              <p className="text-sm text-ivory/70 mt-3">A short introduction to DWN from Dr. Hauwa. The clip includes on-screen text.</p>
            </div>
            <div className="w-[230px]">
              <video controls playsInline preload="none" poster="/dwn-two-versions-poster.jpg" width={360} height={640} className="w-full h-auto rounded-2xl shadow-xl bg-dark" aria-label="Two versions of you, a short story clip from Dr. Hauwa">
                <source src="/dwn-two-versions.mp4" type="video/mp4" />
                Your browser does not support video.
              </video>
              <p className="text-sm text-ivory/70 mt-3">Two versions of you: a short story-led clip. The clip includes on-screen text.</p>
            </div>
            <div className="w-[230px]">
              <video controls playsInline preload="none" poster="/dwn-wins-poster.jpg" width={360} height={640} className="w-full h-auto rounded-2xl shadow-xl bg-dark" aria-label="Dr. Hauwa on opportunities and member wins inside the Diaspora Wealth Network">
                <source src="/dwn-wins.mp4" type="video/mp4" />
                Your browser does not support video.
              </video>
              <p className="text-sm text-ivory/70 mt-3">Inside DWN: opportunities and member wins. The clip includes on-screen text; results vary by person.</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-ivory/80 -mt-4 mb-8 max-w-2xl mx-auto">Some clips mention commenting or sending a DM for a link. You can skip that and use the buttons below to get the free masterclass or join DWN directly.</p>
          <div className="grid gap-6 sm:grid-cols-2 text-center">
            <div>
              <TestimonialProof placement="webinar" />
              <a href="https://selfany.com/w/DrHauwaPhD1" data-cta="dwn_webinar" target="_blank" rel="noreferrer" onClick={() => { const variant = proofVariant('webinar'); recordProofEvent('webinar', variant, 'click', variant === 'quote' ? 'dwn-pdf-16' : undefined); }} className="inline-block bg-accent text-primary font-bold tracking-widest uppercase text-sm py-4 px-8 sm:px-10 rounded-full hover:scale-105 transition-all shadow-xl">
                Explore the Free Webinar
              </a>
            </div>
            <div>
              <TestimonialProof placement="membership" />
              <a href="https://selfany.com/thedwn" data-cta="dwn_membership" target="_blank" rel="noreferrer" onClick={() => { const variant = proofVariant('membership'); recordProofEvent('membership', variant, 'click', variant === 'quote' ? 'dwn-pdf-13' : undefined); }} className="inline-block bg-transparent border-2 border-ivory text-ivory font-bold tracking-widest uppercase text-sm py-4 px-8 sm:px-10 rounded-full hover:bg-ivory hover:text-primary transition-all">
                View DWN Membership
              </a>
              <p className="text-sm text-ivory/70 mt-3">Annual membership: $147/year (current Selfany price; confirm at checkout).</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {props.map((prop, idx) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden text-left p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-ivory/5 border border-ivory/10 hover:border-accent hover:bg-dark/80 transition-all duration-500 backdrop-blur-sm"
            >
              <div className="text-accent font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                <span className="w-6 h-px bg-accent"></span> {prop.id}
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-widest mb-3 text-ivory group-hover:text-accent transition-colors">{prop.title}</h3>
              <p className="text-ivory/70 font-medium leading-relaxed text-sm sm:text-base">{prop.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DWNSection;
