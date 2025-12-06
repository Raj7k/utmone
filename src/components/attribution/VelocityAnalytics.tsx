import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Clock, Zap, Timer, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface VelocityData {
  channel: string;
  avg_days_to_convert: number;
  median_days_to_convert: number;
  bucket_1_7_days: number;
  bucket_8_30_days: number;
  bucket_31_90_days: number;
  bucket_90_plus_days: number;
  total_conversions: number;
}

const BUCKET_COLORS = {
  '1-7 days': 'hsl(var(--chart-1))',
  '8-30 days': 'hsl(var(--chart-2))',
  '31-90 days': 'hsl(var(--chart-3))',
  '90+ days': 'hsl(var(--chart-4))',
};

export const VelocityAnalytics: React.FC = () => {
  const { currentWorkspace } = useWorkspaceContext();

  const { data: velocityData, isLoading } = useQuery({
    queryKey: ['velocity-analytics', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      
      const { data, error } = await supabase.rpc('get_conversion_velocity', {
        p_workspace_id: currentWorkspace.id
      });
      
      if (error) throw error;
      return (data || []) as VelocityData[];
    },
    enabled: !!currentWorkspace?.id,
  });

  const chartData = velocityData?.map(v => ({
    channel: v.channel,
    '1-7 days': v.bucket_1_7_days,
    '8-30 days': v.bucket_8_30_days,
    '31-90 days': v.bucket_31_90_days,
    '90+ days': v.bucket_90_plus_days,
    total: v.total_conversions,
    avg: v.avg_days_to_convert,
    median: v.median_days_to_convert,
  })) || [];

  const fastestChannel = velocityData?.reduce((prev, curr) => 
    (curr.median_days_to_convert < (prev?.median_days_to_convert || Infinity)) ? curr : prev
  , velocityData[0]);

  const slowestChannel = velocityData?.reduce((prev, curr) => 
    (curr.median_days_to_convert > (prev?.median_days_to_convert || 0)) ? curr : prev
  , velocityData[0]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!velocityData?.length) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-12 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">no velocity data yet</h3>
          <p className="text-muted-foreground text-sm">
            velocity analytics will appear once you have conversion events with journey data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">fastest channel</p>
                <p className="text-lg font-semibold text-foreground">{fastestChannel?.channel}</p>
                <p className="text-xs text-muted-foreground">
                  {fastestChannel?.median_days_to_convert} days median
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Timer className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">slowest channel</p>
                <p className="text-lg font-semibold text-foreground">{slowestChannel?.channel}</p>
                <p className="text-xs text-muted-foreground">
                  {slowestChannel?.median_days_to_convert} days median
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">total conversions</p>
                <p className="text-lg font-semibold text-foreground">
                  {velocityData.reduce((sum, v) => sum + v.total_conversions, 0)}
                </p>
                <p className="text-xs text-muted-foreground">across all channels</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning insight */}
      {slowestChannel && slowestChannel.median_days_to_convert > 60 && (
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  long sales cycle detected
                </p>
                <p className="text-xs text-muted-foreground">
                  your <span className="font-medium">{slowestChannel.channel}</span> leads take {slowestChannel.median_days_to_convert} days to convert. 
                  don't turn it off yet — the harvest is coming.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histogram Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">days to close by channel</CardTitle>
          <CardDescription>
            distribution of time-to-convert across your marketing channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="channel" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Bar dataKey="1-7 days" stackId="a" fill={BUCKET_COLORS['1-7 days']} />
                <Bar dataKey="8-30 days" stackId="a" fill={BUCKET_COLORS['8-30 days']} />
                <Bar dataKey="31-90 days" stackId="a" fill={BUCKET_COLORS['31-90 days']} />
                <Bar dataKey="90+ days" stackId="a" fill={BUCKET_COLORS['90+ days']} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">velocity breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">channel</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">avg days</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">median days</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">1-7d</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">8-30d</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">31-90d</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">90d+</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">total</th>
                </tr>
              </thead>
              <tbody>
                {velocityData.map((v) => (
                  <tr key={v.channel} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium text-foreground">{v.channel}</td>
                    <td className="py-3 px-2 text-right text-foreground">{v.avg_days_to_convert}</td>
                    <td className="py-3 px-2 text-right text-foreground">{v.median_days_to_convert}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{v.bucket_1_7_days}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{v.bucket_8_30_days}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{v.bucket_31_90_days}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{v.bucket_90_plus_days}</td>
                    <td className="py-3 px-2 text-right font-medium text-foreground">{v.total_conversions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
