import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Code, Zap, User } from 'lucide-react';
import { notify } from '@/lib/notify';

interface PixelInstallGuideProps {
  pixelId: string;
}

export const PixelInstallGuide: React.FC<PixelInstallGuideProps> = ({ pixelId }) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  const basicSnippet = `<!-- utm.one Tracking Pixel -->
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'${supabaseUrl}/functions/v1/pixel-js?id='+i;f.parentNode.insertBefore(j,f);
})(window,document,'script','utmoneLayer','${pixelId}');
</script>
<!-- End utm.one Tracking Pixel -->`;

  const identifySnippet = `// Call this after user signs up or logs in
utmone.identify('user@example.com', 'John Doe');

// Example: After form submission
document.getElementById('signup-form').addEventListener('submit', function(e) {
  var email = document.getElementById('email').value;
  var name = document.getElementById('name').value;
  utmone.identify(email, name);
});`;

  const conversionSnippet = `// Track a conversion event
utmone.track('purchase', { revenue: 99.99 });

// Track custom events
utmone.track('signup');
utmone.track('demo_request');
utmone.track('add_to_cart', { revenue: 49.99 });`;

  const fullExampleSnippet = `<!-- utm.one Tracking Pixel (place in <head>) -->
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'${supabaseUrl}/functions/v1/pixel-js?id='+i;f.parentNode.insertBefore(j,f);
})(window,document,'script','utmoneLayer','${pixelId}');
</script>

<!-- Example: Identify user after login -->
<script>
  // After user authenticates, call identify with their email
  function onUserLogin(user) {
    if (window.utmone && user.email) {
      utmone.identify(user.email, user.name);
    }
  }
</script>

<!-- Example: Track conversion on purchase -->
<script>
  function onPurchaseComplete(order) {
    if (window.utmone) {
      utmone.track('purchase', { 
        revenue: order.total,
        event_name: 'order_' + order.id 
      });
    }
  }
</script>`;

  const copyToClipboard = async (text: string, snippetName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSnippet(snippetName);
      notify.success(`${snippetName} snippet copied`);
      setTimeout(() => setCopiedSnippet(null), 2000);
    } catch {
      notify.error("copy failed, please select and copy manually");
    }
  };

  return (
    <Card className="bg-card dark:bg-zinc-900/40 border-border dark:border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Code className="h-5 w-5" />
          pixel installation guide
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          install the tracking pixel and SDK to enable cross-device identity resolution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="bg-muted/50 dark:bg-zinc-800/50">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              basic setup
            </TabsTrigger>
            <TabsTrigger value="identify" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              identify users
            </TabsTrigger>
            <TabsTrigger value="conversions" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              conversions
            </TabsTrigger>
            <TabsTrigger value="full" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              full example
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">1. add to your website's &lt;head&gt;</h4>
                <Badge variant="secondary" className="text-xs">required</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                paste this snippet in your website's &lt;head&gt; tag. it automatically tracks pageviews 
                and enables cross-device identity matching.
              </p>
            </div>
            <div className="relative">
              <pre className="bg-muted/50 dark:bg-zinc-800/50 p-4 rounded-lg text-sm overflow-x-auto border border-border dark:border-white/10">
                <code className="text-foreground">{basicSnippet}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(basicSnippet, 'basic')}
              >
                {copiedSnippet === 'basic' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="identify" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">2. identify users (critical for cross-device)</h4>
                <Badge className="text-xs bg-amber-500/20 text-amber-500">recommended</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                call <code className="bg-muted px-1 rounded">utmone.identify()</code> when users sign up, 
                log in, or submit forms with their email. this enables deterministic cross-device matching 
                with 100% confidence.
              </p>
            </div>
            <div className="relative">
              <pre className="bg-muted/50 dark:bg-zinc-800/50 p-4 rounded-lg text-sm overflow-x-auto border border-border dark:border-white/10">
                <code className="text-foreground">{identifySnippet}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(identifySnippet, 'identify')}
              >
                {copiedSnippet === 'identify' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="conversions" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">3. track conversions</h4>
                <Badge variant="outline" className="text-xs">optional</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                track revenue and conversion events using <code className="bg-muted px-1 rounded">utmone.track()</code>. 
                include revenue values for accurate ROI attribution.
              </p>
            </div>
            <div className="relative">
              <pre className="bg-muted/50 dark:bg-zinc-800/50 p-4 rounded-lg text-sm overflow-x-auto border border-border dark:border-white/10">
                <code className="text-foreground">{conversionSnippet}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(conversionSnippet, 'conversions')}
              >
                {copiedSnippet === 'conversions' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="full" className="mt-4 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">complete implementation example</h4>
              <p className="text-sm text-muted-foreground">
                a complete example showing pixel installation, user identification, and conversion tracking.
              </p>
            </div>
            <div className="relative">
              <pre className="bg-muted/50 dark:bg-zinc-800/50 p-4 rounded-lg text-sm overflow-x-auto border border-border dark:border-white/10 max-h-96">
                <code className="text-foreground">{fullExampleSnippet}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(fullExampleSnippet, 'full')}
              >
                {copiedSnippet === 'full' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
          <h4 className="font-medium text-foreground mb-2">how cross-device matching works</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li><strong>deterministic (100% confidence)</strong>: when you call <code className="bg-muted px-1 rounded">identify()</code> with email</li>
            <li><strong>probabilistic (70-90% confidence)</strong>: same IP address + compatible devices within time window</li>
            <li>identity edges are automatically created when matches are detected</li>
            <li>attribution calculations traverse these edges to unify cross-device journeys</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
