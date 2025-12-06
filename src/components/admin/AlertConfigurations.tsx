import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Bell, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AlertConfig {
  id: string;
  alert_name: string;
  metric_type: string;
  threshold_value: number;
  comparison_operator: string;
  email_enabled: boolean;
  email_recipients: string[];
  slack_enabled: boolean;
  webhook_enabled: boolean;
  is_enabled: boolean;
}

export function AlertConfigurations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newAlert, setNewAlert] = useState({
    alert_name: '',
    metric_type: 'latency_p95',
    threshold_value: 100,
    comparison_operator: '>',
    email_enabled: false,
    email_recipients: '',
    slack_enabled: false,
    webhook_enabled: false,
  });

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alert-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AlertConfig[];
    },
  });

  const createAlert = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('alert_configurations')
        .insert({
          ...newAlert,
          email_recipients: newAlert.email_recipients ? newAlert.email_recipients.split(',').map(e => e.trim()) : [],
          created_by: user?.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-configurations'] });
      toast({ title: 'alert created', description: 'new alert rule has been configured' });
      setIsDialogOpen(false);
      setNewAlert({
        alert_name: '',
        metric_type: 'latency_p95',
        threshold_value: 100,
        comparison_operator: '>',
        email_enabled: false,
        email_recipients: '',
        slack_enabled: false,
        webhook_enabled: false,
      });
    },
    onError: (error: Error) => {
      toast({ title: 'failed to create alert', description: error.message, variant: 'destructive' });
    },
  });

  const toggleAlert = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('alert_configurations')
        .update({ is_enabled: enabled })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-configurations'] });
      toast({ title: 'alert updated' });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('alert_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-configurations'] });
      toast({ title: 'alert deleted' });
    },
  });

  const getMetricLabel = (metric: string) => {
    const labels: Record<string, string> = {
      latency_p95: 'Latency (p95)',
      error_rate: 'Error Rate',
      cache_hit_rate: 'Cache Hit Rate',
    };
    return labels[metric] || metric;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>alert configurations</CardTitle>
            </div>
            <CardDescription className="mt-2">
              automated alerts when metrics cross thresholds
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                new alert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>create alert rule</DialogTitle>
                <DialogDescription>
                  set up automated alerts for system metrics
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>alert name</Label>
                  <Input
                    value={newAlert.alert_name}
                    onChange={(e) => setNewAlert({ ...newAlert, alert_name: e.target.value })}
                    placeholder="High latency warning"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>metric</Label>
                  <Select value={newAlert.metric_type} onValueChange={(value) => setNewAlert({ ...newAlert, metric_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latency_p95">latency (p95)</SelectItem>
                      <SelectItem value="error_rate">error rate</SelectItem>
                      <SelectItem value="cache_hit_rate">cache hit rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>operator</Label>
                    <Select value={newAlert.comparison_operator} onValueChange={(value) => setNewAlert({ ...newAlert, comparison_operator: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=">">greater than</SelectItem>
                        <SelectItem value="<">less than</SelectItem>
                        <SelectItem value=">=">greater or equal</SelectItem>
                        <SelectItem value="<=">less or equal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>threshold</Label>
                    <Input
                      type="number"
                      value={newAlert.threshold_value}
                      onChange={(e) => setNewAlert({ ...newAlert, threshold_value: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label>email alerts</Label>
                    <Switch
                      checked={newAlert.email_enabled}
                      onCheckedChange={(checked) => setNewAlert({ ...newAlert, email_enabled: checked })}
                    />
                  </div>
                  
                  {newAlert.email_enabled && (
                    <Input
                      value={newAlert.email_recipients}
                      onChange={(e) => setNewAlert({ ...newAlert, email_recipients: e.target.value })}
                      placeholder="admin@company.com, ops@company.com"
                    />
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>cancel</Button>
                <Button onClick={() => createAlert.mutate()} disabled={!newAlert.alert_name}>
                  create alert
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-secondary-label">loading alerts...</div>
        ) : !alerts || alerts.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-secondary-label">no alerts configured yet</p>
            <p className="text-xs text-secondary-label mt-2">
              create your first alert to monitor system metrics
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 rounded-lg border">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{alert.alert_name}</h4>
                      <Badge variant={alert.is_enabled ? 'default' : 'secondary'}>
                        {alert.is_enabled ? 'active' : 'paused'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-secondary-label">
                      Alert when <code className="text-xs bg-muted px-1 py-0.5 rounded">{getMetricLabel(alert.metric_type)}</code>
                      {' '}{alert.comparison_operator} {alert.threshold_value}
                      {alert.metric_type.includes('rate') ? '%' : 'ms'}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs">
                      {alert.email_enabled && (
                        <Badge variant="outline">
                          email: {alert.email_recipients?.length || 0} recipient(s)
                        </Badge>
                      )}
                      {alert.slack_enabled && <Badge variant="outline">slack</Badge>}
                      {alert.webhook_enabled && <Badge variant="outline">webhook</Badge>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={alert.is_enabled}
                      onCheckedChange={(checked) => toggleAlert.mutate({ id: alert.id, enabled: checked })}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAlert.mutate(alert.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
