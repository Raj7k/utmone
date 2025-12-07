import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, TrendingUp, TrendingDown, Globe, Settings, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export const PulseWatchdogTile = () => {
  const { currentWorkspace } = useWorkspaceContext();

  // Fetch notification settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["notification-settings", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return null;
      
      const { data, error } = await supabase
        .from("workspace_notification_settings")
        .select("*")
        .eq("workspace_id", currentWorkspace.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!currentWorkspace?.id,
  });

  // Fetch recent anomalies
  const { data: recentAnomalies, isLoading: anomaliesLoading } = useQuery({
    queryKey: ["recent-anomalies", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      
      const { data, error } = await supabase
        .from("analytics_anomalies")
        .select("*, links(title, slug)")
        .eq("workspace_id", currentWorkspace.id)
        .eq("is_dismissed", false)
        .order("detected_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentWorkspace?.id,
  });

  const isEnabled = settings?.spike_alerts_enabled || settings?.drop_alerts_enabled || settings?.new_source_alerts_enabled;
  const isLoading = settingsLoading || anomaliesLoading;

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case "spike": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "drop": return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "new_source": return <Globe className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "warning": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            pulse watchdog
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            pulse watchdog
          </CardTitle>
          <div className="flex items-center gap-2">
            {isEnabled ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                active
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted text-muted-foreground">
                disabled
              </Badge>
            )}
            <Link to="/settings?tab=notifications">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!isEnabled ? (
          <div className="text-center py-4">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">
              anomaly detection is disabled
            </p>
            <Link to="/settings?tab=notifications">
              <Button size="sm" variant="outline">
                enable alerts
              </Button>
            </Link>
          </div>
        ) : recentAnomalies && recentAnomalies.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">recent alerts</p>
            {recentAnomalies.slice(0, 3).map((anomaly: any) => (
              <div 
                key={anomaly.id} 
                className="flex items-start gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                {getAnomalyIcon(anomaly.anomaly_type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {anomaly.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {anomaly.links?.title || anomaly.links?.slug || "Unknown link"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className={getSeverityColor(anomaly.severity)}>
                    {anomaly.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(anomaly.detected_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
            {recentAnomalies.length > 3 && (
              <Link to="/settings?tab=notifications" className="block">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  view all {recentAnomalies.length} alerts
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm text-muted-foreground">
              all systems normal
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              monitoring {settings?.spike_alerts_enabled && "spikes"}{settings?.drop_alerts_enabled && ", drops"}{settings?.new_source_alerts_enabled && ", new sources"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
