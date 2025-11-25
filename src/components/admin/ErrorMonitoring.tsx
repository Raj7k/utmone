import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export const ErrorMonitoring = () => {
  // Fetch recent error events from audit logs
  const { data: errorEvents, isLoading } = useQuery({
    queryKey: ['error-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .or('action.ilike.%error%,action.ilike.%failed%')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Calculate error metrics
  const errorCounts = errorEvents?.reduce((acc, event) => {
    const errorType = event.action.replace('error_', '').replace('_', ' ');
    acc[errorType] = (acc[errorType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(errorCounts || {}).map(([name, count]) => ({
    name,
    count,
  }));

  const recentErrors = errorEvents?.slice(0, 10) || [];

  const totalErrors = errorEvents?.length || 0;
  const last24hErrors = errorEvents?.filter(
    (e) => new Date(e.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length || 0;

  const getSeverityIcon = (action: string) => {
    if (action.includes('auth') || action.includes('security')) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (action.includes('server')) {
      return <XCircle className="h-4 w-4 text-orange-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Error Monitoring...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Errors (7 days)</CardDescription>
            <CardTitle className="text-3xl font-bold">{totalErrors}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Errors (Last 24h)</CardDescription>
            <CardTitle className="text-3xl font-bold text-orange-600">
              {last24hErrors}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Error Types</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {Object.keys(errorCounts || {}).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Error Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Error Distribution by Type</CardTitle>
          <CardDescription>Count of errors by category</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--destructive))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No error data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Errors List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Errors</CardTitle>
          <CardDescription>Last 10 error events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentErrors.length > 0 ? (
              recentErrors.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="mt-0.5">{getSeverityIcon(event.action)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {event.action}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(event.created_at), 'MMM d, HH:mm:ss')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {event.resource_type}: {event.resource_id || 'N/A'}
                    </p>
                    {event.new_values && typeof event.new_values === 'object' && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {JSON.stringify(event.new_values)}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>No errors recorded. System healthy!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
