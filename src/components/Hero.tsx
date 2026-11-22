import React from 'react';
import offers from '../../content/offers.json';
import { NEXT_TRAINING } from '../config/training';

const membership = offers.find(offer => offer.id === 'dwn-membership')!;
const guide = offers.find(offer => offer.id === 'free-guide')!;
const africa = offers.find(offer => offer.id === 'african-wealth-network')!;
const masterclass = offers.find(offer => offer.id === 'monetization-masterclass')!;
const session = offers.find(offer => offer.id === 'strategy-session')!;


const quickStart = [
  { cta: 'hero_free-guide', href: guide.url, offer: guide.id, badge: 'Free', title: 'Get the free guide', sub: 'A beginner guide to online income', paid: false, icon: 'M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z' },
  { cta: 'hero_quarterly_training', href: masterclass.url, offer: masterclass.id, badge: `Free · ${NEXT_TRAINING}`, title: 'Join the free training', sub: 'Held every quarter, online', paid: false, icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
  { cta: 'hero_paid_session', href: session.url, offer: session.id, badge: 'Paid', title: 'Book a strategy session', sub: 'One-on-one with Dr. Hauwa', paid: true, icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { cta: 'hero_ai_training', href: '/ai-training/', offer: '', badge: 'Learn', title: 'Explore AI Training', sub: 'Practical AI skills, the safe way', paid: false, icon: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z' },
];

// The hero renders immediately with no entrance animation: the headline is the largest
// contentful paint, so it must not wait for a script-driven fade-in.
const Hero: React.FC = () => {
  return (
    <section className="relative bg-ivory text-primary flex items-center pt-12 sm:pt-16 pb-12 overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6">

        {/* Mobile: lead with the offer and actions before the portrait. */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-24 items-center gap-10">

          {/* Image: shown last on mobile */}
          <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-lg mx-auto aspect-[4/5] order-last lg:order-none">
            {/* Organic pill mask */}
            <div className="w-full h-full rounded-[120px_120px_0_120px] lg:rounded-[200px_200px_0_200px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(14,51,40,0.4)] relative bg-primary z-10">
              <img
                src="/dr-hauwa-800.webp"
                srcSet="/dr-hauwa-480.webp 480w, /dr-hauwa-800.webp 800w"
                sizes="(min-width: 1024px) 512px, 320px"
                width={800}
                height={800}
                fetchPriority="high"
                alt="Dr. Hauwa"
                className="w-full h-[120%] object-cover object-top opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 absolute -top-[10%]"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply pointer-events-none" />
            </div>

            {/* Static decorative glow (no continuous animation) */}
            <div aria-hidden="true" className="absolute -bottom-8 -right-8 w-32 h-32 sm:w-40 sm:h-40 bg-accent rounded-full -z-10 blur-2xl opacity-60" />
          </div>

          {/* Text content */}
          <div className="w-full text-center lg:text-left">
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#45620a] mb-4">Dr. Hauwa · Founder, Diaspora Wealth Network</p>
            <h1 className="text-[2.15rem] sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.4rem] font-black leading-[1.02] tracking-tighter mb-6 sm:mb-8 text-primary">
              Earn More.<br />
              Build Valuable Skills.<br />
              <span className="font-serif italic font-normal text-[#45620a]">Create Lasting Wealth.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-primary/80 mb-8 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
              Explore practical AI training, digital income opportunities, mentorship and wealth-building education for immigrants, professionals and entrepreneurs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
              <a
                href={membership.url}
                data-offer-id={membership.id}
                data-cta="hero_membership"
                target="_blank"
                rel="noreferrer"
                className="bg-primary text-ivory font-bold text-base py-4 px-8 rounded-full hover:bg-dark transition-colors shadow-xl text-center"
              >
                Join Diaspora Wealth Network
              </a>
              <a
                href={africa.url}
                data-offer-id={africa.id}
                data-cta="hero_africa"
                target="_blank"
                rel="noreferrer"
                className="bg-accent text-primary font-bold text-base py-4 px-8 rounded-full shadow-xl hover:scale-105 transition-transform text-center"
              >
                {africa.cta}
              </a>
            </div>

            <p className="text-sm text-primary/70 mb-6 max-w-xl mx-auto lg:mx-0">DWN is a paid, private community. See the price at checkout. It includes live training, mentorship, courses, networking events and downloadable resources. Results vary; nothing is guaranteed.</p>

            {/* Quick-start cards: each says what it is, whether it is free or paid, and where it goes. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7 max-w-xl mx-auto lg:mx-0">
              {quickStart.map(card => (
                <a
                  key={card.cta}
                  href={card.href}
                  {...(card.offer ? { 'data-offer-id': card.offer, target: '_blank', rel: 'noreferrer' } : {})}
                  data-cta={card.cta}
                  className="group flex items-start gap-3 text-left rounded-2xl bg-white border-2 border-primary/15 p-4 shadow-sm hover:border-primary hover:-translate-y-0.5 hover:shadow-lg transition focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span aria-hidden="true" className={`flex-none w-11 h-11 rounded-xl flex items-center justify-center ${card.paid ? 'bg-primary text-accent' : 'bg-accent text-primary'}`}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={card.icon} /></svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${card.paid ? 'bg-primary text-ivory' : 'bg-accent text-primary'}`}>{card.badge}</span>
                    <span className="block font-black text-primary leading-snug">{card.title}</span>
                    <span className="block text-sm text-primary/70 leading-snug mt-0.5">{card.sub}</span>
                  </span>
                  <span aria-hidden="true" className="flex-none self-center text-primary text-xl group-hover:translate-x-1 transition-transform">→</span>
                </a>
              ))}
            </div>

                        <figure className="mb-6 max-w-xl mx-auto lg:mx-0 border-l-4 border-accent pl-4 text-left">
              <blockquote className="text-primary/90 italic">“Wow.. since I joined DWN, it’s been new knowledge on a daily basis.”</blockquote>
              <figcaption className="text-xs text-primary/60 mt-1">Funmilayo Sarah Sotomide, DWN member. One member’s experience; results vary.</figcaption>
            </figure>

            {/* Expertise strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-3 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-primary/80">
              <span>Cybersecurity</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              <span>Real Estate</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              <span>Digital Marketing</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              <span>Personal Brand</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              <span>Entrepreneurship</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
