import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for 2 seconds to simulate loading and show the brand animation
    const timer = setTimeout(() => {
      setIsLoading(false);
      window.scrollTo(0, 0); // Ensure we start at the top
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          exit={{ y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 } }}
          className="fixed inset-0 z-[999999] bg-primary flex flex-col items-center justify-center text-ivory overflow-hidden"
        >
          {/* Subtle Background Elements */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent blur-3xl" />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <motion.h1 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="text-5xl md:text-8xl font-black tracking-tighter"
            >
              DR. HAUWA<span className="text-accent">.</span>
            </motion.h1>
          </motion.div>

          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
            className="h-1 bg-accent mt-8 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
