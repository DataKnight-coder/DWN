import { CONTACT_EMAIL } from '../config/contact';
import React from 'react';
import { m as motion } from 'framer-motion';

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
                  loading="lazy"
                  decoding="async"
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
            <p className="font-bold uppercase tracking-widest text-[10px] text-accent mb-5">Explore</p>
            <ul className="space-y-3 font-medium text-ivory/70 text-sm">
              <li><a href="#about" className="hover:text-ivory hover:translate-x-1 inline-block py-2 transition-transform">About</a></li>
              <li><a href="#expertise" className="hover:text-ivory hover:translate-x-1 inline-block py-2 transition-transform">Expertise</a></li>
              <li><a href="#cybersecurity" className="hover:text-ivory hover:translate-x-1 inline-block py-2 transition-transform">Cybersecurity</a></li>
              <li><a href="#real-estate" className="hover:text-ivory hover:translate-x-1 inline-block py-2 transition-transform">Real Estate</a></li>
              <li><a href="/blog/" className="hover:text-ivory hover:translate-x-1 inline-block py-2 transition-transform">Blog</a></li>
              <li><a href="/opportunities/" className="hover:text-ivory hover:translate-x-1 inline-block py-2 transition-transform">Opportunities</a></li>
              <li><a href="/ai-training/" className="hover:text-ivory hover:translate-x-1 inline-block py-2 transition-transform">AI Training</a></li>
            </ul>
          </div>

          {/* Business links */}
          <div className="col-span-1 lg:col-span-3">
            <p className="font-bold uppercase tracking-widest text-[10px] text-accent mb-5">Business</p>
            <ul className="space-y-3 font-medium text-ivory/70 text-sm">
              <li><a href="https://selfany.com/thedwn" target="_blank" rel="noreferrer" className="hover:text-ivory hover:translate-x-1 inline-block py-2 transition-transform">DWN Membership on Selfany</a></li>
              <li><a href="#join-dwn" className="hover:text-ivory hover:translate-x-1 inline-block py-2 transition-transform">Ask About DWN</a></li>
              <li><a href="#contact" className="hover:text-ivory hover:translate-x-1 inline-block py-2 transition-transform">Consulting Enquiry</a></li>
            </ul>
          </div>

          {/* Connect – desktop only (mobile social moved above) */}
          <div className="hidden lg:block lg:col-span-2">
            <p className="font-bold uppercase tracking-widest text-[10px] text-accent mb-5">Connect</p>
            <ul className="flex gap-3 mb-6">
              <li><a href="https://www.facebook.com/drhauwaphd" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-accent hover:text-dark hover:border-accent transition-all font-bold text-sm">FB</a></li>
              <li><a href="https://www.instagram.com/drhauwaphd?igsh=MTViejdrcXl1bXVtcA==" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-accent hover:text-dark hover:border-accent transition-all font-bold text-sm">IG</a></li>
              <li><a href="https://vt.tiktok.com/ZSQhPTGCW/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-accent hover:text-dark hover:border-accent transition-all font-bold text-sm">TT</a></li>
            </ul>
            <a href="#updates" className="inline-block w-full text-center bg-ivory text-dark font-black tracking-widest uppercase text-xs py-4 rounded-xl hover:bg-accent transition-colors">
              Get Updates
            </a>
          </div>

        </div>

        {/* Email CTA */}
        <div className="mb-10 py-6 px-5 sm:px-8 rounded-2xl border border-ivory/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ivory/60 text-sm font-medium text-center sm:text-left">Questions? Email Dr. Hauwa's team and we will reply.</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            data-cta="footer_email"
            className="inline-flex items-center gap-3 bg-accent text-primary font-black text-sm px-6 py-3 rounded-full shrink-0 hover:scale-105 transition-transform"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-ivory/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ivory/30">
          <div>&copy; {new Date().getFullYear()} DR. HAUWA. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-3"><a href="#unsubscribe" className="inline-block py-2 hover:text-accent transition-colors">Stop DWN emails</a><a href="/privacy-policy/" className="inline-block py-2 hover:text-accent transition-colors">Privacy</a><a href="/disclaimer/" className="inline-block py-2 hover:text-accent transition-colors">Disclaimer</a><button type="button" onClick={() => window.dispatchEvent(new Event('dwn-open-tracking-choices'))} className="hover:text-accent transition-colors underline">Tracking choices</button></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
