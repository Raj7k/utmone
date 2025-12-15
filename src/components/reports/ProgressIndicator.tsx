import { useEffect, useState } from "react";

export const ProgressIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (scrolled / total) * 100 : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-1 bg-zinc-900/50 z-40 backdrop-blur-sm">
      <div
        className="h-full bg-gradient-to-r from-white/80 to-white/40 transition-transform duration-100 origin-left"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />
    </div>
  );
};
