import { lazy, Suspense } from 'react';

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
