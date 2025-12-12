import { useEffect, useRef } from 'react';
import { PERFORMANCE_BUDGET } from '@/config/performanceBudget';

interface RouteMetric {
  path: string;
  loadTime: number;
  timestamp: number;
}

/**
 * Track performance metrics per route
 * Reports route load times and warns if budget exceeded
 * Safe to use outside Router context
 */
export function useRoutePerformance() {
  const startTimeRef = useRef<number>(performance.now());
  const metricsRef = useRef<RouteMetric[]>([]);
  const lastPathRef = useRef<string>(typeof window !== 'undefined' ? window.location.pathname : '/');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Listen for route changes via popstate and custom events
    const handleRouteChange = () => {
      const path = window.location.pathname;
      
      // Skip if same path
      if (path === lastPathRef.current) return;
      
      const startTime = performance.now();
      startTimeRef.current = startTime;
      lastPathRef.current = path;

      // Measure on next frame after route renders
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const loadTime = performance.now() - startTime;

          const metric: RouteMetric = {
            path,
            loadTime,
            timestamp: Date.now(),
          };

          metricsRef.current.push(metric);
          
          // Keep only last 50 entries
          if (metricsRef.current.length > 50) {
            metricsRef.current.shift();
          }

          // Check against budget
          const routeBudget = PERFORMANCE_BUDGET.routes[path as keyof typeof PERFORMANCE_BUDGET.routes];
          const maxLoadTime = routeBudget?.maxLoadTime || PERFORMANCE_BUDGET.DEFAULT_ROUTE_LOAD_TIME;

          if (import.meta.env.DEV) {
            const status = loadTime > maxLoadTime ? '🔴' : loadTime > maxLoadTime * 0.8 ? '🟡' : '🟢';
            console.log(
              `[Route] ${status} ${path}: ${loadTime.toFixed(2)}ms (budget: ${maxLoadTime}ms)`
            );
          }
        });
      });
    };

    // Listen for browser navigation
    window.addEventListener('popstate', handleRouteChange);
    
    // Listen for programmatic navigation (custom event)
    window.addEventListener('routechange', handleRouteChange);

    // Initial measurement
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('routechange', handleRouteChange);
    };
  }, []);

  return metricsRef.current;
}
