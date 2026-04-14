import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LiftData {
  channel: string;
  treatment_conversions: number;
  treatment_total: number;
  treatment_rate: number;
  baseline_conversions: number;
  baseline_total: number;
  baseline_rate: number;
  lift_percent: number;
  lift_category: string;
}

const LiftIndicator: React.FC<{ lift: number; category: string }> = ({ lift, category }) => {
  if (category === 'positive') {
    return (
      <div className="flex items-center gap-1 text-green-500">
        <ArrowUp className="h-4 w-4" />
        <span className="font-semibold">+{lift}%</span>
      </div>
    );
  }
  if (category === 'negative') {
    return (
      <div className="flex items-center gap-1 text-red-500">
        <ArrowDown className="h-4 w-4" />
        <span className="font-semibold">{lift}%</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Minus className="h-4 w-4" />
      <span className="font-semibold">{lift}%</span>
    </div>
  );
};

export const LiftAnalysis: React.FC = () => {
  const { currentWorkspace } = useWorkspaceContext();

  const { data: liftData, isLoading } = useQuery({
    queryKey: ['lift-analysis', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      
      const { data, error } = await (supabase as any).rpc("get_channel_lift", {
        p_workspace_id: currentWorkspace.id
      });
      
      if (error) throw error;
      return (data || []) as LiftData[];
    },
    enabled: !!currentWorkspace?.id,
  });

  const demandCreators = liftData?.filter(l => l.lift_category === 'positive') || [];
  const demandHarvesters = liftData?.filter(l => l.lift_category === 'neutral') || [];
  const churnDrivers = liftData?.filter(l => l.lift_category === 'negative') || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!liftData?.length) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-12 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">no lift data yet</h3>
          <p className="text-muted-foreground text-sm">
            lift analysis requires journey data with multiple channels and conversions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Sparkles className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">demand creators</p>
                <p className="text-2xl font-semibold text-foreground">{demandCreators.length}</p>
                <p className="text-xs text-green-500">channels that create new demand</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">demand harvesters</p>
                <p className="text-2xl font-semibold text-foreground">{demandHarvesters.length}</p>
                <p className="text-xs text-muted-foreground">channels that capture existing intent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">potential churn drivers</p>
                <p className="text-2xl font-semibold text-foreground">{churnDrivers.length}</p>
                <p className="text-xs text-red-500">channels with negative impact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explanation Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">how lift is calculated</p>
              <p className="text-xs text-muted-foreground mt-1">
                lift measures the <span className="font-medium">incremental</span> impact of a channel. 
                we compare the conversion rate of users who saw this channel vs. users who didn't. 
                a +100% lift means this channel <span className="font-medium">doubles</span> your conversion rate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lift Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">incremental lift by channel</CardTitle>
          <CardDescription>
            discover which channels actually cause conversions vs. just claim them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">channel</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">treatment rate</TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">conversion rate of users who saw this channel</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">baseline rate</TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">conversion rate of users who didn't see this channel</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">incremental lift</TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">(treatment - baseline) / baseline × 100</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                  <th className="text-center py-3 px-2 text-muted-foreground font-medium">category</th>
                </tr>
              </thead>
              <tbody>
                {liftData.map((l) => (
                  <tr key={l.channel} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium text-foreground">{l.channel}</td>
                    <td className="py-3 px-2 text-right text-foreground">
                      {l.treatment_rate}%
                      <span className="text-xs text-muted-foreground ml-1">
                        ({l.treatment_conversions}/{l.treatment_total})
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-foreground">
                      {l.baseline_rate}%
                      <span className="text-xs text-muted-foreground ml-1">
                        ({l.baseline_conversions}/{l.baseline_total})
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <LiftIndicator lift={l.lift_percent} category={l.lift_category} />
                    </td>
                    <td className="py-3 px-2 text-center">
                      {l.lift_category === 'positive' && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          demand creator
                        </Badge>
                      )}
                      {l.lift_category === 'neutral' && (
                        <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                          harvester
                        </Badge>
                      )}
                      {l.lift_category === 'negative' && (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          review needed
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      {demandCreators.length > 0 && (
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">top demand creator insight</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-medium text-green-500">{demandCreators[0]?.channel}</span> has a{' '}
                  <span className="font-medium">+{demandCreators[0]?.lift_percent}%</span> lift. 
                  these users are {Math.round((demandCreators[0]?.treatment_rate / Math.max(demandCreators[0]?.baseline_rate, 0.01)))}x more likely to convert 
                  because of this channel. consider increasing investment here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {churnDrivers.length > 0 && (
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">warning: potential negative impact</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-medium text-red-500">{churnDrivers[0]?.channel}</span> shows a{' '}
                  <span className="font-medium">{churnDrivers[0]?.lift_percent}%</span> lift. 
                  users exposed to this channel convert at a lower rate than those who aren't. 
                  review the messaging or targeting for this channel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
