import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight, Link as LinkIcon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FloatingActionButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show FAB after scrolling 300px
      setIsVisible(window.scrollY > 300);
      
      // Auto-collapse when scrolling
      if (window.scrollY > 300 && isExpanded) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExpanded]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.25, 0.1, 0.25, 1] 
          }}
        >
          {/* Expanded Quick Actions */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="flex flex-col gap-2 mb-2"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Create Link Action */}
                <Link to="/auth">
                  <motion.div
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      className="bg-white text-foreground border border-border hover:bg-muted/50 shadow-lg rounded-full pl-4 pr-5 h-11 font-medium"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      create link
                    </Button>
                  </motion.div>
                </Link>

                {/* Get Started Action */}
                <Link to="/early-access">
                  <motion.div
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      className="bg-white text-foreground border border-border hover:bg-muted/50 shadow-lg rounded-full pl-4 pr-5 h-11 font-medium"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      get started
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative group"
            whileHover={{ scale: 1.1, rotate: isExpanded ? 45 : 0 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 bg-primary rounded-full blur-xl opacity-40"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Main button */}
            <div className="relative w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center transition-colors">
              <motion.div
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isExpanded ? (
                  <Plus className="h-6 w-6 text-white" />
                ) : (
                  <ArrowRight className="h-6 w-6 text-white" />
                )}
              </motion.div>
            </div>
          </motion.button>

          {/* Tooltip on hover (when collapsed) */}
          {!isExpanded && (
            <motion.div
              className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
              initial={{ x: 10 }}
              whileHover={{ x: 0 }}
            >
              <div className="bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                quick actions
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
