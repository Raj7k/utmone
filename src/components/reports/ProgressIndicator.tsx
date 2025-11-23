import { useEffect, useState } from "react";

export const ProgressIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / total) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress(); // Initial calculation

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-2 bg-wildSand/50 z-40">
      <div
        className="h-full bg-gradient-to-r from-blazeOrange to-deepSea transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
