import { useEffect } from 'react';
import { useIntentPrefetch } from '@/hooks/useIntentPrefetch';
import { useLongTaskMonitor } from '@/hooks/useLongTaskMonitor';
import { useRoutePerformance } from '@/hooks/useRoutePerformance';
import { useMemoryMonitor } from '@/hooks/useMemoryMonitor';
import { PerformanceMonitor } from '@/components/dev/PerformanceMonitor';

interface PerformanceProviderProps {
  children: React.ReactNode;
  /** Enable Markovian prefetching (default: true) */
  enablePrefetch?: boolean;
  /** Hover delay before prefetching (ms) */
  prefetchDelay?: number;
}

/**
 * Performance Optimization Provider
 * 
 * Wraps the application with algorithmic performance optimizations:
 * - Markovian Prefetching (predictive page loading)
 * - Resource hints injection
 * - Network-aware adaptations
 * - Long task monitoring (dev)
 * - Memory monitoring (dev)
 * - Route performance tracking
 * 
 * Usage:
 * ```tsx
 * <PerformanceProvider>
 *   <App />
 * </PerformanceProvider>
 * ```
 */
export function PerformanceProvider({
  children,
  enablePrefetch = true,
  prefetchDelay = 50,
}: PerformanceProviderProps) {
  // Enable Markovian prefetching
  useIntentPrefetch({
    hoverDelay: prefetchDelay,
    maxConcurrent: 3,
    respectSaveData: true,
  });

  // Development-only monitoring
  useLongTaskMonitor(50);
  useMemoryMonitor(30000, 80);
  useRoutePerformance();

  useEffect(() => {
    // Inject DNS prefetch hints for critical domains
    const criticalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    criticalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Preconnect to critical origins
    const preconnectDomains = [
      'https://fonts.googleapis.com',
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Log performance metrics in development
    if (import.meta.env.DEV) {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          console.log('🚀 Performance Metrics:', {
            'DNS Lookup': `${(perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(2)}ms`,
            'TCP Connect': `${(perfData.connectEnd - perfData.connectStart).toFixed(2)}ms`,
            'TTFB': `${(perfData.responseStart - perfData.requestStart).toFixed(2)}ms`,
            'DOM Content Loaded': `${(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart).toFixed(2)}ms`,
            'Load Complete': `${(perfData.loadEventEnd - perfData.loadEventStart).toFixed(2)}ms`,
            'Total Load Time': `${(perfData.loadEventEnd - perfData.fetchStart).toFixed(2)}ms`,
          });
        }
      }, 0);
    }
  }, []);

  return (
    <>
      {children}
      <PerformanceMonitor />
    </>
  );
}
