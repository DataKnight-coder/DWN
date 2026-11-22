import React from 'react';

// Replaces the Journey, Expertise accordion, Real Estate, Cybersecurity and Process sections.
// Wording is the site's existing approved copy; each row points to a guide that already exists.
const areas = [
  { id: 'cybersecurity', no: '01', title: 'Cybersecurity & Tech',
    desc: 'Technology careers, digital risk awareness, and professional transition.',
    guide: 'How to get into cybersecurity in Canada', href: '/blog/cybersecurity-career-canada/' },
  { id: 'real-estate', no: '02', title: 'Real Estate & Assets',
    desc: 'Property ownership, investment awareness, and long-term wealth strategy.',
    guide: 'Real estate investing in Canada: the basics', href: '/blog/real-estate-investing-canada/' },
  { id: 'brand-marketing', no: '03', title: 'Personal Brand & Digital Marketing',
    desc: 'Authority building, professional positioning, online visibility, content strategy and audience growth.',
    guide: 'Affiliate marketing in Canada', href: '/blog/affiliate-marketing-canada/' },
  { id: 'entrepreneurship', no: '04', title: 'Entrepreneurship',
    desc: 'Multiple income channels, strategic growth, and business development.',
    guide: 'Side hustles in Canada', href: '/blog/side-hustles-canada/' },
  { id: 'ai-online-income', no: '05', title: 'AI Training & Online Selling',
    desc: 'Finding and preparing for AI-training work, plus eBay, Amazon and Shopify selling, dropshipping and affiliate marketing, with the rules for each.',
    guide: 'AI training jobs, and how to get started', href: '/blog/ai-training-jobs-guide/' },
];

const Expertise: React.FC = () => (
  <section id="expertise" aria-labelledby="expertise-heading" className="bg-white py-12 sm:py-16 border-t border-primary/10">
    <div className="container mx-auto px-5 sm:px-6 max-w-6xl">
      <div className="max-w-3xl mb-6 sm:mb-8">
        <p className="text-xs font-black uppercase tracking-[.18em] text-[#45620a] mb-3">Expertise</p>
        <h2 id="expertise-heading" className="text-4xl sm:text-5xl font-black text-primary tracking-tight leading-tight mb-4">
          Where Dr. Hauwa can <span className="font-serif italic font-normal text-[#45620a]">help you grow.</span>
        </h2>
        <p className="text-lg text-primary/80">Building expertise, ownership, visibility, income and long-term opportunity. Each area has a free guide to start with, and the AI and online-selling guides answer the questions people ask most.</p>
      </div>
      <div className="border-t border-primary/20">
        {areas.map(area => (
          <article key={area.id} id={area.id} className="grid gap-3 lg:grid-cols-[5rem_1fr_auto] items-center py-5 border-b border-primary/20 scroll-mt-24">
            <span aria-hidden="true" className="text-[#45620a] font-serif italic text-3xl">{area.no}</span>
            <div>
              <h3 className="text-2xl font-black text-primary tracking-tight">{area.title}</h3>
              <p className="text-primary/75 mt-1 max-w-2xl">{area.desc}</p>
            </div>
            <a href={area.href} className="inline-block py-2 font-bold text-primary underline underline-offset-4 hover:no-underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-primary">
              Read: {area.guide} <span aria-hidden="true">→</span>
            </a>
          </article>
        ))}
      </div>
      <a href="/blog/" className="inline-flex mt-6 py-3 font-bold text-primary underline underline-offset-4">See all guides →</a>
    </div>
  </section>
);

export default Expertise;
