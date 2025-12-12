import { useState, useEffect } from 'react';
import { PERFORMANCE_BUDGET } from '@/config/performanceBudget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface MetricResult {
  name: string;
  value: number | null;
  budget: number;
  unit: string;
  rating: 'good' | 'needs-improvement' | 'poor' | 'pending';
  score: number;
}

interface AuditReport {
  timestamp: string;
  url: string;
  metrics: MetricResult[];
  overallScore: number;
  bundleAnalysis: {
    totalJS: number;
    totalCSS: number;
    withinBudget: boolean;
  };
  recommendations: string[];
}

/**
 * Comprehensive Performance Report
 * Compares real metrics against defined budgets
 */
export function PerformanceReport() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAudit = async () => {
    setIsRunning(true);
    
    // Collect metrics
    const metrics: MetricResult[] = [];
    const recommendations: string[] = [];

    // Get navigation timing
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navEntry) {
      // TTFB
      const ttfb = navEntry.responseStart - navEntry.requestStart;
      const ttfbRating = PERFORMANCE_BUDGET.getRating('TTFB', ttfb);
      metrics.push({
        name: 'Time to First Byte (TTFB)',
        value: ttfb,
        budget: PERFORMANCE_BUDGET.TTFB,
        unit: 'ms',
        rating: ttfbRating,
        score: calculateScore(ttfb, PERFORMANCE_BUDGET.TTFB, 1800),
      });
      if (ttfbRating !== 'good') {
        recommendations.push('Optimize server response time. Consider edge caching or CDN.');
      }

      // FCP approximation from paint entries
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
      if (fcpEntry) {
        const fcp = fcpEntry.startTime;
        const fcpRating = PERFORMANCE_BUDGET.getRating('FCP', fcp);
        metrics.push({
          name: 'First Contentful Paint (FCP)',
          value: fcp,
          budget: PERFORMANCE_BUDGET.FCP,
          unit: 'ms',
          rating: fcpRating,
          score: calculateScore(fcp, PERFORMANCE_BUDGET.FCP, 3000),
        });
        if (fcpRating !== 'good') {
          recommendations.push('Reduce render-blocking resources. Inline critical CSS.');
        }
      }

      // LCP from largest-contentful-paint entries
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lcp = lcpEntries[lcpEntries.length - 1].startTime;
        const lcpRating = PERFORMANCE_BUDGET.getRating('LCP', lcp);
        metrics.push({
          name: 'Largest Contentful Paint (LCP)',
          value: lcp,
          budget: PERFORMANCE_BUDGET.LCP,
          unit: 'ms',
          rating: lcpRating,
          score: calculateScore(lcp, PERFORMANCE_BUDGET.LCP, 4000),
        });
        if (lcpRating !== 'good') {
          recommendations.push('Optimize images with WebP/AVIF. Preload LCP element.');
        }
      } else {
        metrics.push({
          name: 'Largest Contentful Paint (LCP)',
          value: null,
          budget: PERFORMANCE_BUDGET.LCP,
          unit: 'ms',
          rating: 'pending',
          score: 0,
        });
      }
    }

    // CLS from layout-shift entries
    let clsValue = 0;
    const clsEntries = performance.getEntriesByType('layout-shift') as PerformanceEntry[];
    clsEntries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    const clsRating = PERFORMANCE_BUDGET.getRating('CLS', clsValue);
    metrics.push({
      name: 'Cumulative Layout Shift (CLS)',
      value: clsValue,
      budget: PERFORMANCE_BUDGET.CLS,
      unit: '',
      rating: clsRating,
      score: calculateScore(clsValue, PERFORMANCE_BUDGET.CLS, 0.25),
    });
    if (clsRating !== 'good') {
      recommendations.push('Set explicit dimensions on images/embeds. Avoid inserting content above existing content.');
    }

    // INP approximation
    let maxINP = 0;
    const eventEntries = performance.getEntriesByType('event') as PerformanceEventTiming[];
    eventEntries.forEach(entry => {
      const duration = entry.processingEnd - entry.processingStart;
      if (duration > maxINP) maxINP = duration;
    });
    if (maxINP > 0) {
      const inpRating = PERFORMANCE_BUDGET.getRating('INP', maxINP);
      metrics.push({
        name: 'Interaction to Next Paint (INP)',
        value: maxINP,
        budget: PERFORMANCE_BUDGET.INP,
        unit: 'ms',
        rating: inpRating,
        score: calculateScore(maxINP, PERFORMANCE_BUDGET.INP, 500),
      });
      if (inpRating !== 'good') {
        recommendations.push('Optimize event handlers. Break up long tasks with scheduler.yield().');
      }
    } else {
      metrics.push({
        name: 'Interaction to Next Paint (INP)',
        value: null,
        budget: PERFORMANCE_BUDGET.INP,
        unit: 'ms',
        rating: 'pending',
        score: 0,
      });
    }

    // Bundle size analysis
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalJS = 0;
    let totalCSS = 0;
    resources.forEach(r => {
      const size = r.transferSize || 0;
      if (r.initiatorType === 'script' || r.name.includes('.js')) {
        totalJS += size;
      } else if (r.initiatorType === 'css' || r.name.includes('.css')) {
        totalCSS += size;
      }
    });

    const bundleWithinBudget = totalJS <= PERFORMANCE_BUDGET.MAX_JS_BUNDLE && 
                               totalCSS <= PERFORMANCE_BUDGET.MAX_CSS_BUNDLE;
    
    if (!bundleWithinBudget) {
      if (totalJS > PERFORMANCE_BUDGET.MAX_JS_BUNDLE) {
        recommendations.push(`JS bundle (${formatBytes(totalJS)}) exceeds budget (${formatBytes(PERFORMANCE_BUDGET.MAX_JS_BUNDLE)}). Consider code splitting.`);
      }
      if (totalCSS > PERFORMANCE_BUDGET.MAX_CSS_BUNDLE) {
        recommendations.push(`CSS bundle (${formatBytes(totalCSS)}) exceeds budget (${formatBytes(PERFORMANCE_BUDGET.MAX_CSS_BUNDLE)}). Remove unused styles.`);
      }
    }

    // Calculate overall score
    const validMetrics = metrics.filter(m => m.value !== null);
    const overallScore = validMetrics.length > 0
      ? Math.round(validMetrics.reduce((sum, m) => sum + m.score, 0) / validMetrics.length)
      : 0;

    // Add general recommendations
    if (recommendations.length === 0) {
      recommendations.push('All metrics within budget. Consider monitoring for regressions.');
    }

    setReport({
      timestamp: new Date().toISOString(),
      url: window.location.href,
      metrics,
      overallScore,
      bundleAnalysis: {
        totalJS,
        totalCSS,
        withinBudget: bundleWithinBudget,
      },
      recommendations,
    });

    setIsRunning(false);
  };

  useEffect(() => {
    // Auto-run on mount after a delay to collect metrics
    const timer = setTimeout(runAudit, 2000);
    return () => clearTimeout(timer);
  }, []);

  const exportReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'needs-improvement': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'poor': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />;
    }
  };

  if (!report) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">collecting performance metrics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">performance report</h2>
          <p className="text-sm text-muted-foreground">
            {new Date(report.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={runAudit} disabled={isRunning}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            re-run
          </Button>
          <Button variant="outline" size="sm" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            export
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="bg-card border-border">
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-8">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${report.overallScore * 3.52} 352`}
                  className={getScoreColor(report.overallScore)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-4xl font-mono font-bold ${getScoreColor(report.overallScore)}`}>
                  {report.overallScore}
                </span>
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold">overall performance</h3>
              <p className="text-sm text-muted-foreground">
                {report.overallScore >= 90 ? 'excellent' : 
                 report.overallScore >= 50 ? 'needs improvement' : 'poor'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                based on {report.metrics.filter(m => m.value !== null).length} core web vitals
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">core web vitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {report.metrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getRatingIcon(metric.rating)}
                    <span className="font-medium">{metric.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">
                      {metric.value !== null 
                        ? `${metric.value.toFixed(metric.unit === '' ? 3 : 0)}${metric.unit}`
                        : 'pending...'}
                    </span>
                    <Badge variant={metric.rating === 'good' ? 'default' : 
                                   metric.rating === 'needs-improvement' ? 'secondary' : 
                                   metric.rating === 'pending' ? 'outline' : 'destructive'}>
                      {metric.rating}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress 
                    value={Math.min(100, metric.score)} 
                    className="h-2 flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-24 text-right">
                    budget: {metric.budget}{metric.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bundle Analysis */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            bundle analysis
            {report.bundleAnalysis.withinBudget 
              ? <CheckCircle2 className="h-4 w-4 text-green-500" />
              : <AlertTriangle className="h-4 w-4 text-yellow-500" />
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>JavaScript</span>
                <span className="font-mono">
                  {formatBytes(report.bundleAnalysis.totalJS)}
                </span>
              </div>
              <Progress 
                value={Math.min(100, (report.bundleAnalysis.totalJS / PERFORMANCE_BUDGET.MAX_JS_BUNDLE) * 100)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                budget: {formatBytes(PERFORMANCE_BUDGET.MAX_JS_BUNDLE)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CSS</span>
                <span className="font-mono">
                  {formatBytes(report.bundleAnalysis.totalCSS)}
                </span>
              </div>
              <Progress 
                value={Math.min(100, (report.bundleAnalysis.totalCSS / PERFORMANCE_BUDGET.MAX_CSS_BUNDLE) * 100)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                budget: {formatBytes(PERFORMANCE_BUDGET.MAX_CSS_BUNDLE)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {report.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Route Budgets */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">route performance budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {Object.entries(PERFORMANCE_BUDGET.routes).map(([route, config]) => (
              <div key={route} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{route}</code>
                <span className="text-sm text-muted-foreground">
                  max {config.maxLoadTime}ms
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function calculateScore(value: number, goodThreshold: number, poorThreshold: number): number {
  if (value <= goodThreshold) return 100;
  if (value >= poorThreshold) return 0;
  return Math.round(100 - ((value - goodThreshold) / (poorThreshold - goodThreshold)) * 100);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
