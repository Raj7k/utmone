import { useWorkspace } from "@/hooks/useWorkspace";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";
import { useAnomalies } from "@/hooks/useAnomalies";
import { AnomalyAlert } from "@/components/analytics/AnomalyAlert";
import { RecentLinksWidget } from "@/components/dashboard/RecentLinksWidget";
import { TransparencyCard } from "@/components/dashboard/TransparencyCard";
import { SecurityOverviewWidget } from "@/components/dashboard/SecurityOverviewWidget";
import { AIRecommendationsWidget } from "@/components/dashboard/AIRecommendationsWidget";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { GlanceableMetrics } from "@/components/dashboard/GlanceableMetrics";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeatureHint } from "@/components/FeatureHint";

export default function Overview() {
  const { currentWorkspace } = useWorkspace();
  const { data: anomalies, invalidate: invalidateAnomalies } = useAnomalies(currentWorkspace?.id || '');
  const [hasLinks, setHasLinks] = useState(false);
  const [hasQrCodes, setHasQrCodes] = useState(false);

  useEffect(() => {
    const checkProgress = async () => {
      if (!currentWorkspace) return;

      const { data: links } = await supabase
        .from('links')
        .select('id')
        .eq('workspace_id', currentWorkspace.id)
        .limit(1);
      
      setHasLinks(!!links && links.length > 0);

      if (links && links.length > 0) {
        const { data: qrs } = await supabase
          .from('qr_codes')
          .select('id')
          .in('link_id', links.map(l => l.id))
          .limit(1);
        
        setHasQrCodes(!!qrs && qrs.length > 0);
      }
    };

    checkProgress();
  }, [currentWorkspace]);

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-body-apple text-secondary-label">loading workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UsageLimitBanner />
      
      <FeatureHint
        id="dashboard-welcome"
        title="Welcome To Your Dashboard"
        description="This is your quick overview of link performance and recent activity. Create your first link to get started."
        className="mb-content"
      />
      
      <div>
        <h1 className="text-large-title font-bold text-label mb-2 heading">welcome back</h1>
        <p className="text-body-apple text-secondary-label">here's what's happening with your links today.</p>
      </div>

      {anomalies && anomalies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-title-2 font-semibold text-label">anomalies detected</h2>
          {anomalies.slice(0, 3).map((anomaly) => (
            <AnomalyAlert 
              key={anomaly.id} 
              anomaly={anomaly} 
              onDismiss={invalidateAnomalies}
            />
          ))}
        </div>
      )}

      <OnboardingChecklist
        hasLinks={hasLinks}
        hasQrCodes={hasQrCodes}
        hasViewedAnalytics={false}
        hasInvitedTeam={false}
        hasCustomDomain={false}
      />

      <GlanceableMetrics />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-card">
        <AIInsights />
        <RecentActivity />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-card">
        <AIRecommendationsWidget workspaceId={currentWorkspace.id} />
        <PerformanceMetrics workspaceId={currentWorkspace.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-card">
        <TransparencyCard />
        <SecurityOverviewWidget workspaceId={currentWorkspace.id} />
      </div>

      <RecentLinksWidget workspaceId={currentWorkspace.id} />
    </div>
  );
}
