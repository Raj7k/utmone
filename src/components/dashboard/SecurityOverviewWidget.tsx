import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SecurityOverviewWidgetProps {
  workspaceId: string;
}

export const SecurityOverviewWidget = ({ workspaceId }: SecurityOverviewWidgetProps) => {
  const navigate = useNavigate();

  const { data: securityStats, isLoading } = useQuery({
    queryKey: ["security-stats", workspaceId],
    queryFn: async () => {
      const { data: links, error } = await supabase
        .from("links")
        .select("security_status")
        .eq("workspace_id", workspaceId);

      if (error) throw error;

      const total = links?.length || 0;
      const safe = links?.filter(l => l.security_status === "safe").length || 0;
      const threats = links?.filter(l => l.security_status === "threats_detected").length || 0;
      const notScanned = links?.filter(l => l.security_status === "not_scanned").length || 0;

      const safePercentage = total > 0 ? Math.round((safe / total) * 100) : 0;

      return { total, safe, threats, notScanned, safePercentage };
    },
  });

  if (isLoading) {
    return (
      <Card variant="grouped">
        <CardContent className="py-8">
          <div className="animate-pulse text-center text-secondary-label">loading security data…</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="grouped" className="hover:shadow-lg transition-apple">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-system-blue" />
            <CardTitle>Security Overview</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-system-green" />
              <span className="text-sm text-secondary-label">Safe Links</span>
            </div>
            <div className="text-2xl font-bold text-label">{securityStats?.safe || 0}</div>
            <p className="text-xs text-tertiary-label">{securityStats?.safePercentage}% of total</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-system-red" />
              <span className="text-sm text-secondary-label">Threats</span>
            </div>
            <div className="text-2xl font-bold text-destructive">{securityStats?.threats || 0}</div>
            <p className="text-xs text-tertiary-label">Require attention</p>
          </div>
        </div>

        <div className="pt-4 border-t border-separator space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-system-orange" />
              <span className="text-sm text-secondary-label">Pending Scan</span>
            </div>
            <span className="text-sm font-medium text-label">{securityStats?.notScanned || 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-system-blue" />
              <span className="text-sm text-secondary-label">Total Links</span>
            </div>
            <span className="text-sm font-medium text-label">{securityStats?.total || 0}</span>
          </div>
        </div>

        <Button 
          variant="system-secondary" 
          size="sm" 
          className="w-full"
          onClick={() => navigate("/links")}
        >
          View All Links
        </Button>
      </CardContent>
    </Card>
  );
};
