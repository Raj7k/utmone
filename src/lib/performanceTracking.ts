import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetric {
  action: string;
  duration: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

class PerformanceTracker {
  private metrics: PerformanceMetric[] = [];
  private timers: Map<string, number> = new Map();

  startTimer(action: string) {
    this.timers.set(action, performance.now());
  }

  endTimer(action: string, metadata?: Record<string, any>) {
    const startTime = this.timers.get(action);
    if (!startTime) {
      console.warn(`No timer found for action: ${action}`);
      return;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(action);

    const metric: PerformanceMetric = {
      action,
      duration,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.metrics.push(metric);

    // Log slow operations (> 1000ms)
    if (duration > 1000) {
      console.warn(`[Performance] Slow operation detected: ${action} took ${duration.toFixed(2)}ms`, metadata);
    }

    // Send critical path metrics to backend
    if (this.isCriticalPath(action)) {
      this.reportMetric(metric);
    }
  }

  private isCriticalPath(action: string): boolean {
    const criticalActions = [
      'link_creation',
      'link_redirect',
      'qr_generation',
      'analytics_load'
    ];
    return criticalActions.includes(action);
  }

  private async reportMetric(metric: PerformanceMetric) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.rpc('log_security_event', {
        p_event_type: 'performance_metric',
        p_user_id: user?.id || null,
        p_metadata: {
          action: metric.action,
          duration: metric.duration,
          ...metric.metadata
        }
      });
    } catch (error) {
      console.error('[Performance Tracking] Failed to report metric:', error);
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics() {
    this.metrics = [];
  }

  // Track error rates
  async trackError(errorType: string, context?: Record<string, any>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.rpc('log_security_event', {
        p_event_type: `error_${errorType}`,
        p_user_id: user?.id || null,
        p_metadata: {
          timestamp: new Date().toISOString(),
          ...context
        }
      });
    } catch (error) {
      console.error('[Error Tracking] Failed to track error:', error);
    }
  }
}

export const performanceTracker = new PerformanceTracker();

// Utility function to measure async operations
export async function measureAsync<T>(
  action: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  performanceTracker.startTimer(action);
  try {
    const result = await fn();
    performanceTracker.endTimer(action, metadata);
    return result;
  } catch (error) {
    performanceTracker.endTimer(action, { ...metadata, error: true });
    throw error;
  }
}
