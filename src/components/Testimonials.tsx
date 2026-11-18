import React, { useEffect, useState } from 'react';
import catalog from '../../content/testimonials.json';

type Testimonial = { id: string; quote: string; attribution: string; category: string; achievement?: string; publicEvidence?: boolean };

const Testimonials: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState(false);
  const [imagesAvailable, setImagesAvailable] = useState(false);
  useEffect(() => {
    fetch('/api/testimonials').then(response => response.ok ? response.json() : null)
      .then(data => { if (data && Array.isArray(data.testimonials))
        setItems(data.testimonials.map((row: Testimonial) => ({ ...row,
          achievement: catalog.find(item => item.id === row.id)?.achievement }))); })
      .catch(() => {});
    fetch('/api/health').then(response => response.json()).then(data => setImagesAvailable(Boolean(data.testimonialImages))).catch(() => {});
  }, []);
  if (!items.length) return null;
  const categories = ['All', ...new Set(items.map(item => item.category))];
  const filtered = category === 'All' ? items : items.filter(item => item.category === category);
  const visible = expanded || category !== 'All' ? filtered : filtered.slice(0, 6);
  return <section className="bg-ivory py-20" aria-labelledby="testimonials-title">
    <div className="container mx-auto px-6 max-w-7xl">
      <h2 id="testimonials-title" className="text-4xl md:text-6xl font-black text-primary tracking-tight mb-4">Member experiences</h2>
      <p className="text-primary/70 mb-8">These are member-reported experiences. Individual outcomes vary.</p>
      <div className="flex flex-wrap gap-2 mb-8" aria-label="Filter experiences">
        {categories.map(name => <button key={name} type="button" onClick={() => setCategory(name)}
          aria-pressed={category === name} className={`rounded-full px-4 py-2 text-sm font-bold ${category === name ? 'bg-primary text-ivory' : 'border border-primary/20 text-primary'}`}>{name}</button>)}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map(item => <blockquote key={item.id} className="bg-white border border-primary/10 rounded-3xl p-8 shadow-sm">
          {imagesAvailable && item.publicEvidence && <a href={`/api/testimonial-images/${encodeURIComponent(item.id)}`} target="_blank" rel="noreferrer" className="block mb-5 text-sm font-bold underline">View original screenshot</a>}
          <p className="text-lg leading-relaxed text-primary">“{item.quote}”</p>
          <footer className="mt-6 text-sm font-bold text-primary/70">{item.attribution} · {item.achievement || item.category}</footer>
        </blockquote>)}
      </div>
      {!expanded && category === 'All' && filtered.length > 6 && <button type="button" onClick={() => setExpanded(true)} className="mt-8 border border-primary/20 rounded-full px-7 py-3 font-bold">View more member experiences</button>}
      <a href="https://selfany.com/thedwn" data-cta="testimonials_membership" target="_blank" rel="noreferrer" className="inline-block mt-10 bg-primary text-ivory font-bold px-8 py-4 rounded-full">Explore DWN membership</a>
    </div>
  </section>;
};

export default Testimonials;
