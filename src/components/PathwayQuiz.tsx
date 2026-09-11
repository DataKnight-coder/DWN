import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PathwayQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    question: "What is your primary focus right now?",
    options: ["Career Transition (e.g. Cybersecurity)", "Building Digital Income", "Real Estate & Wealth", "Expanding my Network"]
  },
  {
    question: "What is your biggest obstacle?",
    options: ["Lack of clear direction", "Need specialized skills", "Limited capital/credit", "No strong community"]
  },
  {
    question: "Where should we send your custom 12-month roadmap?",
    options: [] // Email input handled customly
  }
];

const PathwayQuiz: React.FC<PathwayQuizProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setEmail("");
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-dark/95 backdrop-blur-xl flex items-center justify-center p-6"
        >
          <div className="absolute top-8 right-8">
            <button onClick={handleReset} className="text-ivory/50 hover:text-ivory uppercase tracking-widest text-xs font-bold transition-colors">
              Close ✕
            </button>
          </div>

          <div className="w-full max-w-2xl bg-ivory rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
            {/* Progress Bar */}
            {!submitted && (
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/10">
                <motion.div 
                  className="h-full bg-accent"
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {!submitted ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-sm font-bold uppercase tracking-widest text-primary/50 mb-4">
                  Step {currentStep + 1} of {steps.length}
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-8 leading-tight">
                  {steps[currentStep].question}
                </h2>

                {steps[currentStep].options.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {steps[currentStep].options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={handleNext}
                        className="w-full text-left p-6 rounded-2xl border-2 border-primary/10 hover:border-accent hover:bg-accent/5 text-primary font-bold text-lg transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-6 rounded-2xl border-2 border-primary/10 focus:outline-none focus:border-accent bg-transparent text-primary text-xl"
                    />
                    <button 
                      onClick={handleNext}
                      disabled={!email.includes('@')}
                      className="w-full bg-primary text-ivory font-bold py-6 rounded-2xl hover:bg-dark disabled:opacity-50 transition-colors uppercase tracking-widest mt-4"
                    >
                      Generate My Roadmap
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✓</span>
                </div>
                <h2 className="text-3xl font-extrabold text-primary mb-4">Your Roadmap is Ready.</h2>
                <p className="text-primary/70 mb-8">
                  We've analyzed your profile. Check your inbox for the exact strategy to execute your next phase in the diaspora.
                </p>
                <button 
                  onClick={handleReset}
                  className="bg-primary text-ivory font-bold py-4 px-10 rounded-full hover:bg-dark transition-colors uppercase tracking-widest"
                >
                  Return to Site
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PathwayQuiz;
