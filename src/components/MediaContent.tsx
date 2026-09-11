import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MediaContent: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const videos = [
    {
      title: "Message to Immigrant Professionals",
      desc: "Strategic advice on building assets, authority, and leveraging your unique position in the diaspora.",
      src: "/HAUWA VIDEO TO IMMIGRANT.mp4"
    },
    {
      title: "The Vision & The Brand",
      desc: "Understanding the core philosophy behind Dr. Hauwa's digital authority and business ecosystem.",
      src: "/Hauwa Video.mp4"
    }
  ];

  return (
    <section id="insights" className="bg-ivory py-20 sm:py-32 overflow-hidden border-t border-primary/10">
      <div className="container mx-auto px-5 sm:px-6 max-w-7xl">

        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <div className="text-primary font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-4">
            <span className="w-12 h-px bg-primary"></span>
            Insights & Media
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-primary tracking-tighter mb-4 leading-[1.05]">
            Watch & <span className="font-serif italic font-light text-accent drop-shadow-sm">Learn.</span>
          </h2>
          <p className="text-base sm:text-xl text-primary/70 font-medium max-w-2xl leading-relaxed">
            Direct insights from Dr. Hauwa on strategy, career transitions, and the mindset required for unshakeable wealth.
          </p>
        </div>

        {/* Playlist selector - horizontal scroll on mobile */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:overflow-visible">
          {videos.map((video, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`flex-shrink-0 flex items-center gap-4 p-4 sm:p-5 rounded-2xl transition-all cursor-pointer border text-left max-w-[80vw] sm:max-w-none ${idx === activeIdx ? 'bg-white border-accent shadow-xl' : 'bg-white/60 border-transparent hover:border-primary/10 hover:shadow-md'}`}
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full flex items-center justify-center transition-colors ${idx === activeIdx ? 'bg-accent text-dark' : 'bg-primary/5 text-primary'}`}>
                {idx === activeIdx ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-primary text-sm sm:text-base leading-tight mb-0.5 line-clamp-2">{video.title}</h4>
                <p className="text-[11px] sm:text-xs font-medium text-primary/50 line-clamp-1">{video.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Video Player - full width on mobile, constrained on desktop */}
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center"
        >
          <div className="bg-primary rounded-[1.5rem] sm:rounded-[2.5rem] p-3 sm:p-4 shadow-[0_30px_60px_-15px_rgba(14,51,40,0.4)] w-full sm:w-auto">
            {/* Video: 9:16 vertical, capped at phone-width on desktop */}
            <div className="relative w-full sm:w-[360px] md:w-[400px] aspect-[9/16] rounded-[1rem] sm:rounded-[2rem] overflow-hidden bg-black">
              <video
                key={videos[activeIdx].src}
                controls
                playsInline
                className="w-full h-full object-contain"
                poster="/dr-hauwa.jpg"
              >
                <source src={videos[activeIdx].src} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            </div>

            {/* Metadata below video */}
            <div className="p-4 sm:p-6 text-ivory text-center">
              <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-widest rounded-full mb-3">Now Playing</span>
              <h3 className="text-lg sm:text-2xl font-black tracking-tight mb-2">{videos[activeIdx].title}</h3>
              <p className="text-ivory/60 font-medium leading-relaxed text-sm">{videos[activeIdx].desc}</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default MediaContent;
