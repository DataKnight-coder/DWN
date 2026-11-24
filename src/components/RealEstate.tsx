import React from 'react';
import offers from '../../content/offers.json';

const blueprint = offers.find(offer => offer.id === 'rent-free-blueprint')!;

// Education only. Nothing here is a price, a return or a promise.
const RealEstate: React.FC = () => (
  <section id="real-estate-focus" aria-labelledby="real-estate-heading" className="bg-primary text-ivory py-12 sm:py-16">
    <div className="container mx-auto px-5 sm:px-6 max-w-6xl">
      <div className="max-w-3xl mb-8">
        <p className="text-xs font-black uppercase tracking-[.18em] text-accent mb-3">Real estate</p>
        <h2 id="real-estate-heading" className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
          Property education from a <span className="font-serif italic font-normal text-accent">working realtor.</span>
        </h2>
        <p className="text-lg text-ivory/80">Dr. Hauwa is a realtor as well as a cybersecurity analyst. She teaches Canadian homeownership and property basics in plain language: how buying works, ways to reduce housing costs, and how property fits into long-term wealth. This is education, not financial advice, and results vary.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <a href={blueprint.url} data-offer-id={blueprint.id} data-cta="home_real_estate_blueprint" target="_blank" rel="noreferrer" className="block rounded-2xl border border-ivory/20 p-6 hover:bg-white/5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent">
          <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">Paid course</p>
          <h3 className="text-xl font-black mb-2">{blueprint.title}</h3>
          <p className="text-ivory/75 text-sm">{blueprint.description}</p>
          <span className="inline-block mt-4 font-bold text-accent">Explore the course ↗</span>
        </a>
        <a href="/blog/real-estate-investing-canada/" className="block rounded-2xl border border-ivory/20 p-6 hover:bg-white/5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent">
          <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">Free guide</p>
          <h3 className="text-xl font-black mb-2">Real estate investing in Canada: the basics</h3>
          <p className="text-ivory/75 text-sm">A plain-language starting point on property ownership and investing, with the questions to ask first.</p>
          <span className="inline-block mt-4 font-bold text-accent">Read the guide →</span>
        </a>
        <a href="/diaspora-wealth-network/" className="block rounded-2xl border border-ivory/20 p-6 hover:bg-white/5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent">
          <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">Community</p>
          <h3 className="text-xl font-black mb-2">Learn property with a community</h3>
          <p className="text-ivory/75 text-sm">DWN members learn alongside others and can ask Dr. Hauwa questions about homeownership and real estate.</p>
          <span className="inline-block mt-4 font-bold text-accent">See what DWN includes →</span>
        </a>
      </div>
    </div>
  </section>
);

export default RealEstate;
