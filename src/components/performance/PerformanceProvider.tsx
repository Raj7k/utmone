import { useEffect, lazy, Suspense, useState } from 'react';
import { useIntentPrefetch } from '@/hooks/useIntentPrefetch';

// Lazy load dev-only components
const PerformanceMonitor = lazy(() => 
  import('@/components/dev/PerformanceMonitor').then(m => ({ default: m.PerformanceMonitor }))
);

interface PerformanceProviderProps {
  children: React.ReactNode;
}

/**
 * Lightweight Performance Provider
 * 
 * Defers non-critical performance optimizations to after first paint.
 * Dev monitoring only loads in development mode.
 */
export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const [enablePrefetch, setEnablePrefetch] = useState(false);
  
  // Defer enabling prefetch until after idle
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setEnablePrefetch(true));
    } else {
      setTimeout(() => setEnablePrefetch(true), 100);
    }
  }, []);

  // Only initialize prefetching after idle callback
  useIntentPrefetch(enablePrefetch ? {
    hoverDelay: 50,
    maxConcurrent: 3,
    respectSaveData: true,
  } : { hoverDelay: 999999 }); // Effectively disabled until enablePrefetch is true

  return (
    <>
      {children}
      {/* Only load PerformanceMonitor in dev */}
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <PerformanceMonitor />
        </Suspense>
      )}
    </>
  );
}
