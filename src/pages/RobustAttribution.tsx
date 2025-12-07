import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, Upload, Tag, Clock, TrendingUp, Radio, ChevronDown, ChevronUp, ExternalLink, Zap, BarChart3, Sparkles, AlertCircle } from 'lucide-react';
import { IdentityGraphView } from '@/components/attribution/IdentityGraphView';
import { OfflineImporter } from '@/components/attribution/OfflineImporter';
import { TopicAttributionView } from '@/components/attribution/TopicAttributionView';
import { VelocityAnalytics } from '@/components/attribution/VelocityAnalytics';
import { LiftAnalysis } from '@/components/attribution/LiftAnalysis';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { useIdentityGraph, useTopicAttribution } from '@/hooks/useAttribution';
import { useRealtimeIdentityGraph } from '@/hooks/useRealtimeIdentityGraph';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RobustAttribution: React.FC = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { data: edges } = useIdentityGraph(currentWorkspace?.id);
  const { data: topics } = useTopicAttribution(currentWorkspace?.id);
  const { isConnected, liveCount } = useRealtimeIdentityGraph(currentWorkspace?.id);

  // Lift data for summary
  const { data: liftData } = useQuery({
    queryKey: ['lift-analysis', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      const { data, error } = await supabase.rpc('get_channel_lift', {
        p_workspace_id: currentWorkspace.id
      });
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentWorkspace?.id,
  });

  // Collapsible states
  const [showIdentity, setShowIdentity] = useState(false);
  const [showOffline, setShowOffline] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
  const [showLift, setShowLift] = useState(false);
  const [showVelocity, setShowVelocity] = useState(false);

  // Stats
  const identityCount = edges?.length || 0;
  const topicCount = topics?.length || 0;
  const totalTopicRevenue = topics?.reduce((sum, t) => sum + Number(t.total_revenue), 0) || 0;
  const demandCreators = liftData?.filter((l: any) => l.lift_category === 'positive')?.length || 0;
  const churnDrivers = liftData?.filter((l: any) => l.lift_category === 'negative')?.length || 0;

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
            {isConnected && (
              <Badge variant="default" className="bg-green-500 text-white">
                <Radio className="h-3 w-3 mr-1 animate-pulse" />
                live
              </Badge>
            )}
            {liveCount > 0 && (
              <Badge variant="secondary">+{liveCount} this session</Badge>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to="/analytics?tab=attribution">
                view in analytics
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Network className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{identityCount}</p>
                  <p className="text-xs text-muted-foreground">cross-device links</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">${totalTopicRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{topicCount} content topics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Sparkles className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{demandCreators}</p>
                  <p className="text-xs text-muted-foreground">demand creators</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{churnDrivers}</p>
                  <p className="text-xs text-muted-foreground">needs review</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* Identity Graph */}
          <Collapsible open={showIdentity} onOpenChange={setShowIdentity}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Network className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">identity graph</CardTitle>
                        <CardDescription>cross-device visitor connections</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{identityCount} links</Badge>
                      {showIdentity ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <IdentityGraphView />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Offline Import */}
          <Collapsible open={showOffline} onOpenChange={setShowOffline}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">offline import</CardTitle>
                        <CardDescription>reconcile CRM sales with online campaigns</CardDescription>
                      </div>
                    </div>
                    {showOffline ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <OfflineImporter />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Topic Attribution */}
          <Collapsible open={showTopics} onOpenChange={setShowTopics}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Tag className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">topic attribution</CardTitle>
                        <CardDescription>revenue by content category</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">${totalTopicRevenue.toLocaleString()}</Badge>
                      {showTopics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <TopicAttributionView />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Lift Analysis */}
          <Collapsible open={showLift} onOpenChange={setShowLift}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">lift analysis</CardTitle>
                        <CardDescription>incremental causal impact by channel</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        {demandCreators} creators
                      </Badge>
                      {showLift ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <LiftAnalysis />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Velocity Analytics */}
          <Collapsible open={showVelocity} onOpenChange={setShowVelocity}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">velocity analytics</CardTitle>
                        <CardDescription>time-to-convert by channel</CardDescription>
                      </div>
                    </div>
                    {showVelocity ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <VelocityAnalytics />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RobustAttribution;
