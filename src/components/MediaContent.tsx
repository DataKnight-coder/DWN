import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MediaContent: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  // Directly mapping to the MP4 files you placed in the public folder
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
    <section id="insights" className="bg-ivory py-32 overflow-hidden border-t border-primary/10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left: Text & Episodes list */}
          <div className="lg:w-5/12 sticky top-32">
            <div className="text-primary font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-4">
              <span className="w-12 h-px bg-primary"></span>
              Insights & Media
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-primary tracking-tighter mb-8 leading-[1.05]">
              Watch & <span className="font-serif italic font-light text-accent drop-shadow-sm">Learn.</span>
            </h2>
            <p className="text-xl text-primary/70 font-medium mb-12 max-w-lg leading-relaxed">
              Direct insights from Dr. Hauwa on strategy, career transitions, and the mindset required for unshakeable wealth.
            </p>

            <div className="space-y-4">
              {videos.map((video, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveIdx(idx)}
                  className={`group flex items-center gap-6 p-5 rounded-2xl transition-all cursor-pointer border ${idx === activeIdx ? 'bg-white border-accent shadow-xl' : 'bg-transparent border-transparent hover:bg-white hover:border-primary/5 hover:shadow-lg'}`}
                >
                  <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-colors ${idx === activeIdx ? 'bg-accent text-dark' : 'bg-primary/5 text-primary group-hover:bg-accent group-hover:text-dark'}`}>
                    {idx === activeIdx ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-lg leading-tight mb-1">{video.title}</h4>
                    <p className="text-xs font-medium text-primary/50 line-clamp-1">{video.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: The Actual Video Player (Optimized for Vertical/Mobile Video) */}
          <motion.div 
            key={activeIdx} // Forces re-render/animation when video changes
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:w-7/12 w-full relative flex justify-center lg:justify-end"
          >
            <div className="bg-primary rounded-[2.5rem] p-4 shadow-[0_30px_60px_-15px_rgba(14,51,40,0.5)] relative overflow-hidden ring-1 ring-primary/5 w-full max-w-[400px]">
              
              {/* Aesthetic Video Container (Vertical 9:16 Aspect Ratio) */}
              <div className="relative w-full aspect-[9/16] rounded-[2rem] overflow-hidden bg-black shadow-inner">
                <video 
                  controls 
                  autoPlay={false}
                  playsInline
                  className="w-full h-full object-contain"
                  src={videos[activeIdx].src}
                  poster="/dr-hauwa.jpg"
                >
                  Your browser does not support HTML video.
                </video>
              </div>

              {/* Video Metadata Panel */}
              <div className="p-4 md:p-6 text-ivory text-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">Now Playing</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-3">{videos[activeIdx].title}</h3>
                <p className="text-ivory/70 font-medium leading-relaxed">{videos[activeIdx].desc}</p>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MediaContent;
