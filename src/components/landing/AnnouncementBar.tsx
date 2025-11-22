import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface AnnouncementBarProps {
  message: string;
  ctaText?: string;
  ctaLink?: string;
  dismissible?: boolean;
  storageKey?: string;
}

export const AnnouncementBar = ({ 
  message, 
  ctaText, 
  ctaLink,
  dismissible = true,
  storageKey = "announcement-dismissed"
}: AnnouncementBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this announcement
    const isDismissed = localStorage.getItem(storageKey);
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(storageKey, "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-accent-teal via-accent-yellow-green to-accent-teal bg-[length:200%_100%] animate-gradient"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="max-w-[1280px] mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-3 text-center">
              {/* Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-4 w-4 text-white flex-shrink-0" />
              </motion.div>

              {/* Message */}
              <p className="text-sm md:text-base font-medium text-white">
                {message}
              </p>

              {/* CTA Link */}
              {ctaText && ctaLink && (
                <Link to={ctaLink}>
                  <motion.div
                    className="flex items-center gap-1 text-sm font-semibold text-white hover:text-white/90 transition-colors"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="hidden sm:inline">{ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Link>
              )}

              {/* Dismiss Button */}
              {dismissible && (
                <motion.button
                  onClick={handleDismiss}
                  className="ml-auto flex-shrink-0 text-white/80 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  aria-label="Dismiss announcement"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
