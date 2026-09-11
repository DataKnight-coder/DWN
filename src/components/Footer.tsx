import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-ivory pt-16 sm:pt-24 pb-12 border-t-4 border-accent relative overflow-hidden">
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10 mb-16">

          {/* Brand block – full width on mobile */}
          <div className="col-span-2 md:col-span-4 lg:col-span-5">
            {/* Animated 2D badge */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-6 group cursor-pointer">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute inset-0 z-0"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-accent opacity-80">
                  <path id="circlePath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
                  <text fontSize="9" fontWeight="bold">
                    <textPath href="#circlePath" startOffset="0%">FOUNDER • DIASPORA WEALTH NETWORK • </textPath>
                  </text>
                </svg>
              </motion.div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute inset-2.5 z-10 rounded-full overflow-hidden border-2 border-accent/50"
              >
                <img
                  src="/dr-hauwa.jpg"
                  alt="Dr. Hauwa"
                  className="w-full h-full object-cover object-top grayscale contrast-125 sepia-[0.3] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-accent/20 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-700 pointer-events-none" />
              </motion.div>
            </div>

            <div className="text-3xl sm:text-4xl font-black tracking-tighter text-ivory mb-3">DR. HAUWA</div>
            <p className="text-ivory/60 font-medium leading-relaxed max-w-xs text-sm sm:text-base">
              Building careers, brands, businesses, assets, and long-term wealth for the global diaspora.
            </p>

            {/* Social icons right under brand on mobile */}
            <div className="flex gap-3 mt-6 lg:hidden">
              <a href="https://www.facebook.com/drhauwaphd" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-accent hover:text-dark transition-all font-bold text-xs">FB</a>
              <a href="https://www.instagram.com/drhauwaphd?igsh=MTViejdrcXl1bXVtcA==" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-accent hover:text-dark transition-all font-bold text-xs">IG</a>
              <a href="https://vt.tiktok.com/ZSQhPTGCW/" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-accent hover:text-dark transition-all font-bold text-xs">TT</a>
            </div>
          </div>

          {/* Explore links */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-[10px] text-accent mb-5">Explore</h4>
            <ul className="space-y-3 font-medium text-ivory/70 text-sm">
              <li><a href="#about" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">About</a></li>
              <li><a href="#expertise" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Expertise</a></li>
              <li><a href="#cybersecurity" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Cybersecurity</a></li>
              <li><a href="#real-estate" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Real Estate</a></li>
              <li><a href="#insights" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Insights</a></li>
            </ul>
          </div>

          {/* Business links */}
          <div className="col-span-1 lg:col-span-3">
            <h4 className="font-bold uppercase tracking-widest text-[10px] text-accent mb-5">Business</h4>
            <ul className="space-y-3 font-medium text-ivory/70 text-sm">
              <li><a href="#join-dwn" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Diaspora Wealth Network</a></li>
              <li><a href="#join-dwn" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Work With Dr. Hauwa</a></li>
              <li><a href="#join-dwn" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Partnerships</a></li>
              <li><a href="#join-dwn" className="hover:text-ivory hover:translate-x-1 inline-block transition-transform">Consulting</a></li>
            </ul>
          </div>

          {/* Connect – desktop only (mobile social moved above) */}
          <div className="hidden lg:block lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-[10px] text-accent mb-5">Connect</h4>
            <ul className="flex gap-3 mb-6">
              <li><a href="https://www.facebook.com/drhauwaphd" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-accent hover:text-dark hover:border-accent transition-all font-bold text-sm">FB</a></li>
              <li><a href="https://www.instagram.com/drhauwaphd?igsh=MTViejdrcXl1bXVtcA==" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-accent hover:text-dark hover:border-accent transition-all font-bold text-sm">IG</a></li>
              <li><a href="https://vt.tiktok.com/ZSQhPTGCW/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-accent hover:text-dark hover:border-accent transition-all font-bold text-sm">TT</a></li>
            </ul>
            <a href="#join-dwn" className="inline-block w-full text-center bg-ivory text-dark font-black tracking-widest uppercase text-xs py-4 rounded-xl hover:bg-accent transition-colors">
              Join Newsletter
            </a>
          </div>

        </div>

        {/* WhatsApp CTA – mobile-friendly */}
        <div className="mb-10 py-6 px-5 sm:px-8 rounded-2xl border border-ivory/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ivory/60 text-sm font-medium text-center sm:text-left">Prefer a direct conversation? Send Dr. Hauwa a WhatsApp message.</p>
          <a
            href="https://wa.me/18253655299"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-accent text-primary font-black text-sm px-6 py-3 rounded-full shrink-0 hover:scale-105 transition-transform"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            +1 (825) 365 5299
          </a>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-ivory/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ivory/30">
          <div>&copy; {new Date().getFullYear()} DR. HAUWA. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-5">
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
