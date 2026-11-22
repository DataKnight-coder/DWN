import React from 'react';
import offers from '../../content/offers.json';

const membership = offers.find(offer => offer.id === 'dwn-membership')!;
const guide = offers.find(offer => offer.id === 'free-guide')!;
const africa = offers.find(offer => offer.id === 'african-wealth-network')!;
const masterclass = offers.find(offer => offer.id === 'monetization-masterclass')!;
const session = offers.find(offer => offer.id === 'strategy-session')!;

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

            <p className="text-sm text-primary/70 mb-6 max-w-xl mx-auto lg:mx-0">DWN membership is $147 a year (price shown at checkout) and includes live training, mentorship, courses, networking events and downloadable resources. Results vary; nothing is guaranteed.</p>

            <figure className="mb-6 max-w-xl mx-auto lg:mx-0 border-l-4 border-accent pl-4 text-left">
              <blockquote className="text-primary/90 italic">“Wow.. since I joined DWN, it’s been new knowledge on a daily basis.”</blockquote>
              <figcaption className="text-xs text-primary/60 mt-1">Funmilayo Sarah Sotomide, DWN member. One member’s experience; results vary.</figcaption>
            </figure>

            {/* Clear paths to AI Training and one-on-one consultations */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mb-8 font-bold text-primary">
              <a href={guide.url} data-offer-id={guide.id} data-cta="hero_free-guide" target="_blank" rel="noreferrer" className="underline underline-offset-4">Get the free guide →</a>
              <a href={masterclass.url} data-offer-id={masterclass.id} data-cta="hero_quarterly_training" target="_blank" rel="noreferrer" className="underline underline-offset-4">Free quarterly training: register for the next one →</a>
              <a href={session.url} data-offer-id={session.id} data-cta="hero_paid_session" target="_blank" rel="noreferrer" className="underline underline-offset-4">Paid strategy session →</a>
              <a href="/ai-training/" className="underline underline-offset-4">Explore AI Training →</a>
            </div>

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
