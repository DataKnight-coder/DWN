import React from 'react';
import offers from '../../content/offers.json';

const byId = (id: string) => offers.find(offer => offer.id === id)!;
const guide = byId('free-guide');
const training = byId('monetization-masterclass');
const dwn = byId('dwn-membership');
const awn = byId('african-wealth-network');
const session = byId('strategy-session');

const btn = 'inline-flex justify-center items-center font-bold rounded-full px-6 py-3 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-primary';

// A three-step path from free to personal help. Every price and benefit here is the confirmed wording used elsewhere on the site.
const YourPath: React.FC = () => (
  <section id="your-path" aria-labelledby="your-path-heading" className="bg-ivory py-12 sm:py-16 border-t border-primary/10">
    <div className="container mx-auto px-5 sm:px-6 max-w-6xl">
      <div className="max-w-3xl mb-8">
        <p className="text-xs font-black uppercase tracking-[.18em] text-[#45620a] mb-3">Your path</p>
        <h2 id="your-path-heading" className="text-4xl sm:text-5xl font-black text-primary tracking-tight leading-tight mb-4">
          Start free. <span className="font-serif italic font-normal text-[#45620a]">Go deeper when you are ready.</span>
        </h2>
        <p className="text-lg text-primary/80">You do not have to decide everything today. Take the first step, and move on only if it helps.</p>
      </div>
      <ol className="grid gap-5 lg:grid-cols-3 list-none p-0">
        <li className="rounded-3xl bg-white border border-primary/15 p-6 flex flex-col">
          <span aria-hidden="true" className="text-[#45620a] font-serif italic text-4xl">1</span>
          <h3 className="text-2xl font-black text-primary mt-1">Start free</h3>
          <p className="text-primary/75 mt-2 flex-1">Get the beginner guide, and join the free online monetization training that is held every quarter.</p>
          <div className="flex flex-col gap-3 mt-5">
            <a href={guide.url} data-offer-id={guide.id} data-cta="path_free_guide" target="_blank" rel="noreferrer" className={`${btn} bg-primary text-ivory hover:bg-dark`}>Get the free guide ↗</a>
            <a href={training.url} data-offer-id={training.id} data-cta="path_quarterly_training" target="_blank" rel="noreferrer" className={`${btn} border-2 border-primary text-primary hover:bg-primary hover:text-ivory`}>Join the free training ↗</a>
          </div>
        </li>
        <li className="rounded-3xl bg-primary text-ivory p-6 flex flex-col">
          <span aria-hidden="true" className="text-accent font-serif italic text-4xl">2</span>
          <h3 className="text-2xl font-black mt-1">Go deeper in the community</h3>
          <p className="text-ivory/80 mt-2 flex-1">DWN is $147 a year (price shown at checkout) and includes live training, mentorship, courses, networking events and downloadable resources. In Africa? The African Wealth Network is Dr. Hauwa&rsquo;s classroom for you.</p>
          <div className="flex flex-col gap-3 mt-5">
            <a href={dwn.url} data-offer-id={dwn.id} data-cta="path_join_dwn" target="_blank" rel="noreferrer" className={`${btn} bg-accent text-primary hover:bg-white`}>Join Diaspora Wealth Network ↗</a>
            <a href={awn.url} data-offer-id={awn.id} data-cta="path_join_awn" target="_blank" rel="noreferrer" className={`${btn} border-2 border-accent text-accent hover:bg-accent hover:text-primary`}>Join the African Wealth Network ↗</a>
          </div>
        </li>
        <li className="rounded-3xl bg-white border border-primary/15 p-6 flex flex-col">
          <span aria-hidden="true" className="text-[#45620a] font-serif italic text-4xl">3</span>
          <h3 className="text-2xl font-black text-primary mt-1">Get personal help</h3>
          <p className="text-primary/75 mt-2 flex-1">A paid one-on-one strategy session with Dr. Hauwa, for guidance on your own situation. The price is shown on Selfany before you pay.</p>
          <div className="flex flex-col gap-3 mt-5">
            <a href={session.url} data-offer-id={session.id} data-cta="path_strategy_session" target="_blank" rel="noreferrer" className={`${btn} bg-primary text-ivory hover:bg-dark`}>Book a paid strategy session ↗</a>
          </div>
        </li>
      </ol>
      <p className="text-sm text-primary/60 mt-6">Educational content. Results vary and nothing is guaranteed.</p>
    </div>
  </section>
);

export default YourPath;
