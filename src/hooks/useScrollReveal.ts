import { useEffect, useRef } from 'react';

/**
 * Batch IntersectionObserver for scroll reveal animations.
 * Uses a single observer for all elements with [data-reveal] attribute.
 * Much more performant than individual framer-motion whileInView.
 */
export function useScrollReveal(
  selector: string = '[data-reveal]',
  options: { threshold?: number; rootMargin?: string } = {}
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const { threshold = 0.1, rootMargin = '50px' } = options;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    // Observe all matching elements
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [selector, options.threshold, options.rootMargin]);
}

/**
 * Hook for single element reveal - returns a ref to attach
 */
export function useElementReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('revealed');
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
