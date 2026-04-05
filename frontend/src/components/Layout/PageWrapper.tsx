import React from 'react';
import { motion } from 'framer-motion';

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full h-full relative"
    >
      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full"></div>
        <div className="absolute top-[30%] left-[10%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
      </div>

      {/* Main Container padding restricted tightly to Stitch compliance. Responsive layout fixes centered max-w */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 pb-20 md:pb-8 relative z-10 w-full h-full min-h-full">
        {children}
      </div>
    </motion.div>
  );
};
