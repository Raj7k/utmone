import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const useNavigationProgress = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only trigger on actual path changes (not same-page navigation)
    if (previousPath.current !== location.pathname) {
      // Clear any existing timers
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Start navigation progress
      setIsNavigating(true);
      setProgress(0);

      // Animate progress quickly to 90%
      let currentProgress = 0;
      intervalRef.current = setInterval(() => {
        currentProgress += Math.random() * 15 + 10;
        if (currentProgress >= 90) {
          currentProgress = 90;
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
        setProgress(currentProgress);
      }, 50);

      // Complete after a brief delay (simulating page render)
      timeoutRef.current = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(100);
        
        // Hide the bar after completion animation
        setTimeout(() => {
          setIsNavigating(false);
          setProgress(0);
        }, 200);
      }, 300);

      previousPath.current = location.pathname;
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [location.pathname]);

  return { isNavigating, progress };
};
