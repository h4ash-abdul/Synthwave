import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olà",
  "やあ",
  "Hallå",
  "Guten tag",
  "Hallo",
  "Namaste"
];

export const Component = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index === words.length - 1) return;
    
    // Faster cycling (220ms per word) for a punchier intro
    const timeout = setTimeout(() => {
      setIndex(index + 1);
    }, index === 0 ? 800 : 220); 

    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          className="flex items-center text-4xl md:text-5xl font-sans font-semibold tracking-tight"
          style={{ color: '#10b981' }}
        >
          {/* Synthwave styled dot indicator */}
          <span className="mr-4 h-3 w-3 rounded-full bg-[#10b981]" />
          {words[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
