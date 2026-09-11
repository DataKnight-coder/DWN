import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-ivory pt-24 pb-12 border-t-4 border-accent relative overflow-hidden">
      {/* Aesthetic Background Grain */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Column 1: Brand & Animated 2D Avatar */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5 pr-8">
            
            {/* The 2D Animated Rotating Badge */}
            <div className="relative w-36 h-36 mb-8 group cursor-pointer">
              {/* Rotating Text Ring */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute inset-0 z-0"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-accent opacity-80">
                  <path id="circlePath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
                  <text className="text-[10px] font-black tracking-widest uppercase">
                    <textPath href="#circlePath" startOffset="0%">FOUNDER • DIASPORA WEALTH NETWORK • </textPath>
                  </text>
                </svg>
              </motion.div>
              
              {/* Floating 2D-Styled Portrait Inside */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute inset-2.5 z-10 rounded-full overflow-hidden border-2 border-accent/50"
              >
                {/* 
                  Using CSS filters to create a 2D pop-art/duotone graphic effect from the real photo.
                  It starts as a stylized green/gold graphic and reveals the real photo on hover.
                */}
                <img 
                  src="/dr-hauwa.jpg" 
                  alt="Dr. Hauwa Avatar" 
                  className="w-full h-full object-cover object-top grayscale contrast-125 sepia-[0.3] hover:grayscale-0 hover:sepia-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-accent/20 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-700 pointer-events-none" />
              </motion.div>
            </div>

            <div className="text-4xl font-black tracking-tighter text-ivory mb-4">DR. HAUWA</div>
            <p className="text-ivory/60 font-medium leading-relaxed max-w-sm">
              Building careers, brands, businesses, assets, and long-term wealth for the global diaspora.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-xs text-accent mb-6">Explore</h4>
            <ul className="space-y-4 font-medium text-ivory/70">
              <li><a href="#about" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">About</a></li>
              <li><a href="#expertise" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Expertise</a></li>
              <li><a href="#cybersecurity" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Cybersecurity</a></li>
              <li><a href="#real-estate" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Real Estate</a></li>
              <li><a href="#insights" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Insights</a></li>
            </ul>
          </div>

          {/* Column 3: Business */}
          <div className="lg:col-span-3">
            <h4 className="font-bold uppercase tracking-widest text-xs text-accent mb-6">Business</h4>
            <ul className="space-y-4 font-medium text-ivory/70">
              <li><a href="#join-dwn" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Diaspora Wealth Network</a></li>
              <li><a href="#join-dwn" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Work With Dr. Hauwa</a></li>
              <li><a href="#join-dwn" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Partnerships</a></li>
              <li><a href="#join-dwn" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Consulting</a></li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-xs text-accent mb-6">Connect</h4>
            <ul className="flex gap-3 mb-8">
              <li><a href="https://www.facebook.com/drhauwaphd" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-accent hover:text-dark hover:border-accent transition-all font-bold text-sm">FB</a></li>
              <li><a href="https://www.instagram.com/drhauwaphd?igsh=MTViejdrcXl1bXVtcA==" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-accent hover:text-dark hover:border-accent transition-all font-bold text-sm">IG</a></li>
              <li><a href="https://vt.tiktok.com/ZSQhPTGCW/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-accent hover:text-dark hover:border-accent transition-all font-bold text-sm">TT</a></li>
            </ul>
            <a href="#join-dwn" className="inline-block w-full text-center bg-ivory text-dark font-black tracking-widest uppercase text-xs py-4 rounded-xl hover:bg-accent transition-colors">
              Join Newsletter
            </a>
          </div>

        </div>

        <div className="pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-ivory/30">
          <div>&copy; {new Date().getFullYear()} DR. HAUWA. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-accent transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
