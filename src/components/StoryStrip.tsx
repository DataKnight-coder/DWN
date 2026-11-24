import React from 'react';

// A short, true version of the founder story, placed right under the hero so visitors meet the person before the offers.
const StoryStrip: React.FC = () => (
  <section id="my-story" aria-labelledby="my-story-heading" className="bg-white border-y border-primary/10 py-10 sm:py-14">
    <div className="container mx-auto px-5 sm:px-6 max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[.18em] text-[#45620a] mb-3">My story, in 30 seconds</p>
      <h2 id="my-story-heading" className="text-3xl sm:text-4xl font-black text-primary tracking-tight leading-tight mb-5">
        I started in a Walmart freezer. <span className="font-serif italic font-normal text-[#45620a]">With a PhD.</span>
      </h2>
      <p className="text-lg sm:text-xl text-primary/80 leading-relaxed">
        I thought a job was the whole plan. It wasn&rsquo;t. I became a cybersecurity analyst, then a realtor, and I kept learning new skills on the side. What helped most was learning how things really work, step by step. That is why I built the Diaspora Wealth Network, so nobody has to figure it out the hard way. No hype, and no promises of results.
      </p>
      <p className="mt-4 font-bold text-primary">Dr. Hauwa <a href="/about/" className="ml-3 inline-block py-2 underline underline-offset-4">Read my full story →</a></p>
    </div>
  </section>
);

export default StoryStrip;
