import React from 'react';
import offers from '../../content/offers.json';

const byId = (id: string) => offers.find(offer => offer.id === id)!;
const dwn = byId('dwn-membership');
const awn = byId('african-wealth-network');
const guide = byId('free-guide');

// The last thing a visitor sees before the footer: one clear next step, in plain words.
const ClosingBand: React.FC = () => (
  <section id="join" aria-labelledby="join-heading" className="bg-primary text-ivory py-14 sm:py-20">
    <div className="container mx-auto px-5 sm:px-6 max-w-4xl text-center">
      <h2 id="join-heading" className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
        Ready to take <span className="font-serif italic font-normal text-accent">the next step?</span>
      </h2>
      <p className="text-lg text-ivory/80 max-w-2xl mx-auto mb-8">
        Start with the free guide, or join the paid, private community. See the price at checkout. No hype, and no promises of results.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href={dwn.url} data-offer-id={dwn.id} data-cta="closing_join_dwn" target="_blank" rel="noreferrer" className="bg-accent text-primary font-bold py-4 px-8 rounded-full shadow-xl hover:bg-white transition-colors">Join Diaspora Wealth Network</a>
        <a href={awn.url} data-offer-id={awn.id} data-cta="closing_join_awn" target="_blank" rel="noreferrer" className="border-2 border-accent text-accent font-bold py-4 px-8 rounded-full hover:bg-accent hover:text-primary transition-colors">Join the African Wealth Network</a>
      </div>
      <p className="mt-6">
        <a href={guide.url} data-offer-id={guide.id} data-cta="closing_free_guide" target="_blank" rel="noreferrer" className="inline-block py-2 font-bold text-ivory underline underline-offset-4 hover:text-accent">Or start with the free guide →</a>
      </p>
    </div>
  </section>
);

export default ClosingBand;
