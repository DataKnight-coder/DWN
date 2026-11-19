import React from 'react';
import offers from '../../content/offers.json';

type Offer = { id: string; title: string; description: string; category: string; cta: string; url: string; provider: string };
const featured = (offers as Offer[]).filter(offer => ['free-guide', 'dwn-membership', 'strategy-session', 'monetization-masterclass'].includes(offer.id));

const Programs: React.FC = () => (
  <section id="all-programs" className="bg-ivory py-16 sm:py-24 border-t border-primary/10" aria-labelledby="next-step-heading">
    <div className="container mx-auto px-5 sm:px-6 max-w-6xl">
      <div className="max-w-3xl mb-9 sm:mb-12">
        <p className="text-xs font-black uppercase tracking-[.18em] text-[#45620a] mb-3">Explore your options</p>
        <h2 id="next-step-heading" className="text-4xl sm:text-5xl font-black text-primary tracking-tight leading-tight mb-4">Choose Your Next Step</h2>
        <p className="text-lg text-primary/80">Start with a free guide, explore the DWN community, or ask for individual strategy support. Each option has a different purpose.</p>
      </div>
      <div className="border-t border-primary/20">
        {featured.map((offer, index) => <article key={offer.id} className="grid gap-4 lg:grid-cols-[5rem_1fr_auto] items-center py-7 border-b border-primary/20">
          <span aria-hidden="true" className="text-[#45620a] font-serif italic text-3xl">0{index + 1}</span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#45620a] mb-1">{offer.category}</p>
            <h3 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">{offer.title}</h3>
            <p className="text-primary/75 mt-2 max-w-2xl">{offer.description}</p>
            {offer.id === 'dwn-membership' && <a href="/diaspora-wealth-network/" className="inline-block mt-3 text-primary font-bold underline underline-offset-4">Read about the membership</a>}
          </div>
          <a href={offer.url} data-offer-id={offer.id} data-cta={`home_${offer.id}`} target="_blank" rel="noreferrer"
            className="inline-flex justify-center items-center bg-primary text-ivory font-bold rounded-full px-6 py-3 hover:bg-dark focus-visible:outline-4 focus-visible:outline-accent whitespace-nowrap">
            {offer.cta} <span aria-hidden="true" className="ml-2">↗</span>
          </a>
        </article>)}
      </div>
      <a href="/opportunities/" className="inline-flex mt-8 font-bold text-primary underline underline-offset-4">Compare all six opportunities →</a>
    </div>
  </section>
);

export default Programs;
