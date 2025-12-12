import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

// Global state to allow components to signal loading completion
let completeNavigationCallback: (() => void) | null = null;

export const completeNavigation = () => {
  if (completeNavigationCallback) {
    completeNavigationCallback();
  }
};

export const useNavigationProgress = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slowLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const complete = useCallback(() => {
    // Clear all timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (slowLoadTimeoutRef.current) clearTimeout(slowLoadTimeoutRef.current);
    
    // Complete the progress bar
    setProgress(100);
    
    // Hide after animation
    setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 200);
  }, []);

  // Register global callback
  useEffect(() => {
    completeNavigationCallback = complete;
    return () => {
      completeNavigationCallback = null;
    };
  }, [complete]);

  useEffect(() => {
    // Only trigger on actual path changes (not same-page navigation)
    if (previousPath.current !== location.pathname) {
      // Clear any existing timers
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (slowLoadTimeoutRef.current) clearTimeout(slowLoadTimeoutRef.current);

      // Start navigation progress
      setIsNavigating(true);
      setProgress(0);

      // Animate progress slowly to 80% over 2 seconds (allows for slow loads)
      let currentProgress = 0;
      intervalRef.current = setInterval(() => {
        // Slow down as we approach 80%
        const increment = currentProgress < 50 
          ? Math.random() * 8 + 4 
          : currentProgress < 70 
            ? Math.random() * 3 + 1 
            : Math.random() * 1 + 0.5;
        
        currentProgress += increment;
        if (currentProgress >= 80) {
          currentProgress = 80;
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
        setProgress(currentProgress);
      }, 100);

      // Default completion after 3 seconds (fallback for pages without explicit completion)
      timeoutRef.current = setTimeout(() => {
        complete();
      }, 3000);

      previousPath.current = location.pathname;
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (slowLoadTimeoutRef.current) clearTimeout(slowLoadTimeoutRef.current);
    };
  }, [location.pathname, complete]);

  return { isNavigating, progress, complete };
};
