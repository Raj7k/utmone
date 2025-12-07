import { useState } from "react";
import { Copy, CheckCircle2, Code, Zap, Users, DollarSign, Globe, Target, TrendingUp, BarChart3, Layers, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { PixelDebugger } from "@/components/tracking/PixelDebugger";
import { EmailToDeveloperModal } from "@/components/tracking/EmailToDeveloperModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export const Tracking = () => {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspaceContext();
  const [copied, setCopied] = useState<string | null>(null);

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

  const revenueSnippet = `// Track purchase with revenue (on thank you page)
utmone('track', 'purchase', { revenue: 99.99 });

// Track lead with estimated value
utmone('track', 'lead', { revenue: 500 });`;

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
              The pixel must be installed on your website's &lt;head&gt; tag to capture visitor data and enable attribution tracking.
            </p>
          </div>
        </div>
      </Card>

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

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600 text-white">
              <DollarSign className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-label mb-2">track revenue on thank you/confirmation page</p>
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
                Replace 99.99 with your dynamic order total for accurate revenue attribution.
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

      {/* Platform-Specific Guides */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-title-3 font-semibold heading">platform-specific installation</h3>
          </div>
          <EmailToDeveloperModal />
        </div>

        <Tabs defaultValue="wordpress" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wordpress">WordPress</TabsTrigger>
            <TabsTrigger value="shopify">Shopify</TabsTrigger>
            <TabsTrigger value="react">React/Next.js</TabsTrigger>
            <TabsTrigger value="gtm">GTM</TabsTrigger>
          </TabsList>

          <TabsContent value="wordpress" className="mt-4">
            <div className="relative">
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
          </TabsContent>

          <TabsContent value="shopify" className="mt-4">
            <div className="relative">
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
          </TabsContent>

          <TabsContent value="react" className="mt-4">
            <div className="relative">
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
          </TabsContent>

          <TabsContent value="gtm" className="mt-4">
            <div className="relative">
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
          </TabsContent>
        </Tabs>
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
