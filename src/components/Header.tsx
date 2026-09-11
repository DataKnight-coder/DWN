import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Menu } from 'lucide-react';

import MagneticElement from './MagneticElement';

interface HeaderProps {
  onOpenMobileNav: () => void;
  onOpenQuiz: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenMobileNav, onOpenQuiz }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.header
      className={`fixed w-full z-50 top-0 transition-all duration-500 ${
        isScrolled ? 'bg-ivory/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-tight text-primary flex-shrink-0">
          DR. HAUWA
        </div>

        {/* Desktop Nav - Pill Shape */}
        <nav className="hidden lg:flex items-center bg-primary rounded-full px-8 py-3 gap-8 shadow-lg">
          <a href="#about" className="text-ivory hover:text-accent font-medium text-sm transition-colors">About</a>
          <a href="#expertise" className="text-ivory hover:text-accent font-medium text-sm transition-colors">Expertise</a>
          <a href="#cybersecurity" className="text-ivory hover:text-accent font-medium text-sm transition-colors">Cybersecurity</a>
          <a href="#real-estate" className="text-ivory hover:text-accent font-medium text-sm transition-colors">Real Estate</a>
          <a href="#dwn" className="text-ivory hover:text-accent font-medium text-sm transition-colors">DWN</a>
          <a href="#insights" className="text-ivory hover:text-accent font-medium text-sm transition-colors">Insights</a>
        </nav>

        {/* Desktop CTA & Mobile Hamburger */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <MagneticElement className="hidden md:block">
            <a 
              href="#join-dwn" 
              className="bg-accent text-primary font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform text-sm shadow-lg block"
            >
              Join DWN
            </a>
          </MagneticElement>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={onOpenMobileNav}
            className="lg:hidden text-primary p-2 hover:bg-primary/5 rounded-full transition-colors"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
