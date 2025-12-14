import { useState } from 'react';
import { PerformanceReport } from '@/components/dev/PerformanceReport';
import { OptimizationChecklist } from '@/components/dev/OptimizationChecklist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Development-only performance audit page
 * Access via /dev/performance
 */
export default function PerformanceAudit() {
  const [activeTab, setActiveTab] = useState('checklist');

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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="checklist">Optimization Checklist</TabsTrigger>
            <TabsTrigger value="metrics">Web Vitals</TabsTrigger>
          </TabsList>
          <TabsContent value="checklist">
            <OptimizationChecklist />
          </TabsContent>
          <TabsContent value="metrics">
            <PerformanceReport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
