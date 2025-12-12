import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PERFORMANCE_BUDGET } from '@/config/performanceBudget';

interface RouteMetric {
  path: string;
  loadTime: number;
  timestamp: number;
}

/**
 * Track performance metrics per route
 * Reports route load times and warns if budget exceeded
 */
export function useRoutePerformance() {
  const location = useLocation();
  const startTimeRef = useRef<number>(performance.now());
  const metricsRef = useRef<RouteMetric[]>([]);

  useEffect(() => {
    const startTime = performance.now();
    startTimeRef.current = startTime;

    // Measure on next frame after route renders
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const loadTime = performance.now() - startTime;
        const path = location.pathname;

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

    return () => cancelAnimationFrame(rafId);
  }, [location.pathname]);

  return metricsRef.current;
}
