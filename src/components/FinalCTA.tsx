import React from 'react';

const FinalCTA: React.FC = () => {
  return (
    <section className="bg-dark text-ivory">
      <div className="grid md:grid-cols-2 min-h-[600px]">
        {/* Left: Text */}
        <div className="p-12 md:p-24 flex flex-col justify-center">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-8">
            Your Next Opportunity May Start With the <span className="text-accent">Right Connection.</span>
          </h2>
          <p className="text-xl opacity-80 mb-12 max-w-lg leading-relaxed">
            Join professionals, entrepreneurs and leaders building stronger careers, businesses and financial futures across the diaspora.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="#join-dwn" className="bg-accent text-dark font-semibold py-4 px-8 rounded-full hover:bg-ivory transition-colors">
              Join Diaspora Wealth Network
            </a>
            <a href="#contact" className="bg-transparent border border-ivory/30 font-semibold py-4 px-8 rounded-full hover:bg-ivory/10 transition-colors">
              Connect With Dr. Hauwa
            </a>
          </div>
        </div>

        {/* Right: Portrait / Image Placeholder */}
        <div className="relative bg-primary overflow-hidden min-h-[400px]">
          <img 
            src="/dr-hauwa.jpg" 
            alt="Dr. Hauwa" 
            className="absolute inset-0 w-full h-full object-cover object-top opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
