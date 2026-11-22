import React from 'react';

const topics = [
  ['Find AI-training work', 'Tips and training on finding and applying for AI-training gigs on AI-training platforms, and on avoiding scams.'],
  ['Use AI with judgement', 'Frame useful prompts, check outputs, protect sensitive information and apply AI to research, writing and business tasks.'],
  ['Build other online income', 'Learn how eBay, Amazon and Shopify selling, dropshipping and affiliate marketing work, with the rules for each.'],
];

export default function AITraining() {
  return <section id="ai-training-section" className="bg-dark text-ivory py-14 sm:py-20">
    <div className="container mx-auto px-5 sm:px-6 max-w-6xl grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
      <div><p className="uppercase tracking-[.2em] text-accent text-xs font-bold mb-4">Practical AI training</p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">Learn AI skills, and how to find AI-training work.</h2>
        <p className="mt-6 text-ivory/80 text-lg leading-relaxed">Dr. Hauwa's community is open to anyone, wherever you live. Learn practical AI skills, how people find and prepare for paid AI-training work, and how to avoid scams. Read our guides, or ask a question.</p>
        <div className="flex flex-wrap gap-4 mt-8"><a href="/ai-training/" className="bg-accent text-primary font-bold rounded-full px-7 py-3">Explore AI training</a><a href="#ai-training" className="border border-ivory/60 text-ivory font-bold rounded-full px-7 py-3">Ask about training</a></div>
        <p className="text-sm text-ivory/60 mt-5">Each platform sets its own terms and pay, and DWN is not affiliated with them. Current format and enrollment details are provided when you enquire. No certification or income outcome is implied.</p>
      </div>
      <div className="border-t border-ivory/25">{topics.map(([title, description], index) => <div className="py-6 border-b border-ivory/25" key={title}><span className="text-accent text-sm font-bold">0{index + 1}</span><h3 className="text-xl font-bold mt-2">{title}</h3><p className="text-ivory/70 mt-2">{description}</p></div>)}</div>
    </div>
  </section>;
}
