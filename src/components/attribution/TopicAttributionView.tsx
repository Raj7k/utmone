import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { useTopicAttribution } from '@/hooks/useAttribution';
import { Tag, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TOPIC_COLORS: Record<string, string> = {
  'pricing': '#10B981',
  'product': '#3B82F6',
  'case-study': '#8B5CF6',
  'blog': '#F59E0B',
  'documentation': '#6366F1',
  'security': '#EF4444',
  'enterprise': '#06B6D4',
  'developer': '#84CC16',
  'marketing': '#EC4899',
  'sales': '#F97316',
};

const getTopicColor = (topic: string): string => {
  return TOPIC_COLORS[topic] || '#6B7280';
};

export const TopicAttributionView: React.FC = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { data: topics, isLoading } = useTopicAttribution(currentWorkspace?.id);

  const sortedTopics = [...(topics || [])].sort((a, b) => b.total_revenue - a.total_revenue);
  const totalRevenue = sortedTopics.reduce((sum, t) => sum + Number(t.total_revenue), 0);
  const totalConversions = sortedTopics.reduce((sum, t) => sum + Number(t.conversions), 0);

  const chartData = sortedTopics.slice(0, 8).map(topic => ({
    name: topic.topic,
    revenue: Number(topic.total_revenue),
    conversions: Number(topic.conversions),
  }));

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card dark:bg-zinc-900/40 border-border dark:border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{sortedTopics.length}</p>
              <p className="text-sm text-muted-foreground">content topics</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card dark:bg-zinc-900/40 border-border dark:border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">
                ${totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">total attributed revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card dark:bg-zinc-900/40 border-border dark:border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{totalConversions}</p>
              <p className="text-sm text-muted-foreground">total conversions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Topic Chart */}
      <Card className="bg-card dark:bg-zinc-900/40 border-border dark:border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BarChart3 className="h-5 w-5" />
            revenue by content topic
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            automatically tagged content categories driving conversions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">no topic data available yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                topics are automatically extracted when links are created
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getTopicColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Topic Details Table */}
      <Card className="bg-card dark:bg-zinc-900/40 border-border dark:border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Tag className="h-5 w-5" />
            topic performance breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedTopics.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">no topics found</p>
          ) : (
            <div className="space-y-3">
              {sortedTopics.map((topic, idx) => {
                const revenueShare = totalRevenue > 0 
                  ? Math.round((Number(topic.total_revenue) / totalRevenue) * 100)
                  : 0;
                const avgRevenue = Number(topic.conversions) > 0 
                  ? Math.round(Number(topic.total_revenue) / Number(topic.conversions))
                  : 0;

                return (
                  <motion.div
                    key={topic.topic}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 dark:bg-zinc-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: getTopicColor(topic.topic) }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{topic.topic}</Badge>
                          {idx === 0 && (
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              top performer
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {topic.link_count} links • {topic.conversions} conversions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {Number(topic.total_revenue).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {revenueShare}% of revenue • ${avgRevenue} avg
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
