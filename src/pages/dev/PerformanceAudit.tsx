import { PerformanceReport } from '@/components/dev/PerformanceReport';

/**
 * Development-only performance audit page
 * Access via /dev/performance
 */
export default function PerformanceAudit() {
  if (!import.meta.env.DEV) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">this page is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <PerformanceReport />
      </div>
    </div>
  );
}
