import { useState } from "react";
import { Copy, CheckCircle2, Code, Zap, Users, DollarSign, Globe, Target, TrendingUp, BarChart3, Layers, ShieldCheck, AlertTriangle, FlaskConical } from "lucide-react";
import { FormTrackingWizard } from "@/components/tracking/FormTrackingWizard";
import { RevenueTrackingWizard } from "@/components/tracking/RevenueTrackingWizard";
import { EventTypeQuickReference } from "@/components/tracking/EventTypeSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { PixelDebugger } from "@/components/tracking/PixelDebugger";
import { EmailToDeveloperModal } from "@/components/tracking/EmailToDeveloperModal";
import { InstallationMethodDecider } from "@/components/tracking/InstallationMethodDecider";
import InstallationFlowAnimation from "@/components/tracking/InstallationFlowAnimation";
import PlatformInstallGuide from "@/components/tracking/PlatformInstallGuide";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const Tracking = () => {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspaceContext();
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'direct' | 'gtm' | null>(null);

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

  const baseSnippet = `<!-- utm.one Tracking Pixel -->
<script>
(function(w,d,p){
  w.utmone=w.utmone||function(){(w.utmone.q=w.utmone.q||[]).push(arguments)};
  var s=d.createElement('script');s.async=1;
  s.src='${supabaseUrl}/functions/v1/pixel-js?id='+p;
  d.head.appendChild(s);
})(window,document,'${pixelId}');
</script>`;

  const identifySnippet = `// Call after user logs in or signs up
utmone('identify', 'user@example.com', 'John Doe');`;

  // Simplified revenue snippet with clearer instructions
  const revenueSnippet = `// 🛒 For purchases - use your order total
utmone('track', 'purchase', { revenue: 99.99 });

// 📝 For leads - use your estimated deal value (or 0)
utmone('track', 'lead', { revenue: 500 });

// 👤 For signups - use plan price (or 0 for free)
utmone('track', 'signup', { revenue: 29 });`;

  const funnelSnippet = `// Track funnel stages
utmone('track', 'signup_start');
utmone('track', 'signup_complete');
utmone('track', 'trial_start');
utmone('track', 'purchase', { revenue: 99.99 });`;

  const wordpressSnippet = `// Add to your theme's header.php or use a plugin like "Insert Headers and Footers"
// Paste in <head> section:

<script>
(function(w,d,p){
  w.utmone=w.utmone||function(){(w.utmone.q=w.utmone.q||[]).push(arguments)};
  var s=d.createElement('script');s.async=1;
  s.src='${supabaseUrl}/functions/v1/pixel-js?id='+p;
  d.head.appendChild(s);
})(window,document,'${pixelId}');
</script>`;

  const shopifySnippet = `// In Shopify Admin → Online Store → Themes → Edit Code
// Add to theme.liquid before </head>:

<script>
(function(w,d,p){
  w.utmone=w.utmone||function(){(w.utmone.q=w.utmone.q||[]).push(arguments)};
  var s=d.createElement('script');s.async=1;
  s.src='${supabaseUrl}/functions/v1/pixel-js?id='+p;
  d.head.appendChild(s);
})(window,document,'${pixelId}');
</script>

// Track purchases on thank you page (checkout.liquid or order confirmation):
{% if first_time_accessed %}
<script>
  utmone('track', 'purchase', { revenue: {{ total_price | money_without_currency }} });
  utmone('identify', '{{ customer.email }}', '{{ customer.name }}');
</script>
{% endif %}`;

  const reactSnippet = `// In your App.tsx or _app.tsx (Next.js)
import { useEffect } from 'react';

useEffect(() => {
  // Load utm.one pixel
  (function(w: any, d: Document, p: string) {
    w.utmone = w.utmone || function() {
      (w.utmone.q = w.utmone.q || []).push(arguments);
    };
    const s = d.createElement('script');
    s.async = true;
    s.src = '${supabaseUrl}/functions/v1/pixel-js?id=' + p;
    d.head.appendChild(s);
  })(window, document, '${pixelId}');
}, []);

// Track events anywhere in your app:
declare global {
  interface Window {
    utmone: (...args: any[]) => void;
  }
}

// After successful login:
window.utmone('identify', user.email, user.name);

// After successful purchase:
window.utmone('track', 'purchase', { revenue: order.total });`;

  const gtmSnippet = `// In Google Tag Manager:
// 1. Create new Tag → Custom HTML
// 2. Paste this code:

<script>
(function(w,d,p){
  w.utmone=w.utmone||function(){(w.utmone.q=w.utmone.q||[]).push(arguments)};
  var s=d.createElement('script');s.async=1;
  s.src='${supabaseUrl}/functions/v1/pixel-js?id='+p;
  d.head.appendChild(s);
})(window,document,'${pixelId}');
</script>

// 3. Trigger: All Pages
// 4. For revenue tracking, create another tag triggered on purchase confirmation`;

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

      {/* Step-by-Step Installation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="text-title-3 font-semibold heading">step-by-step installation</h3>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary text-primary-foreground">
              <span className="text-sm font-bold">1</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-label mb-2">add the base pixel to your website's &lt;head&gt;</p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
                  <code>{baseSnippet}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(baseSnippet, 'Base snippet')}
                >
                  {copied === 'Base snippet' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-secondary-label mt-2">
                This automatically tracks all pageviews and captures UTM parameters.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary text-primary-foreground">
              <span className="text-sm font-bold">2</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-label mb-2">identify users after login/signup</p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
                  <code>{identifySnippet}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(identifySnippet, 'Identify snippet')}
                >
                  {copied === 'Identify snippet' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-secondary-label mt-2">
                Links the anonymous visitor_id to their email for cross-device tracking.
              </p>
            </div>
          </div>

          {/* Step 3 - Revenue (Simplified) */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600 text-white">
              <DollarSign className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-label mb-2">track revenue on thank-you page</p>
              
              {/* Simple explanation */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                  <strong>what value should I use?</strong>
                </p>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <li>🛒 <strong>Purchases:</strong> use the order total (e.g., $99.99)</li>
                  <li>📝 <strong>Form/Leads:</strong> use your average deal size, or $0 to just count them</li>
                  <li>👤 <strong>Signups:</strong> use your plan price, or $0 for free signups</li>
                </ul>
              </div>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
                  <code>{revenueSnippet}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(revenueSnippet, 'Revenue snippet')}
                >
                  {copied === 'Revenue snippet' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <p className="text-xs text-secondary-label mt-2">
                Replace the numbers with your actual values. Not sure? Use the wizard below to calculate your lead value.
              </p>
            </div>
          </div>

          {/* Step 4 (Optional) */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-muted text-muted-foreground">
              <span className="text-sm font-bold">4</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-label mb-2">track funnel stages (optional)</p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
                  <code>{funnelSnippet}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(funnelSnippet, 'Funnel snippet')}
                >
                  {copied === 'Funnel snippet' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-secondary-label mt-2">
                Track custom events at each stage of your conversion funnel.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Revenue Tracking Wizard - NEW */}
      <RevenueTrackingWizard pixelId={pixelId} supabaseUrl={supabaseUrl} />

      {/* Event Type Quick Reference */}
      <EventTypeQuickReference />

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

      {/* Platform-Specific Guides */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-title-3 font-semibold heading">platform-specific installation</h3>
          </div>
          <EmailToDeveloperModal />
        </div>

        <Tabs defaultValue={selectedMethod === 'gtm' ? 'gtm' : 'wordpress'} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex w-max">
              <TabsTrigger value="wordpress">WordPress</TabsTrigger>
              <TabsTrigger value="shopify">Shopify</TabsTrigger>
              <TabsTrigger value="wix">Wix</TabsTrigger>
              <TabsTrigger value="squarespace">Squarespace</TabsTrigger>
              <TabsTrigger value="webflow">Webflow</TabsTrigger>
              <TabsTrigger value="gtm">GTM</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* WordPress */}
          <TabsContent value="wordpress" className="mt-4">
            <PlatformInstallGuide platform="wordpress" pixelId={pixelId} />
            <details className="mt-4">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Show raw code snippet
              </summary>
              <div className="relative mt-2">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-64">
                  <code>{wordpressSnippet}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(wordpressSnippet, 'WordPress snippet')}
                >
                  {copied === 'WordPress snippet' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </details>
          </TabsContent>

          {/* Shopify */}
          <TabsContent value="shopify" className="mt-4">
            <PlatformInstallGuide platform="shopify" pixelId={pixelId} />
            <details className="mt-4">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Show raw code snippet
              </summary>
              <div className="relative mt-2">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-64">
                  <code>{shopifySnippet}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(shopifySnippet, 'Shopify snippet')}
                >
                  {copied === 'Shopify snippet' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </details>
          </TabsContent>

          {/* Wix */}
          <TabsContent value="wix" className="mt-4">
            <PlatformInstallGuide platform="wix" pixelId={pixelId} />
            <details className="mt-4">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Show raw code snippet
              </summary>
              <div className="relative mt-2">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-64">
                  <code>{baseSnippet}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(baseSnippet, 'Wix snippet')}
                >
                  {copied === 'Wix snippet' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </details>
          </TabsContent>

          {/* Squarespace */}
          <TabsContent value="squarespace" className="mt-4">
            <PlatformInstallGuide platform="squarespace" pixelId={pixelId} />
            <details className="mt-4">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Show raw code snippet
              </summary>
              <div className="relative mt-2">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-64">
                  <code>{baseSnippet}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(baseSnippet, 'Squarespace snippet')}
                >
                  {copied === 'Squarespace snippet' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </details>
          </TabsContent>

          {/* Webflow */}
          <TabsContent value="webflow" className="mt-4">
            <PlatformInstallGuide platform="webflow" pixelId={pixelId} />
            <details className="mt-4">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Show raw code snippet
              </summary>
              <div className="relative mt-2">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-64">
                  <code>{baseSnippet}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(baseSnippet, 'Webflow snippet')}
                >
                  {copied === 'Webflow snippet' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </details>
          </TabsContent>

          {/* GTM */}
          <TabsContent value="gtm" className="mt-4">
            {/* GTM Clarification */}
            <div className="mb-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                <strong>this installs the utm.one tracking pixel via google tag manager.</strong>
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                if you're already using GTM on your website, this is the recommended method.
              </p>
            </div>
            
            {/* Warning about dual installation */}
            <div className="mb-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>do NOT install both</strong> GTM AND direct – choose one method only.
                </p>
              </div>
            </div>

            <PlatformInstallGuide platform="gtm" pixelId={pixelId} />
            <details className="mt-4">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Show raw code snippet
              </summary>
              <div className="relative mt-2">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-64">
                  <code>{gtmSnippet}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(gtmSnippet, 'GTM snippet')}
                >
                  {copied === 'GTM snippet' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </details>
          </TabsContent>

          {/* React */}
          <TabsContent value="react" className="mt-4">
            <PlatformInstallGuide platform="react" pixelId={pixelId} />
            <details className="mt-4">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Show raw code snippet
              </summary>
              <div className="relative mt-2">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-64">
                  <code>{reactSnippet}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(reactSnippet, 'React snippet')}
                >
                  {copied === 'React snippet' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </details>
          </TabsContent>

          {/* HTML */}
          <TabsContent value="html" className="mt-4">
            <PlatformInstallGuide platform="html" pixelId={pixelId} />
            <details className="mt-4">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                Show raw code snippet
              </summary>
              <div className="relative mt-2">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-64">
                  <code>{baseSnippet}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(baseSnippet, 'HTML snippet')}
                >
                  {copied === 'HTML snippet' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </details>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Form Conversion Tracking */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="h-5 w-5 text-primary" />
          <h3 className="text-title-3 font-semibold heading">form conversion tracking</h3>
        </div>
        <p className="text-sm text-secondary-label mb-4">
          track form submissions, multi-step forms, and test your conversion tracking setup
        </p>
        <FormTrackingWizard pixelId={pixelId} />
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
    </div>
  );
};
