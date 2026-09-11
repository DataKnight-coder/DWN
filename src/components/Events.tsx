import React from 'react';
import { motion } from 'framer-motion';

const events = [
  {
    date: "OCT 12",
    title: "Diaspora Wealth Summit 2026",
    location: "Toronto, ON & Virtual",
    desc: "The annual gathering of ambitious professionals and entrepreneurs.",
  },
  {
    date: "OCT 28",
    title: "Tech Transition Masterclass",
    location: "Online / Zoom",
    desc: "A focused session on breaking into high-income tech roles.",
  }
];

const Events: React.FC = () => {
  return (
    <section id="events" className="bg-primary text-ivory py-32">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-ivory/70">
              Connect in person and online with the Diaspora Wealth Network.
            </p>
          </div>
          <a href="#all-events" className="text-accent font-bold uppercase tracking-widest text-sm hover:text-ivory transition-colors">
            View All Events →
          </a>
        </div>

        <div className="space-y-6">
          {events.map((ev, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-center gap-8 bg-dark/50 p-8 md:p-10 rounded-[2rem] border border-ivory/10 hover:border-accent/50 transition-colors"
            >
              <div className="md:w-32 text-accent font-black text-3xl md:text-4xl uppercase leading-none">
                {ev.date.split(' ')[0]}<br />{ev.date.split(' ')[1]}
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{ev.title}</h3>
                <p className="text-ivory/70 mb-2">{ev.desc}</p>
                <div className="text-sm font-semibold tracking-wider text-sage uppercase">
                  {ev.location}
                </div>
              </div>
              <div>
                <a href="#register" className="inline-block border-2 border-ivory text-ivory font-bold py-3 px-8 rounded-full hover:bg-ivory hover:text-dark transition-colors whitespace-nowrap">
                  Register Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
