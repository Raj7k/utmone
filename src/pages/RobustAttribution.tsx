import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Upload, Tag, GitBranch } from 'lucide-react';
import { IdentityGraphView } from '@/components/attribution/IdentityGraphView';
import { OfflineImporter } from '@/components/attribution/OfflineImporter';
import { TopicAttributionView } from '@/components/attribution/TopicAttributionView';

const RobustAttribution: React.FC = () => {
  const [activeTab, setActiveTab] = useState('identity');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            robust attribution
          </h1>
          <p className="text-muted-foreground">
            enterprise-grade attribution with cross-device tracking, offline reconciliation, and content fingerprinting
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/50 dark:bg-zinc-800/50 p-1 rounded-lg">
            <TabsTrigger 
              value="identity" 
              className="flex items-center gap-2 data-[state=active]:bg-card dark:data-[state=active]:bg-zinc-900"
            >
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">identity graph</span>
            </TabsTrigger>
            <TabsTrigger 
              value="offline" 
              className="flex items-center gap-2 data-[state=active]:bg-card dark:data-[state=active]:bg-zinc-900"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">offline import</span>
            </TabsTrigger>
            <TabsTrigger 
              value="topics" 
              className="flex items-center gap-2 data-[state=active]:bg-card dark:data-[state=active]:bg-zinc-900"
            >
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">topic attribution</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="mt-6">
            <IdentityGraphView />
          </TabsContent>

          <TabsContent value="offline" className="mt-6">
            <OfflineImporter />
          </TabsContent>

          <TabsContent value="topics" className="mt-6">
            <TopicAttributionView />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RobustAttribution;
