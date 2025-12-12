import { useState, useEffect } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Respects prefers-reduced-motion media query for accessibility
 */
export const useReducedMotion = (): boolean => {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return prefersReduced;
};

/**
 * Get animation variants that respect reduced motion
 */
export const getMotionVariants = (prefersReduced: boolean) => ({
  initial: prefersReduced ? {} : { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: prefersReduced ? {} : { opacity: 0, y: -20 },
  transition: prefersReduced ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
});

/**
 * Get safe animation duration based on reduced motion preference
 */
export const getAnimationDuration = (prefersReduced: boolean, defaultDuration = 0.3): number => {
  return prefersReduced ? 0 : defaultDuration;
};
