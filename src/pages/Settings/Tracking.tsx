import { useState } from "react";
import { Zap, DollarSign, TrendingUp, ShieldCheck } from "lucide-react";
import { RevenueTrackingWizard } from "@/components/tracking/RevenueTrackingWizard";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { PixelDebugger } from "@/components/tracking/PixelDebugger";
import { EmailToDeveloperModal } from "@/components/tracking/EmailToDeveloperModal";
import InstallationFlowAnimation from "@/components/tracking/InstallationFlowAnimation";
import SetupGuide from "@/components/tracking/SetupGuide";
import AutomaticAttributionHero from "@/components/tracking/AutomaticAttributionHero";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export const Tracking = () => {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspaceContext();
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Fetch pixel config
  const { data: pixelConfig, isLoading } = useQuery({
    queryKey: ['pixel-config', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return null;
      const { data, error } = await supabaseFrom('pixel_configs')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!currentWorkspace?.id,
  });

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const pixelId = pixelConfig?.pixel_id || 'YOUR_PIXEL_ID';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-2 font-semibold heading mb-2">tracking pixel</h2>
        <p className="text-body-apple text-secondary-label">
          install the utm.one tracking pixel to capture visitor journeys and revenue attribution
        </p>
      </div>

      {/* HERO: Automatic Attribution - The Key Differentiator */}
      <AutomaticAttributionHero />

      {/* Critical Warning Banner */}
      <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
              ⚠️ the pixel must be installed on your website
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              Install this on your website (not inside utm.one dashboard) to start capturing visitor data.
            </p>
          </div>
        </div>
      </Card>

      {/* Simplified Setup Guide - Single code block with optional sections */}
      <SetupGuide 
        pixelId={pixelId} 
        supabaseUrl={supabaseUrl}
        onEmailDeveloper={() => setShowEmailModal(true)}
      />

      {/* Real-Time Debugger */}
      <PixelDebugger />

      {/* Revenue Tracking Wizard - for calculating lead values */}
      <Card id="revenue-calculator" className="p-6 scroll-mt-20">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <h3 className="text-title-3 font-semibold heading">revenue value calculator</h3>
        </div>
        <p className="text-sm text-secondary-label mb-4">
          not sure what value to use for leads or signups? use this calculator to estimate your lead value.
        </p>
        <RevenueTrackingWizard pixelId={pixelId} supabaseUrl={supabaseUrl} />
      </Card>

      {/* Data Flow Animation */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-title-3 font-semibold heading">how the tracking pixel works</h3>
        </div>
        <p className="text-sm text-secondary-label mb-4">
          once installed, the pixel automatically captures visitor journeys and connects them to revenue
        </p>
        <InstallationFlowAnimation className="h-[180px]" />
      </Card>

      {/* Verification */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          <h3 className="text-title-3 font-semibold heading">verify installation</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">1</div>
            <p className="text-sm text-secondary-label">Open your website with the tracking pixel installed</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">2</div>
            <p className="text-sm text-secondary-label">Open browser DevTools (F12) → Console tab</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">3</div>
            <p className="text-sm text-secondary-label">
              Look for <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">[utm.one] Tracked: pageview</code>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">4</div>
            <p className="text-sm text-secondary-label">
              Test revenue: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">utmone('track', 'purchase', &#123; revenue: 100 &#125;)</code>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-medium">✓</div>
            <p className="text-sm text-secondary-label">Watch the debugger above - it should turn green!</p>
          </div>
        </div>
      </Card>

      {/* Email modal */}
      {showEmailModal && <EmailToDeveloperModal />}
    </div>
  );
};
