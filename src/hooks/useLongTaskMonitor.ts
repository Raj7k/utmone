import { useEffect, useRef } from 'react';

interface LongTaskEntry {
  duration: number;
  startTime: number;
  name: string;
}

/**
 * Monitor long tasks (>50ms) that block the main thread
 * Only active in development mode
 */
export function useLongTaskMonitor(threshold = 50) {
  const longTasksRef = useRef<LongTaskEntry[]>([]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > threshold) {
            const taskEntry: LongTaskEntry = {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
            };
            
            longTasksRef.current.push(taskEntry);
            
            // Keep only last 20 entries
            if (longTasksRef.current.length > 20) {
              longTasksRef.current.shift();
            }

            console.warn(
              `[Long Task] ${entry.duration.toFixed(2)}ms blocking task detected`,
              {
                startTime: entry.startTime.toFixed(2),
                attribution: (entry as any).attribution,
              }
            );
          }
        }
      });

      observer.observe({ type: 'longtask', buffered: true });

      return () => observer.disconnect();
    } catch (e) {
      // Long task monitoring not supported
    }
  }, [threshold]);

  return longTasksRef.current;
}

