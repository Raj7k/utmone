import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Linear interpolation between values based on progress
 */
export const interpolate = (
  progress: number,
  inputRange: number[],
  outputRange: number[]
): number => {
  // Clamp progress to input range
  const clampedProgress = Math.max(inputRange[0], Math.min(progress, inputRange[inputRange.length - 1]));
  
  // Find the segment
  let i = 0;
  for (i = 0; i < inputRange.length - 1; i++) {
    if (clampedProgress >= inputRange[i] && clampedProgress <= inputRange[i + 1]) {
      break;
    }
  }
  
  // Calculate progress within segment
  const segmentProgress = (clampedProgress - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
  
  // Interpolate
  return outputRange[i] + (outputRange[i + 1] - outputRange[i]) * segmentProgress;
};

/**
 * Hook to track scroll progress of an element relative to viewport
 */
export const useScrollProgress = (
  options: {
    offset?: [string, string];
  } = {}
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      if (rafRef.current) return; // Skip if already scheduled
      
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = undefined;
        
        const rect = element.getBoundingClientRect();
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate progress: 0 when element enters viewport, 1 when it exits
        const totalScrollDistance = elementHeight + viewportHeight;
        const scrolled = viewportHeight - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance));
        
        setScrollProgress(progress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { ref, scrollProgress };
};

/**
 * Hook to track scroll progress within a specific container (start to end)
 */
export const useContainerScrollProgress = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = undefined;
        
        const rect = container.getBoundingClientRect();
        const containerHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Progress from when top of container hits top of viewport
        // to when bottom of container hits top of viewport
        const scrollableDistance = containerHeight - viewportHeight;
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
        
        setScrollProgress(progress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { containerRef, scrollProgress };
};

/**
 * Hook for character-by-character reveal based on scroll
 */
export const useCharacterReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = undefined;
        
        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Progress: 0 when element enters at bottom, 1 when it reaches center
        const startPoint = viewportHeight; // bottom of viewport
        const endPoint = viewportHeight / 2; // center of viewport
        const scrollRange = startPoint - endPoint;
        const currentPosition = rect.top;
        
        const progress = Math.max(0, Math.min(1, (startPoint - currentPosition) / scrollRange));
        setScrollProgress(progress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { containerRef, scrollProgress };
};

/**
 * Hook for parallax effect
 */
export const useParallaxScroll = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = undefined;
        
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate progress through viewport
        const totalDistance = viewportHeight + rect.height;
        const scrolled = viewportHeight - rect.top;
        const progress = scrolled / totalDistance;
        
        // Apply parallax offset
        const offset = -50 * speed * progress;
        setY(offset);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed]);

  return { ref, y };
};

/**
 * Hook to check if element is in view
 */
export const useInView = (options: { once?: boolean; margin?: string } = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (options.once && hasTriggered.current) return;
        
        if (entry.isIntersecting) {
          setInView(true);
          hasTriggered.current = true;
          
          if (options.once) {
            observer.disconnect();
          }
        } else if (!options.once) {
          setInView(false);
        }
      },
      {
        rootMargin: options.margin || '0px',
        threshold: 0.1,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.once, options.margin]);

  return { ref, inView };
};
