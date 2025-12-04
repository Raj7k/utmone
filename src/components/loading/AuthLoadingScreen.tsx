import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const authMessages = [
  "simplicity is loading…",
  "clarity is loading…",
  "your link governance starts here…",
  "welcome to utm.one…",
];

export const AuthLoadingScreen = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const currentMessage = authMessages[currentMessageIndex];

  useEffect(() => {
    if (!currentMessage) return;

    let charIndex = 0;
    setDisplayedText("");
    setIsTyping(true);

    // Typing phase
    const typingInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);

        // Hold phase (1.5s) then move to next message
        setTimeout(() => {
          if (currentMessageIndex < authMessages.length - 1) {
            setCurrentMessageIndex(prev => prev + 1);
          } else {
            // Loop back to first message
            setCurrentMessageIndex(0);
          }
        }, 1500);
      }
    }, 60); // 60ms per character

    return () => clearInterval(typingInterval);
  }, [currentMessage, currentMessageIndex]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <img 
            src="/favicon.svg" 
            alt="utm.one" 
            className="h-16 w-16"
          />
          <span className="font-display text-4xl font-semibold text-foreground">
            utm.one
          </span>
        </motion.div>

        {/* Typewriter Text */}
        <div className="h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-display text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter"
            >
              {displayedText.split('').map((char, i) => {
                // Create gradient color sweep effect
                const hue = 217 + (i * 3); // Electric Blue base (217) with slight shift
                const saturation = 91 - (i % 20); // Subtle saturation variation
                const lightness = 50 + (i % 10); // Subtle lightness variation
                
                return (
                  <motion.span
                    key={`${currentMessageIndex}-${i}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: i * 0.06,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    style={{
                      color: `hsl(${hue} ${saturation}% ${lightness}%)`,
                      display: 'inline-block',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                );
              })}
              
              {/* Blinking cursor while typing */}
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ 
                    duration: 0.8, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="inline-block ml-1"
                  style={{ color: 'rgba(59,130,246,1)' }}
                >
                  |
                </motion.span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Subtle progress indicator */}
        <div className="flex gap-2">
          {authMessages.map((_, i) => (
            <motion.div
              key={i}
              className="h-1 w-8 rounded-full bg-muted"
              animate={{
                backgroundColor: i === currentMessageIndex 
                  ? "hsl(var(--primary))" 
                  : "hsl(var(--muted))"
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
