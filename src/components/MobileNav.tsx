import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuiz: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onOpenQuiz }) => {
  const menuVars = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1, transition: { duration: 0.5, ease: [0.12, 0, 0.39, 0] } },
    exit: { scaleY: 0, transition: { delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };
  
  const linkVars = {
    initial: { y: "30vh", transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] } },
    open: { y: 0, transition: { duration: 0.5, ease: [0], staggerChildren: 0.05 } }
  };

  const links = [
    { name: "About", href: "#about" },
    { name: "Expertise", href: "#expertise" },
    { name: "Diaspora Wealth Network", href: "#dwn" },
    { name: "Programs", href: "#programs" },
    { name: "Insights", href: "#insights" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVars}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 bg-dark text-ivory z-[100] origin-top flex flex-col p-6 overflow-hidden"
        >
          <div className="flex justify-between items-center mb-16 pt-4">
            <div className="text-xl font-extrabold tracking-tight text-accent">DR. HAUWA</div>
            <button onClick={onClose} className="text-ivory hover:text-accent transition-colors p-2">
              Close ✕
            </button>
          </div>
          
          <motion.div variants={linkVars} initial="initial" animate="open" className="flex flex-col gap-6 text-2xl md:text-4xl font-black tracking-tight uppercase">
            {links.map((link, idx) => (
              <div key={idx} className="overflow-hidden">
                <motion.a 
                  variants={linkVars} 
                  href={link.href} 
                  onClick={onClose}
                  className="block hover:text-accent transition-colors"
                >
                  {link.name}
                </motion.a>
              </div>
            ))}
          </motion.div>
          
          <div className="mt-auto pb-10 flex flex-col gap-4">
            <button 
              onClick={() => { onClose(); onOpenQuiz(); }}
              className="w-full bg-ivory text-dark py-4 rounded-full font-bold text-lg uppercase tracking-widest"
            >
              Find Your Pathway
            </button>
            <a 
              href="#join-dwn" 
              onClick={onClose}
              className="w-full bg-accent text-dark py-4 rounded-full font-bold text-lg uppercase tracking-widest text-center"
            >
              Join DWN
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
