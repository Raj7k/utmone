import { useEffect, useRef, useState } from 'react';

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface MemoryMetrics {
  usagePercent: number;
  usedMB: number;
  totalMB: number;
  limitMB: number;
}

/**
 * Monitor JavaScript heap memory usage
 * Only active in development mode with Chrome
 */
export function useMemoryMonitor(intervalMs = 30000, warnThreshold = 80) {
  const [metrics, setMetrics] = useState<MemoryMetrics | null>(null);
  const peakUsageRef = useRef<number>(0);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    
    const performanceMemory = (performance as any).memory as MemoryInfo | undefined;
    if (!performanceMemory) {
      console.debug('[Memory] performance.memory not available (Chrome only)');
      return;
    }

    const checkMemory = () => {
      const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performanceMemory;
      const usagePercent = (usedJSHeapSize / jsHeapSizeLimit) * 100;
      const usedMB = usedJSHeapSize / 1024 / 1024;
      const totalMB = totalJSHeapSize / 1024 / 1024;
      const limitMB = jsHeapSizeLimit / 1024 / 1024;

      // Track peak usage
      if (usagePercent > peakUsageRef.current) {
        peakUsageRef.current = usagePercent;
      }

      setMetrics({ usagePercent, usedMB, totalMB, limitMB });

      if (usagePercent > warnThreshold) {
        console.warn(
          `[Memory] ⚠️ High usage: ${usagePercent.toFixed(1)}% (${usedMB.toFixed(1)}MB / ${limitMB.toFixed(1)}MB)`,
          `Peak: ${peakUsageRef.current.toFixed(1)}%`
        );
      }
    };

    // Initial check
    checkMemory();

    // Periodic checks
    const interval = setInterval(checkMemory, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, warnThreshold]);

  return metrics;
}
