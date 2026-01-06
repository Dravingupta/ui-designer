import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = true, message = "Processing..." }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 z-[1000] bg-[#0A0A0A]' : 'w-full h-full'}`}>
      {/* Background Grid (only for full-screen) */}
      {fullScreen && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated Pentagon/Hexagon Loader */}
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 border-2 border-cyan-500/20 rounded-lg"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute inset-0 border-t-2 border-cyan-500 rounded-lg"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-cyan-500">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"
            />
          </div>
        </div>

        {/* Text Loader */}
        <div className="flex flex-col items-center gap-1">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cyan-500 font-mono text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            {message}
          </motion.span>
          <div className="w-32 h-[1px] bg-white/5 relative overflow-hidden mt-2">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-cyan-500 w-1/3"
              animate={{
                left: ["-100%", "200%"]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
