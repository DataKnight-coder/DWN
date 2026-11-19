import offers from '../../content/offers.json';
import React from 'react';
import { m as motion } from 'framer-motion';

const Story: React.FC = () => {
  return (
    <section id="about" className="bg-ivory py-14 sm:py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 lg:gap-x-12 lg:grid-cols-2 xl:grid-cols-[4fr_5fr_250px] items-start">
          
          {/* Left: Editorial Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[280px] sm:max-w-md mx-auto lg:max-w-none lg:row-span-2 xl:row-span-1 relative"
          >
            <div className="w-full aspect-[3/4] md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img 
                loading="lazy"
                decoding="async"
                src="/dr-hauwa.jpg" 
                alt="Dr. Hauwa Biography" 
                className="w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-1000"
              />
              {/* Subtle film grain overlay */}
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </div>
            {/* Background decorative block */}
            <div className="absolute -bottom-8 -right-8 w-3/4 h-3/4 bg-primary rounded-3xl -z-10" />
          </motion.div>

          {/* Right: Biography Narrative */}
          <div>
            <h2 className="text-5xl md:text-6xl font-black text-primary tracking-tighter mb-8 leading-[1.05]">
              Career. Business.<br />
              Ownership. <span className="font-serif italic font-light text-[#45620a]">Impact.</span>
            </h2>
            
            <div className="space-y-5 text-base sm:text-lg text-primary/80 font-medium leading-relaxed">
              <p>
                Dr. Hauwa's journey is not a collection of random career switches. It is a highly intentional, compounding architecture of expertise. Each stage of her career expanded what she could build, own, teach, and contribute.
              </p>
              <p>
                Starting with the rigorous, high-stakes discipline of enterprise <strong className="text-primary font-black">Cybersecurity</strong>, she developed the analytical framework necessary to evaluate risk and identify massive opportunities.
              </p>
              <p>
                That analytical foundation translated directly into business and <strong className="text-primary font-black">Real Estate</strong>, moving beyond simply earning a high income to building lasting assets, leverage, and true ownership.
              </p>
              <p>
                Recognizing that "you cannot scale a secret," she mastered <strong className="text-primary font-black">Personal Branding and Digital Marketing</strong> to build visibility, authority, and community. Today, the <strong className="text-primary font-black">Diaspora Wealth Network</strong> serves as the culmination of these experiences—an ecosystem designed to help ambitious professionals execute the exact same blueprint.
              </p>
            </div>
          </div>

          {/* Video: its own grid cell, beside the text on wide screens */}
          <div className="max-w-[250px] mx-auto lg:mx-0 lg:col-start-2 xl:col-start-3 xl:row-start-1">
          <video controls playsInline preload="none" poster="/dwn-founder-story-poster.jpg" className="w-full rounded-2xl shadow-xl bg-dark" aria-label="Dr. Hauwa introduces her story and the Diaspora Wealth Network">
            <source src="/dwn-founder-story.mp4" type="video/mp4" />
            <track kind="captions" src="/captions/dwn-founder-story.en.vtt" srcLang="en" label="English" />
            Your browser does not support video.
          </video>
          <p className="text-sm text-primary/70 mt-3">Watch Dr. Hauwa discuss why a broader plan matters for people building a life abroad. The clip includes on-screen text.</p>
          <p className="text-sm text-primary/80 mt-3">The video mentions commenting or sending a DM for a link. You can use the button below instead.</p>
          <a href={offers.find(o => o.id === 'monetization-masterclass')!.url} data-offer-id="monetization-masterclass" data-cta="story_video_masterclass" target="_blank" rel="noreferrer" className="inline-block mt-3 bg-primary text-ivory font-bold text-sm py-3 px-6 rounded-full hover:bg-dark transition-colors">Secure Your Seat in the Free Masterclass</a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Story;
