/**
 * CSS Motion Utilities - Lightweight alternative to framer-motion
 * Uses CSS animations for better performance (GPU-accelerated)
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// Animation variant types
export type AnimationVariant = 
  | 'fade-in' 
  | 'fade-out' 
  | 'slide-up' 
  | 'slide-down' 
  | 'scale-in' 
  | 'scale-out'
  | 'fade-slide-up'
  | 'fade-slide-down';

// Stagger delay utilities
export const getStaggerDelay = (index: number, baseDelay = 0.1): string => {
  return `${index * baseDelay}s`;
};

export const getStaggerClass = (index: number, maxStagger = 10): string => {
  const staggerIndex = Math.min(index, maxStagger);
  return `stagger-${staggerIndex}`;
};

// CSS class generators for animations
export const getAnimationClasses = (
  variant: AnimationVariant,
  options?: {
    delay?: number;
    duration?: 'fast' | 'normal' | 'slow';
    once?: boolean;
  }
): string => {
  const { delay = 0, duration = 'normal', once = true } = options || {};
  
  const durationClass = {
    fast: 'duration-200',
    normal: 'duration-500',
    slow: 'duration-700',
  }[duration];

  const delayClass = delay > 0 ? `delay-[${delay}ms]` : '';
  const fillMode = once ? 'fill-mode-forwards' : '';
  
  return `animate-${variant} ${durationClass} ${delayClass} ${fillMode}`.trim();
};

// Intersection Observer hook for scroll-triggered animations
export const useInView = (
  options?: IntersectionObserverInit
): [React.RefObject<HTMLDivElement>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once triggered, unobserve for "once" behavior
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView];
};

// Hook for staggered children animations
export const useStaggeredAnimation = (
  itemCount: number,
  baseDelay = 100
): { getItemStyle: (index: number) => React.CSSProperties } => {
  const getItemStyle = useCallback(
    (index: number): React.CSSProperties => ({
      animationDelay: `${index * baseDelay}ms`,
    }),
    [baseDelay]
  );

  return { getItemStyle };
};

// CSS transition classes for state changes
export const transitionClasses = {
  all: 'transition-all duration-300 ease-out',
  fast: 'transition-all duration-150 ease-out',
  slow: 'transition-all duration-500 ease-out',
  transform: 'transition-transform duration-300 ease-out',
  opacity: 'transition-opacity duration-300 ease-out',
  colors: 'transition-colors duration-200 ease-out',
  apple: 'transition-all duration-[200ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
} as const;

// Pre-built animation class combinations
export const animationPresets = {
  // Entrance animations
  fadeIn: 'animate-fade-in opacity-0',
  fadeInUp: 'animate-fade-slide-up opacity-0 translate-y-4',
  fadeInDown: 'animate-fade-slide-down opacity-0 -translate-y-4',
  scaleIn: 'animate-scale-in opacity-0 scale-95',
  slideUp: 'animate-slide-up translate-y-full',
  slideDown: 'animate-slide-down -translate-y-full',
  
  // Exit animations (for removing elements)
  fadeOut: 'animate-fade-out',
  scaleOut: 'animate-scale-out',
  
  // Looping animations
  pulse: 'animate-pulse',
  glow: 'animate-glow-pulse',
  nodePulse: 'animate-node-pulse',
  
  // Interactive states
  hoverScale: 'hover:scale-105 active:scale-95 transition-transform duration-200',
  hoverGlow: 'hover:shadow-[0_0_20px_hsl(0_0%_100%/0.2)] transition-shadow duration-300',
} as const;

// Helper to combine animation classes with conditions
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Generate inline style for custom delays
export const withDelay = (delayMs: number): React.CSSProperties => ({
  animationDelay: `${delayMs}ms`,
});

// Generate inline style for custom durations
export const withDuration = (durationMs: number): React.CSSProperties => ({
  animationDuration: `${durationMs}ms`,
});
