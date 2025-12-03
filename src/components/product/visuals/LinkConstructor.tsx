import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export const LinkConstructor = () => {
  const [phase, setPhase] = useState<"dirty" | "scanning" | "clean">("dirty");
  const [scanPosition, setScanPosition] = useState(0);

  const dirtyUrl = "example.com/landing?utm_src=fb&UTM_medium=CPC&campaign=q1...";
  const cleanUrl = "utm.one/clean";

  // Cycle through phases
  useEffect(() => {
    const cycle = () => {
      setPhase("dirty");
      setScanPosition(0);
      
      setTimeout(() => {
        setPhase("scanning");
        // Animate scan line
        const scanInterval = setInterval(() => {
          setScanPosition(prev => {
            if (prev >= 100) {
              clearInterval(scanInterval);
              return 100;
            }
            return prev + 2;
          });
        }, 20);
      }, 1500);

      setTimeout(() => {
        setPhase("clean");
      }, 3000);
    };

    cycle();
    const interval = setInterval(cycle, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[380px] h-[160px] flex items-center justify-center">
      {/* Container */}
      <div 
        className="relative w-full p-6 rounded-xl overflow-hidden"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
          <span className="text-[10px] uppercase tracking-wider ml-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
            link constructor
          </span>
        </div>

        {/* URL Display */}
        <div className="relative h-12 flex items-center">
          <AnimatePresence mode="wait">
            {phase === "dirty" && (
              <motion.div
                key="dirty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-sm"
                style={{ color: 'rgba(255, 100, 100, 0.8)' }}
              >
                <TypewriterText text={dirtyUrl} />
              </motion.div>
            )}

            {phase === "scanning" && (
              <motion.div
                key="scanning"
                className="relative font-mono text-sm w-full"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                {dirtyUrl}
                {/* Scan line */}
                <motion.div
                  className="absolute top-0 h-full w-1"
                  style={{
                    left: `${scanPosition}%`,
                    background: 'linear-gradient(to bottom, transparent, white, transparent)',
                    boxShadow: '0 0 20px white',
                  }}
                />
              </motion.div>
            )}

            {phase === "clean" && (
              <motion.div
                key="clean"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-mono text-lg font-medium"
                style={{ 
                  color: 'rgba(100, 255, 150, 0.9)',
                  textShadow: '0 0 10px rgba(100, 255, 150, 0.5)'
                }}
              >
                {cleanUrl}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status indicator */}
        <div className="mt-4 flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            animate={{
              backgroundColor: phase === "dirty" ? 'rgb(239, 68, 68)' : 
                             phase === "scanning" ? 'rgb(234, 179, 8)' : 
                             'rgb(34, 197, 94)',
              boxShadow: phase === "clean" ? '0 0 8px rgb(34, 197, 94)' : 'none'
            }}
          />
          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {phase === "dirty" && "analyzing..."}
            {phase === "scanning" && "cleaning..."}
            {phase === "clean" && "optimized"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Typewriter effect component
const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let index = 0;
    setDisplayText("");
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  );
};
