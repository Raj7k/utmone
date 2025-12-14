import { useState, useEffect } from "react";

/**
 * Scroll progress bar using native JS instead of framer-motion
 * Better performance - no library overhead for simple scroll tracking
 */
export const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white/60 via-white/80 to-white/60 origin-left z-50 transition-transform duration-75"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
};
