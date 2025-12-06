import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Upload, Tag, Clock, TrendingUp } from 'lucide-react';
import { IdentityGraphView } from '@/components/attribution/IdentityGraphView';
import { OfflineImporter } from '@/components/attribution/OfflineImporter';
import { TopicAttributionView } from '@/components/attribution/TopicAttributionView';
import { VelocityAnalytics } from '@/components/attribution/VelocityAnalytics';
import { LiftAnalysis } from '@/components/attribution/LiftAnalysis';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const RobustAttribution: React.FC = () => {
  const [activeTab, setActiveTab] = useState('identity');
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              robust attribution
            </h1>
            <p className="text-muted-foreground">
              enterprise-grade attribution with cross-device tracking, offline reconciliation, and content fingerprinting
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="advanced-mode"
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
            />
            <Label htmlFor="advanced-mode" className="text-sm text-muted-foreground cursor-pointer">
              advanced analytics
            </Label>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/50 dark:bg-zinc-800/50 p-1 rounded-lg flex-wrap h-auto">
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
            {showAdvanced && (
              <>
                <TabsTrigger 
                  value="velocity" 
                  className="flex items-center gap-2 data-[state=active]:bg-card dark:data-[state=active]:bg-zinc-900"
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">velocity</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="lift" 
                  className="flex items-center gap-2 data-[state=active]:bg-card dark:data-[state=active]:bg-zinc-900"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">lift analysis</span>
                </TabsTrigger>
              </>
            )}
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

          {showAdvanced && (
            <>
              <TabsContent value="velocity" className="mt-6">
                <VelocityAnalytics />
              </TabsContent>

              <TabsContent value="lift" className="mt-6">
                <LiftAnalysis />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RobustAttribution;
