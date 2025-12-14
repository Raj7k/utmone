/**
 * Core Web Vitals tracking for production performance monitoring
 * Tracks LCP, FID, CLS, TTFB, and INP metrics
 */

import { supabase } from '@/integrations/supabase/client';

interface WebVitalMetric {
  name: 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'INP' | 'FCP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// Thresholds based on Google's Core Web Vitals guidelines
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
  FCP: { good: 1800, poor: 3000 },
};

function getRating(name: keyof typeof THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// Store metrics locally for batch reporting
const metricsBuffer: WebVitalMetric[] = [];
let reportTimeout: ReturnType<typeof setTimeout> | null = null;

async function reportMetrics() {
  if (metricsBuffer.length === 0) return;

  const metricsToReport = [...metricsBuffer];
  metricsBuffer.length = 0;

  // DEFER: Use requestIdleCallback to avoid blocking critical path
  const doReport = async () => {
    try {
      // Use cached user from localStorage instead of calling getUser()
      const cachedSession = localStorage.getItem('utm_session_cache');
      const userId = cachedSession ? JSON.parse(cachedSession)?.user?.id : null;
      
      // Convert metrics to JSON-safe format
      const metricsJson = metricsToReport.map(m => ({
        name: m.name,
        value: m.value,
        rating: m.rating,
        delta: m.delta,
        id: m.id,
      }));
      
      await supabase.rpc('log_security_event', {
        p_event_type: 'web_vitals',
        p_user_id: userId,
        p_metadata: {
          metrics: metricsJson,
          url: window.location.pathname,
          timestamp: new Date().toISOString(),
          connection: (navigator as unknown as { connection?: { effectiveType?: string } }).connection?.effectiveType || 'unknown',
          deviceMemory: (navigator as unknown as { deviceMemory?: number }).deviceMemory || 'unknown',
        }
      });
    } catch (error) {
      // Silent fail - don't impact user experience
      console.debug('[Web Vitals] Failed to report metrics:', error);
    }
  };

  // Use requestIdleCallback if available, otherwise defer with setTimeout
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(doReport, { timeout: 10000 });
  } else {
    setTimeout(doReport, 0);
  }
}

function queueMetric(metric: WebVitalMetric) {
  metricsBuffer.push(metric);

  // Batch report after 5 seconds of inactivity
  if (reportTimeout) clearTimeout(reportTimeout);
  reportTimeout = setTimeout(reportMetrics, 5000);
}

// Log to console in development
function logMetric(metric: WebVitalMetric) {
  const colors = {
    good: '\x1b[32m', // green
    'needs-improvement': '\x1b[33m', // yellow
    poor: '\x1b[31m', // red
  };
  const reset = '\x1b[0m';

  if (import.meta.env.DEV) {
    console.log(
      `[Web Vitals] ${metric.name}: ${colors[metric.rating]}${metric.value.toFixed(2)}${reset} (${metric.rating})`
    );
  }
}

/**
 * Initialize Core Web Vitals tracking using PerformanceObserver
 * This is a lightweight implementation that doesn't require the web-vitals library
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Track LCP (Largest Contentful Paint)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      
      if (lastEntry) {
        const metric: WebVitalMetric = {
          name: 'LCP',
          value: lastEntry.startTime,
          rating: getRating('LCP', lastEntry.startTime),
          delta: lastEntry.startTime,
          id: `lcp-${Date.now()}`,
        };
        logMetric(metric);
        queueMetric(metric);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // LCP not supported
  }

  // Track FID (First Input Delay)
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0] as any;
      
      if (firstEntry) {
        const delay = firstEntry.processingStart - firstEntry.startTime;
        const metric: WebVitalMetric = {
          name: 'FID',
          value: delay,
          rating: getRating('FID', delay),
          delta: delay,
          id: `fid-${Date.now()}`,
        };
        logMetric(metric);
        queueMetric(metric);
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    // FID not supported
  }

  // Track CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Report CLS on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const metric: WebVitalMetric = {
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          delta: clsValue,
          id: `cls-${Date.now()}`,
        };
        logMetric(metric);
        queueMetric(metric);
        reportMetrics(); // Immediate report on page hide
      }
    });
  } catch (e) {
    // CLS not supported
  }

  // Track TTFB (Time to First Byte)
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      const metric: WebVitalMetric = {
        name: 'TTFB',
        value: ttfb,
        rating: getRating('TTFB', ttfb),
        delta: ttfb,
        id: `ttfb-${Date.now()}`,
      };
      logMetric(metric);
      queueMetric(metric);
    }
  } catch (e) {
    // TTFB not supported
  }

  // Track FCP (First Contentful Paint)
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        const metric: WebVitalMetric = {
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: getRating('FCP', fcpEntry.startTime),
          delta: fcpEntry.startTime,
          id: `fcp-${Date.now()}`,
        };
        logMetric(metric);
        queueMetric(metric);
      }
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch (e) {
    // FCP not supported
  }

  // Track INP (Interaction to Next Paint) - Core Web Vital 2024
  try {
    let maxINP = 0;
    let inpEntries: any[] = [];
    
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        // Filter for user interactions
        if (entry.interactionId) {
          inpEntries.push(entry);
          
          // Calculate INP as the max interaction duration
          if (entry.duration > maxINP) {
            maxINP = entry.duration;
          }
        }
      }
    });
    
    inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 } as any);

    // Report INP on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && maxINP > 0) {
        const metric: WebVitalMetric = {
          name: 'INP',
          value: maxINP,
          rating: getRating('INP', maxINP),
          delta: maxINP,
          id: `inp-${Date.now()}`,
        };
        logMetric(metric);
        queueMetric(metric);
      }
    });
  } catch (e) {
    // INP not supported
  }

  // Report remaining metrics on page unload
  window.addEventListener('pagehide', () => {
    reportMetrics();
  });
}

/**
 * Track a custom performance mark
 */
export function trackPerformanceMark(name: string, metadata?: Record<string, any>) {
  try {
    performance.mark(name);
    
    if (import.meta.env.DEV) {
      console.log(`[Performance] Mark: ${name}`, metadata);
    }

    // Get the mark entry
    const entries = performance.getEntriesByName(name, 'mark');
    if (entries.length > 0) {
      const entry = entries[entries.length - 1];
      queueMetric({
        name: 'LCP', // Using LCP as placeholder type for custom marks
        value: entry.startTime,
        rating: 'good',
        delta: entry.startTime,
        id: `mark-${name}-${Date.now()}`,
      });
    }
  } catch (e) {
    // Performance API not supported
  }
}

/**
 * Measure time between two marks
 */
export function measurePerformance(name: string, startMark: string, endMark: string): number | null {
  try {
    performance.measure(name, startMark, endMark);
    const entries = performance.getEntriesByName(name, 'measure');
    
    if (entries.length > 0) {
      const duration = entries[entries.length - 1].duration;
      
      if (import.meta.env.DEV) {
        console.log(`[Performance] Measure: ${name} = ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    }
  } catch (e) {
    // Performance API not supported or marks don't exist
  }
  return null;
}
