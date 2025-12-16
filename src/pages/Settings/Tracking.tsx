import { useState } from "react";
import { Copy, CheckCircle2, Code, Zap, Users, DollarSign, Globe, Target, TrendingUp, BarChart3, ShieldCheck, AlertTriangle } from "lucide-react";
import { RevenueTrackingWizard } from "@/components/tracking/RevenueTrackingWizard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { PixelDebugger } from "@/components/tracking/PixelDebugger";
import { EmailToDeveloperModal } from "@/components/tracking/EmailToDeveloperModal";
import { InstallationMethodDecider } from "@/components/tracking/InstallationMethodDecider";
import InstallationFlowAnimation from "@/components/tracking/InstallationFlowAnimation";
import SetupGuide from "@/components/tracking/SetupGuide";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export const Tracking = () => {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspaceContext();
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'direct' | 'gtm' | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Fetch pixel config
  const { data: pixelConfig, isLoading } = useQuery({
    queryKey: ['pixel-config', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return null;
      const { data, error } = await supabase
        .from('pixel_configs')
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

  const copyToClipboard = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopied(label);
    toast({
      title: "copied",
      description: `${label} copied to clipboard`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

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
          install the utm.one tracking pixel to capture visitor journeys, identity resolution, and revenue attribution
        </p>
      </div>

      {/* Critical Warning Banner */}
      <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
              ⚠️ without the tracking pixel, you won't be able to track conversions
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              The pixel must be installed on your website (not inside utm.one dashboard) to capture visitor data and enable attribution tracking.
            </p>
          </div>
        </div>
      </Card>

      {/* Installation Method Decider */}
      <InstallationMethodDecider onMethodSelect={setSelectedMethod} />

      {/* Pixel ID Display */}
      {pixelConfig && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-label mb-1">Your Pixel ID</p>
              <code className="text-lg font-mono text-primary">{pixelConfig.pixel_id}</code>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              Active
            </Badge>
          </div>
        </Card>
      )}

      {/* What the Pixel Tracks */}
      <Card className="p-6">
        <h3 className="text-title-3 font-semibold heading mb-4">what the pixel tracks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-label">Visitor Journey</p>
              <p className="text-xs text-secondary-label">Pageviews, UTM parameters, device info</p>
              <Badge variant="outline" className="mt-1 text-xs">Automatic</Badge>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-label">Identity Resolution</p>
              <p className="text-xs text-secondary-label">Links visitor_id to email</p>
              <Badge variant="outline" className="mt-1 text-xs">utmone('identify')</Badge>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-label">Revenue Attribution</p>
              <p className="text-xs text-secondary-label">Purchase events with value</p>
              <Badge variant="outline" className="mt-1 text-xs">utmone('track', 'purchase')</Badge>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Target className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-label">Funnel Tracking</p>
              <p className="text-xs text-secondary-label">Lead → Signup → Purchase stages</p>
              <Badge variant="outline" className="mt-1 text-xs">utmone('track', 'event')</Badge>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-label">Sales Velocity</p>
              <p className="text-xs text-secondary-label">Time from first touch to conversion</p>
              <Badge variant="outline" className="mt-1 text-xs">Automatic</Badge>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <BarChart3 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-label">Lift Analysis</p>
              <p className="text-xs text-secondary-label">A/B comparison attribution</p>
              <Badge variant="outline" className="mt-1 text-xs">Automatic</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Real-Time Debugger */}
      <PixelDebugger />

      {/* NEW: Simplified Setup Guide - 2 Section Architecture */}
      <SetupGuide 
        pixelId={pixelId} 
        supabaseUrl={supabaseUrl}
        onEmailDeveloper={() => setShowEmailModal(true)}
      />

      {/* Revenue Tracking Wizard - for calculating lead values */}
      <Card className="p-6">
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
