import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Code, Globe, DollarSign } from 'lucide-react';
import { notify } from '@/lib/notify';

interface PixelInstallGuideProps {
  pixelId: string;
}

export const PixelInstallGuide: React.FC<PixelInstallGuideProps> = ({ pixelId }) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  // Unified main pixel snippet with identify included
  const mainPixelSnippet = `<!-- utm.one Pixel - ADD TO ALL PAGES in <head> -->
<script>
(function(w,d,p){
  w.utmone=w.utmone||function(){(w.utmone.q=w.utmone.q||[]).push(arguments)};
  var s=d.createElement('script');s.async=1;
  s.src='${supabaseUrl}/functions/v1/pixel-js?id='+p;
  d.head.appendChild(s);
})(window,document,'${pixelId}');

// ─────────────────────────────────────────────────────────────
// OPTIONAL: User identification (enables cross-device tracking)
// Call this AFTER user logs in or signs up:
// utmone('identify', 'user@email.com', 'User Name');
// ─────────────────────────────────────────────────────────────
</script>`;

  // Revenue snippet
  const revenueSnippet = `<!-- ADD TO THANK-YOU PAGE ONLY -->
<script>
// 🛒 For purchases - use your order total
utmone('track', 'purchase', { revenue: 99.99 });

// 📝 For leads - use your estimated deal value (or 0)
utmone('track', 'lead', { revenue: 500 });

// 👤 For signups - use plan price (or 0 for free)
utmone('track', 'signup', { revenue: 29 });
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
          2 simple steps to enable attribution tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 dark:bg-zinc-800/50">
            <TabsTrigger value="main" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">main pixel</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-blue-500/10 text-blue-600 border-blue-500/20">
                ALL PAGES
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">revenue</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-green-500/10 text-green-600 border-green-500/20">
                THANK-YOU ONLY
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">step 1: add to your website's &lt;head&gt;</h4>
                <Badge className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">ALL PAGES</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                paste this in your &lt;head&gt; tag. it automatically tracks pageviews, UTM parameters, 
                and enables cross-device identity matching when you call identify().
              </p>
            </div>
            <div className="relative">
              <pre className="bg-muted/50 dark:bg-zinc-800/50 p-4 rounded-lg text-sm overflow-x-auto border border-border dark:border-white/10">
                <code className="text-foreground">{mainPixelSnippet}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(mainPixelSnippet, 'main')}
              >
                {copiedSnippet === 'main' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-600 dark:text-amber-400">
                💡 <strong>Have user login?</strong> Uncomment the <code className="bg-muted px-1 rounded">utmone('identify')</code> line 
                and call it after login/signup for 100% accurate cross-device attribution.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">step 2: track revenue on thank-you page</h4>
                <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">THANK-YOU ONLY</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                add this to your order confirmation or thank-you page to track conversions and revenue.
              </p>
            </div>
            <div className="relative">
              <pre className="bg-muted/50 dark:bg-zinc-800/50 p-4 rounded-lg text-sm overflow-x-auto border border-border dark:border-white/10">
                <code className="text-foreground">{revenueSnippet}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(revenueSnippet, 'revenue')}
              >
                {copiedSnippet === 'revenue' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-green-600 dark:text-green-400">
                💰 Replace the numbers with your actual values. Use $0 for events where you just want to count conversions.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
          <h4 className="font-medium text-foreground mb-2">that's it! just 2 steps</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li><strong>Main pixel</strong> on all pages captures visitor journeys automatically</li>
            <li><strong>Revenue tracking</strong> on thank-you pages enables ROI attribution</li>
            <li>Optional <code className="bg-muted px-1 rounded">identify()</code> call enables cross-device tracking</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
