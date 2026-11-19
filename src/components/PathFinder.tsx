import React, { useState } from 'react';
import offers from '../../content/offers.json';
import { trackEvent } from '../utils/tracking';

type Offer = { id: string; title: string; cta: string; url: string };
const byId = (id: string) => (offers as Offer[]).find(offer => offer.id === id)!;

// Each choice routes to one verified first step. Nothing here is a price, date or promise.
const choices = [
  { id: 'earn', label: 'Earn extra income', hint: 'Explore practical online income skills.',
    title: 'Start with the free guide', body: 'A free beginner resource introducing practical online income opportunities.',
    primary: { text: byId('free-guide').cta, href: byId('free-guide').url, offer: 'free-guide' },
    secondary: { text: 'Then join the free masterclass', href: byId('monetization-masterclass').url, offer: 'monetization-masterclass' } },
  { id: 'ai', label: 'Learn AI skills', hint: 'Use AI for work, learning and business.',
    title: 'Explore AI Training', body: 'Practical AI skills for work and business. Curriculum and dates are not published yet, so you can register your interest.',
    primary: { text: 'Explore AI Training', href: '/ai-training/' },
    secondary: { text: 'Register your interest', href: '#ai-training' } },
  { id: 'community', label: 'Join a community', hint: 'Learn with others and get mentorship.',
    title: 'See what DWN includes', body: 'Community education, mentorship and exploration of 18 income pathways.',
    primary: { text: byId('dwn-membership').cta, href: byId('dwn-membership').url, offer: 'dwn-membership' },
    secondary: { text: 'Read about DWN first', href: '/diaspora-wealth-network/' } },
  { id: 'talk', label: 'Talk to Dr. Hauwa', hint: 'Plan your next step one on one.',
    title: 'Book a strategy session', body: 'Personalized guidance to identify opportunities and develop an actionable growth strategy.',
    primary: { text: byId('strategy-session').cta, href: byId('strategy-session').url, offer: 'strategy-session' },
    secondary: { text: 'Or send an enquiry', href: '#contact' } },
];

const PathFinder: React.FC = () => {
  const [picked, setPicked] = useState<string | null>(null);
  const choice = choices.find(item => item.id === picked) || null;
  const external = (href: string) => href.startsWith('http');

  return (
    <section id="start-here" aria-labelledby="start-here-heading" className="bg-white py-16 sm:py-20 border-t border-primary/10">
      <div className="container mx-auto px-5 sm:px-6 max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[.18em] text-[#45620a] mb-3">Start here</p>
        <h2 id="start-here-heading" className="text-4xl sm:text-5xl font-black text-primary tracking-tight leading-tight mb-8">
          What do you want to do <span className="font-serif italic font-normal text-[#45620a]">first?</span>
        </h2>

        <fieldset className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 border-0 p-0 m-0">
          <legend className="sr-only">Choose what you want to do first</legend>
          {choices.map(item => (
            <label key={item.id} className="block cursor-pointer">
              <input type="radio" name="path-finder" value={item.id} checked={picked === item.id}
                onChange={() => { setPicked(item.id); trackEvent('path_finder_select', { choice: item.id }); }}
                className="sr-only peer" />
              <span className="block h-full rounded-2xl border-2 border-primary/20 bg-white p-5 transition-shadow duration-200 peer-checked:border-primary peer-checked:ring-4 peer-checked:ring-accent peer-focus-visible:ring-4 peer-focus-visible:ring-primary hover:border-primary/60">
                <span className="block text-lg font-black text-primary mb-1">{item.label}</span>
                <span className="block text-sm text-primary/75 leading-snug">{item.hint}</span>
              </span>
            </label>
          ))}
        </fieldset>

        {/* Reserved height so the result appearing does not move the page. */}
        <div role="status" aria-live="polite" className="mt-6 min-h-[11rem] sm:min-h-[9rem]">
          {choice ? (
            <div className="rounded-2xl bg-primary text-ivory p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="max-w-2xl">
                <p className="text-[11px] font-black uppercase tracking-[.16em] text-accent mb-1">Your best first step</p>
                <h3 className="text-2xl font-black tracking-tight">{choice.title}</h3>
                <p className="text-ivory/80 mt-1">{choice.body}</p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end shrink-0">
                <a href={choice.primary.href} data-offer-id={(choice.primary as { offer?: string }).offer} data-cta={`pathfinder_${choice.id}`}
                  {...(external(choice.primary.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="inline-flex justify-center bg-accent text-primary font-bold rounded-full px-6 py-3 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent">
                  {choice.primary.text}
                </a>
                <a href={choice.secondary.href} data-offer-id={(choice.secondary as { offer?: string }).offer} data-cta={`pathfinder_${choice.id}_more`}
                  {...(external(choice.secondary.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="text-sm font-bold underline underline-offset-4 text-ivory text-center sm:text-right">
                  {choice.secondary.text}
                </a>
              </div>
            </div>
          ) : (
            <p className="text-primary/70">Choose an option to see your best first step.</p>
          )}
        </div>

        <p className="mt-2 text-sm text-primary/70">
          Prefer to see everything? <a href="#all-programs" className="font-bold text-primary underline underline-offset-4">Compare all opportunities</a>
        </p>
      </div>
    </section>
  );
};

export default PathFinder;
