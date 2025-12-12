import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, ChevronDown, ChevronUp } from 'lucide-react';
import { PERFORMANCE_BUDGET } from '@/config/performanceBudget';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Development-only performance monitor overlay
 * Displays real-time Core Web Vitals
 */
export function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [metrics, setMetrics] = useState<WebVitalMetric[]>([]);
  const [memory, setMemory] = useState<{ used: number; percent: number } | null>(null);

  // Only render in development
  if (import.meta.env.PROD) return null;

  useEffect(() => {
    // Collect metrics from Performance API
    const collectMetrics = () => {
      const collected: WebVitalMetric[] = [];

      // Navigation timing
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        collected.push({
          name: 'TTFB',
          value: ttfb,
          rating: PERFORMANCE_BUDGET.getRating('TTFB', ttfb),
        });
      }

      // Paint timing
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
      if (fcpEntry) {
        collected.push({
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: PERFORMANCE_BUDGET.getRating('FCP', fcpEntry.startTime),
        });
      }

      setMetrics(collected);

      // Memory (Chrome only)
      const performanceMemory = (performance as any).memory;
      if (performanceMemory) {
        const used = performanceMemory.usedJSHeapSize / 1024 / 1024;
        const percent = (performanceMemory.usedJSHeapSize / performanceMemory.jsHeapSizeLimit) * 100;
        setMemory({ used, percent });
      }
    };

    // Initial collection after load
    const timeout = setTimeout(collectMetrics, 1000);

    // Periodic updates
    const interval = setInterval(collectMetrics, 5000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-400';
      case 'needs-improvement': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 p-2 rounded-full bg-zinc-900/90 text-white shadow-lg hover:bg-zinc-800 transition-colors"
        title="Performance Monitor"
      >
        <Activity className="h-4 w-4" />
      </button>

      {/* Monitor panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-16 right-4 z-50 w-64 bg-zinc-900/95 backdrop-blur-sm text-white text-xs rounded-lg shadow-xl border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">Performance</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="p-3 space-y-2">
              {metrics.length === 0 ? (
                <p className="text-muted-foreground">collecting metrics...</p>
              ) : (
                metrics.map((m) => (
                  <div key={m.name} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{m.name}</span>
                    <span className={getRatingColor(m.rating)}>
                      {m.name === 'CLS' ? m.value.toFixed(3) : `${m.value.toFixed(0)}ms`}
                    </span>
                  </div>
                ))
              )}

              {/* Memory */}
              {memory && (
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-muted-foreground">Memory</span>
                  <span className={memory.percent > 80 ? 'text-red-400' : memory.percent > 60 ? 'text-yellow-400' : 'text-green-400'}>
                    {memory.used.toFixed(1)}MB ({memory.percent.toFixed(0)}%)
                  </span>
                </div>
              )}
            </div>

            {/* Expanded details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/10 p-3 space-y-2"
                >
                  <div className="text-muted-foreground">
                    <p>Budgets:</p>
                    <p className="mt-1">• LCP: {PERFORMANCE_BUDGET.LCP}ms</p>
                    <p>• FID: {PERFORMANCE_BUDGET.FID}ms</p>
                    <p>• CLS: {PERFORMANCE_BUDGET.CLS}</p>
                    <p>• INP: {PERFORMANCE_BUDGET.INP}ms</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
