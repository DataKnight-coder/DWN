import React from 'react';

// Answers use only facts already published on the site. Native <details> needs no script and is keyboard accessible.
const faqs: { q: string; a: React.ReactNode }[] = [
  { q: 'Who is Diaspora Wealth Network for?',
    a: 'Immigrants, diaspora professionals and entrepreneurs who want structured learning, mentorship and a community while they develop careers, businesses and long-term options.' },
  { q: 'Is DWN only for people in Canada?',
    a: 'No. The community is for the diaspora wherever you live. Dr. Hauwa\'s guides are written from a Canadian perspective, so some rules, such as work permits and tax, are Canadian.' },
  { q: 'How do I join, and what does it cost?',
    a: 'Membership is handled on Selfany. Choose "Become a DWN Member" and the current price is shown there before you pay. The free guide and the free masterclass cost nothing.' },
  { q: 'Do your guides promise income?',
    a: 'No. They are educational and give no income guarantee. Results vary by person, and each guide points you to official sources for work-permit, tax and advertising rules.' },
  { q: 'Is AI Training available yet?',
    a: <>Curriculum, dates and pricing are not published yet. You can <a href="#ai-training" className="font-bold underline underline-offset-4">register your interest</a> and Dr. Hauwa's team will follow up.</> },
  { q: 'Does Dr. Hauwa offer one-on-one sessions?',
    a: <>Yes. You can book a strategy session on Selfany, or <a href="#contact" className="font-bold underline underline-offset-4">send an enquiry</a> first if you have questions.</> },
];

const FAQ: React.FC = () => (
  <section id="faq" aria-labelledby="faq-heading" className="bg-ivory py-16 sm:py-24 border-t border-primary/10">
    <div className="container mx-auto px-5 sm:px-6 max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[.18em] text-[#45620a] mb-3">Questions</p>
      <h2 id="faq-heading" className="text-4xl sm:text-5xl font-black text-primary tracking-tight leading-tight mb-8">
        Before you <span className="font-serif italic font-normal text-[#45620a]">decide.</span>
      </h2>
      <div className="border-t border-primary/20">
        {faqs.map(item => (
          <details key={item.q} className="group border-b border-primary/20 py-1">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-6 py-4 text-lg sm:text-xl font-bold text-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary rounded">
              {item.q}
              <span aria-hidden="true" className="text-2xl leading-none text-[#45620a] transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="pb-5 pr-10 text-primary/80 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default FAQ;
