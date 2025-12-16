import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Copy, Check, Globe, DollarSign, ChevronDown, Code, Mail, Zap, Users, CheckCircle2, XCircle, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { getPlatformIcon, platformColors } from './PlatformIcons';
import { cn } from '@/lib/utils';
import { IdentifyDeveloperHandoff } from './IdentifyDeveloperHandoff';

interface SetupGuideProps {
  pixelId: string;
  supabaseUrl: string;
  onEmailDeveloper?: () => void;
}

const platforms = [
  { id: 'wordpress', name: 'WordPress' },
  { id: 'shopify', name: 'Shopify' },
  { id: 'wix', name: 'Wix' },
  { id: 'squarespace', name: 'Squarespace' },
  { id: 'webflow', name: 'Webflow' },
  { id: 'gtm', name: 'GTM' },
  { id: 'react', name: 'React' },
  { id: 'html', name: 'HTML' },
];

export const SetupGuide: React.FC<SetupGuideProps> = ({ 
  pixelId, 
  supabaseUrl,
  onEmailDeveloper 
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showRevenue, setShowRevenue] = useState(false);
  const [showCrossDevice, setShowCrossDevice] = useState(false);
  const [showFunnel, setShowFunnel] = useState(false);
  const [hasLogin, setHasLogin] = useState<boolean | null>(null);

  // Single unified pixel snippet - no identify by default
  const mainPixelSnippet = `<!-- utm.one Tracking Pixel -->
<script>
(function(w,d,p){
  w.utmone=w.utmone||function(){(w.utmone.q=w.utmone.q||[]).push(arguments)};
  var s=d.createElement('script');s.async=1;
  s.src='${supabaseUrl}/functions/v1/pixel-js?id='+p;
  d.head.appendChild(s);
})(window,document,'${pixelId}');
</script>`;

  // Revenue snippets
  const revenueSnippet = `utmone('track', 'purchase', { revenue: 99.99 });`;
  
  const shopifyRevenueSnippet = `{% if first_time_accessed %}
<script>
  utmone('track', 'purchase', { revenue: {{ total_price | money_without_currency }} });
</script>
{% endif %}`;

  const wordpressRevenueSnippet = `<!-- WooCommerce: Add to thankyou.php -->
<?php if ( $order ) : ?>
<script>
  utmone('track', 'purchase', { revenue: <?php echo $order->get_total(); ?> });
</script>
<?php endif; ?>`;

  // Funnel snippet
  const funnelSnippet = `// Track funnel stages
utmone('track', 'signup_start');
utmone('track', 'signup_complete');
utmone('track', 'trial_start');
utmone('track', 'purchase', { revenue: 99.99 });`;

  const copyToClipboard = async (text: string, snippetName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSnippet(snippetName);
      toast.success(`${snippetName} copied`);
      setTimeout(() => setCopiedSnippet(null), 2000);
    } catch {
      toast.error("Copy failed, please select and copy manually");
    }
  };

  const getRevenueSnippetForPlatform = () => {
    switch (selectedPlatform) {
      case 'shopify':
        return shopifyRevenueSnippet;
      case 'wordpress':
        return wordpressRevenueSnippet;
      default:
        return `<script>\n${revenueSnippet}\n</script>`;
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-foreground">
          <Code className="h-5 w-5 text-primary" />
          install the pixel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* STEP 1: Main pixel - ONE code block */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">copy this code</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">
                  ALL PAGES
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">paste in your website's &lt;head&gt; section</p>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-zinc-950 dark:bg-zinc-900/50 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-border text-zinc-300">
              <code>{mainPixelSnippet}</code>
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(mainPixelSnippet, 'Pixel code')}
            >
              {copiedSnippet === 'Pixel code' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {/* Platform selector */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">where to paste this?</p>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => {
                const Icon = getPlatformIcon(platform.id);
                const isSelected = selectedPlatform === platform.id;
                return (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(isSelected ? null : platform.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-all text-xs",
                      isSelected 
                        ? "border-primary bg-primary/10 text-foreground" 
                        : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: platformColors[platform.id] }} />
                    {platform.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Success message */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-700 dark:text-green-400">
              that's it! attribution tracking is now active on your site.
            </p>
          </div>
        </div>

        {/* OPTIONAL SECTIONS */}
        <div className="pt-4 border-t border-border space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">optional enhancements</p>

          {/* OPTIONAL: Revenue Tracking */}
          <Collapsible open={showRevenue} onOpenChange={setShowRevenue}>
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-all",
                showRevenue ? "bg-green-500/5 border-green-500/20" : "bg-muted/50 border-border hover:border-green-500/30"
              )}>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">track revenue</p>
                    <p className="text-xs text-muted-foreground">see which campaigns drive actual sales</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">
                    THANK-YOU PAGE
                  </Badge>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showRevenue && "rotate-180")} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-4 pl-4 border-l-2 border-green-500/20">
              <p className="text-sm text-muted-foreground">
                add this <strong>one line</strong> to your thank-you/confirmation page:
              </p>
              
              <div className="relative">
                <pre className="bg-zinc-950 dark:bg-zinc-900/50 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-border text-zinc-300">
                  <code>{getRevenueSnippetForPlatform()}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(getRevenueSnippetForPlatform(), 'Revenue code')}
                >
                  {copiedSnippet === 'Revenue code' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              {/* GTM Warning */}
              {selectedPlatform === 'gtm' && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Globe className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-amber-600 dark:text-amber-400 mb-1">GTM: wrap in &lt;script&gt; tags</p>
                    <p className="text-muted-foreground">
                      when pasting into GTM Custom HTML tags, always include <code className="bg-amber-500/20 px-1 rounded">&lt;script&gt;</code> and <code className="bg-amber-500/20 px-1 rounded">&lt;/script&gt;</code> tags. 
                      without them, code appears as visible text on your page.
                    </p>
                  </div>
                </div>
              )}

              {selectedPlatform === 'shopify' && (
                <p className="text-xs text-muted-foreground">
                  Add to your <code className="bg-muted px-1 rounded">checkout.liquid</code> or order confirmation page.
                </p>
              )}
              {selectedPlatform === 'wordpress' && (
                <p className="text-xs text-muted-foreground">
                  Add to your WooCommerce <code className="bg-muted px-1 rounded">thankyou.php</code> template.
                </p>
              )}

              <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">what value should I use?</p>
                <ul className="space-y-0.5">
                  <li>🛒 <strong>Purchases:</strong> actual order total</li>
                  <li>📝 <strong>Leads:</strong> average deal size, or $0 to count</li>
                  <li>👤 <strong>Signups:</strong> plan price, or $0 for free</li>
                </ul>
              </div>
              
              {/* Link to revenue calculator */}
              <div className="flex items-center gap-2 p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <Calculator className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">
                  not sure what value to use?{' '}
                  <button 
                    onClick={() => {
                      document.getElementById('revenue-calculator')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    use our calculator below ↓
                  </button>
                </span>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* OPTIONAL: 100% Cross-Device Accuracy */}
          <Collapsible open={showCrossDevice} onOpenChange={setShowCrossDevice}>
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-all",
                showCrossDevice ? "bg-amber-500/5 border-amber-500/20" : "bg-muted/50 border-border hover:border-amber-500/30"
              )}>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-amber-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">100% cross-device accuracy</p>
                    <p className="text-xs text-muted-foreground">upgrade from 75-95% → 100% after user logs in</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                    AFTER LOGIN
                  </Badge>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showCrossDevice && "rotate-180")} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-4 pl-4 border-l-2 border-amber-500/20">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Zap className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="text-foreground font-medium mb-1">you already have 75-95% cross-device tracking</p>
                  <p className="text-muted-foreground">
                    we automatically link devices using IP, location, and device signals. 
                    add <code className="bg-amber-500/20 px-1 rounded">identify()</code> to get <strong>100% accuracy</strong> for logged-in users.
                  </p>
                </div>
              </div>

              {/* Do you have login? */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">do you have user login/signup on your website?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setHasLogin(true)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                      hasLogin === true
                        ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
                        : "border-border hover:border-green-500/50 text-muted-foreground"
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">yes, we have login</span>
                  </button>
                  <button
                    onClick={() => setHasLogin(false)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                      hasLogin === false
                        ? "border-muted-foreground bg-muted text-foreground"
                        : "border-border hover:border-muted-foreground text-muted-foreground"
                    )}
                  >
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">no login</span>
                  </button>
                </div>
              </div>

              {/* No login - reassurance */}
              {hasLogin === false && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-green-700 dark:text-green-400 mb-1">no worries! you're all set</p>
                    <p className="text-green-600/80 dark:text-green-400/80 text-xs">
                      you're already getting 75-95% cross-device accuracy automatically. 
                      this is significantly better than most analytics tools which don't track cross-device at all.
                    </p>
                  </div>
                </div>
              )}

              {/* Has login - show developer handoff */}
              {hasLogin === true && (
                <IdentifyDeveloperHandoff pixelId={pixelId} />
              )}

              {hasLogin === null && (
                <p className="text-xs text-muted-foreground italic">
                  👆 select an option above to see setup instructions
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* ADVANCED: Funnel Tracking */}
          <Collapsible open={showFunnel} onOpenChange={setShowFunnel}>
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-all",
                showFunnel ? "bg-muted border-border" : "bg-muted/30 border-border/50 hover:border-border"
              )}>
                <div className="flex items-center gap-3">
                  <Code className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-muted-foreground">advanced: funnel tracking</p>
                    <p className="text-xs text-muted-foreground">track custom events at each conversion stage</p>
                  </div>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showFunnel && "rotate-180")} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3 pl-4 border-l-2 border-border">
              <div className="relative">
                <pre className="bg-zinc-950 dark:bg-zinc-900/50 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-border text-zinc-300">
                  <code>{funnelSnippet}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(funnelSnippet, 'Funnel code')}
                >
                  {copiedSnippet === 'Funnel code' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            need help? send instructions to your developer
          </p>
          {onEmailDeveloper && (
            <Button variant="outline" size="sm" onClick={onEmailDeveloper} className="gap-2">
              <Mail className="h-4 w-4" />
              Email to Developer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SetupGuide;
