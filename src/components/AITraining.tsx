import React from 'react';

const topics = [
  ['Use AI with judgement', 'Frame useful prompts, check outputs and protect sensitive information.'],
  ['Work more efficiently', 'Explore research, writing and repeatable administrative workflows.'],
  ['Test business applications', 'Identify where an AI-assisted workflow may help a real customer or team.'],
];

export default function AITraining() {
  return <section id="ai-training-section" className="bg-dark text-ivory py-20 sm:py-28">
    <div className="container mx-auto px-5 sm:px-6 max-w-6xl grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
      <div><p className="uppercase tracking-[.2em] text-accent text-xs font-bold mb-4">Practical AI training</p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">Learn to use AI for meaningful work.</h2>
        <p className="mt-6 text-ivory/80 text-lg leading-relaxed">For immigrants, entrepreneurs and professionals who want to explore practical AI skills for productivity, digital opportunities and business automation. Start with a problem you know, then choose tools that help you solve it.</p>
        <div className="flex flex-wrap gap-4 mt-8"><a href="/ai-training/" className="bg-accent text-primary font-bold rounded-full px-7 py-3">Explore AI training</a><a href="#ai-training" className="border border-ivory/60 text-ivory font-bold rounded-full px-7 py-3">Ask about training</a></div>
        <p className="text-sm text-ivory/60 mt-5">Current format and enrollment details are provided when you enquire. No certification or income outcome is implied.</p>
      </div>
      <div className="border-t border-ivory/25">{topics.map(([title, description], index) => <div className="py-6 border-b border-ivory/25" key={title}><span className="text-accent text-sm font-bold">0{index + 1}</span><h3 className="text-xl font-bold mt-2">{title}</h3><p className="text-ivory/70 mt-2">{description}</p></div>)}</div>
    </div>
  </section>;
}
