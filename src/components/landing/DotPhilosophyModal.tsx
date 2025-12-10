import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Twitter, Linkedin, Sparkles } from "lucide-react";

interface DotPhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
  originPosition?: { x: number; y: number };
}

const philosophyLines = [
  "the world is made of dots.",
  "",
  "pixels on your screen.",
  "stars in the sky.",
  "data points in your analytics.",
  "connections between people.",
  "",
  "every conversion started as a dot.",
  "every customer journey, a line of dots.",
  "every revenue milestone, dots connected.",
  "",
  "utm.one connects all your dots.",
];

const ConstellationDot = ({ delay, size = 2 }: { delay: number; size?: number }) => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.8, 0.3, 0.8, 0],
        scale: [0, 1, 0.8, 1, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

const ConstellationLine = ({ delay }: { delay: number }) => {
  const startX = Math.random() * 80 + 10;
  const startY = Math.random() * 80 + 10;
  const endX = startX + (Math.random() - 0.5) * 20;
  const endY = startY + (Math.random() - 0.5) * 20;
  
  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 0] }}
      transition={{ duration: 3, delay, repeat: Infinity }}
    >
      <line
        x1={`${startX}%`}
        y1={`${startY}%`}
        x2={`${endX}%`}
        y2={`${endY}%`}
        stroke="white"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
    </motion.svg>
  );
};

export const DotPhilosophyModal = ({ isOpen, onClose, originPosition }: DotPhilosophyModalProps) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisibleLines(0);
      setShowCTA(false);
      
      const interval = setInterval(() => {
        setVisibleLines(prev => {
          if (prev >= philosophyLines.length) {
            clearInterval(interval);
            setTimeout(() => setShowCTA(true), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 400);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    const text = "Did you click the dot? 👀 The world is made of dots. utm.one connects all your dots.";
    const url = "https://utm.one";
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else {
      window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text + " " + url)}`, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Constellation Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <ConstellationDot key={`dot-${i}`} delay={i * 0.2} size={Math.random() * 3 + 1} />
            ))}
            {[...Array(15)].map((_, i) => (
              <ConstellationLine key={`line-${i}`} delay={i * 0.3} />
            ))}
          </div>

          {/* Modal Content */}
          <motion.div
            className="relative z-10 max-w-2xl mx-4 p-8 md:p-12"
            initial={{ 
              scale: 0,
              x: originPosition?.x ? originPosition.x - window.innerWidth / 2 : 0,
              y: originPosition?.y ? originPosition.y - window.innerHeight / 2 : 0,
            }}
            animate={{ 
              scale: 1,
              x: 0,
              y: 0,
            }}
            exit={{ 
              scale: 0,
              opacity: 0,
            }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 25,
            }}
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-0 right-0 p-2 text-white/50 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Philosophy Text */}
            <div className="space-y-4 text-center">
              {philosophyLines.map((line, index) => (
                <motion.p
                  key={index}
                  className={`font-serif ${
                    index === philosophyLines.length - 1 
                      ? 'text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-zinc-300 to-white bg-clip-text text-transparent' 
                      : line === '' 
                        ? 'h-4' 
                        : 'text-lg md:text-xl text-zinc-400'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: index < visibleLines ? 1 : 0,
                    y: index < visibleLines ? 0 : 20,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* CTA Section */}
            <AnimatePresence>
              {showCTA && (
                <motion.div
                  className="mt-12 space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Main CTA */}
                  <motion.a
                    href="/early-access"
                    className="group flex items-center justify-center gap-2 mx-auto px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-zinc-200 transition-all duration-300"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,255,255,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="w-5 h-5" />
                    start connecting yours
                  </motion.a>

                  {/* Share Buttons */}
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-zinc-500 text-sm">share the moment</span>
                    <motion.button
                      onClick={() => handleShare('twitter')}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Twitter className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleShare('linkedin')}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Linkedin className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
