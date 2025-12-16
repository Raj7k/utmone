import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Copy, Check, Globe, DollarSign, ChevronDown, Code, Mail, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { getPlatformIcon, platformColors } from './PlatformIcons';
import { cn } from '@/lib/utils';

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
  const [hasUserAuth, setHasUserAuth] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Main pixel snippet with identify included as optional
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

  // Simple revenue snippet
  const revenueSnippet = `<!-- ADD TO THANK-YOU PAGE ONLY -->
<script>
utmone('track', 'purchase', { revenue: 99.99 });
</script>`;

  // Platform-specific revenue snippets
  const shopifyRevenueSnippet = `{% if first_time_accessed %}
<script>
  utmone('track', 'purchase', { revenue: {{ total_price | money_without_currency }} });
  utmone('identify', '{{ customer.email }}', '{{ customer.name }}');
</script>
{% endif %}`;

  const wordpressRevenueSnippet = `<!-- WooCommerce: Add to thankyou.php -->
<?php if ( $order ) : ?>
<script>
  utmone('track', 'purchase', { revenue: <?php echo $order->get_total(); ?> });
  utmone('identify', '<?php echo $order->get_billing_email(); ?>', '<?php echo $order->get_billing_first_name() . " " . $order->get_billing_last_name(); ?>');
</script>
<?php endif; ?>`;

  // Funnel snippet (advanced)
  const funnelSnippet = `// Track funnel stages (optional)
utmone('track', 'signup_start');
utmone('track', 'signup_complete');
utmone('track', 'trial_start');
utmone('track', 'purchase', { revenue: 99.99 });`;

  // Identify usage example
  const identifyExample = `// Call after successful login/signup
utmone('identify', 'user@example.com', 'John Doe');

// Example: After form submission
document.getElementById('login-form').addEventListener('submit', function(e) {
  var email = document.getElementById('email').value;
  var name = document.getElementById('name').value;
  utmone('identify', email, name);
});`;

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
        return revenueSnippet;
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-foreground">
          <Code className="h-5 w-5 text-primary" />
          pixel setup guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="main" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>main pixel</span>
              <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 bg-blue-500/10 text-blue-600 border-blue-500/20">
                ALL PAGES
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>revenue</span>
              <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 bg-green-500/10 text-green-600 border-green-500/20">
                THANK-YOU ONLY
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* MAIN PIXEL TAB */}
          <TabsContent value="main" className="space-y-6">
            {/* Platform selector */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">select your platform for specific instructions:</p>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => {
                  const Icon = getPlatformIcon(platform.id);
                  const isSelected = selectedPlatform === platform.id;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(isSelected ? null : platform.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
                        isSelected 
                          ? "border-primary bg-primary/10 text-foreground" 
                          : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" style={{ color: platformColors[platform.id] }} />
                      {platform.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main pixel code */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20">
                    <Globe className="h-3 w-3 mr-1" />
                    ALL PAGES
                  </Badge>
                  <span className="text-sm font-medium text-foreground">paste in your website's &lt;head&gt;</span>
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
                  onClick={() => copyToClipboard(mainPixelSnippet, 'Main pixel')}
                >
                  {copiedSnippet === 'Main pixel' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                This automatically tracks all pageviews, captures UTM parameters, and creates visitor IDs.
              </p>
            </div>

            {/* User auth checkbox */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
              <Checkbox 
                id="has-auth" 
                checked={hasUserAuth}
                onCheckedChange={(checked) => setHasUserAuth(checked === true)}
              />
              <div className="space-y-1">
                <label htmlFor="has-auth" className="text-sm font-medium text-foreground cursor-pointer">
                  I have user login/signup on my website
                </label>
                <p className="text-xs text-muted-foreground">
                  Enables cross-device tracking by linking anonymous visitors to their email
                </p>
              </div>
            </div>

            {/* Identify usage - shown when checkbox is checked */}
            {hasUserAuth && (
              <div className="space-y-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-foreground">how to use identify()</span>
                </div>
                <div className="relative">
                  <pre className="bg-zinc-950 dark:bg-zinc-900/50 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-border text-zinc-300">
                    <code>{identifyExample}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(identifyExample, 'Identify example')}
                  >
                    {copiedSnippet === 'Identify example' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  💡 Call this after successful login or signup to enable 100% accurate cross-device attribution.
                </p>
              </div>
            )}

            {/* Advanced (Funnel Tracking) */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvanced && "rotate-180")} />
                advanced: funnel tracking
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Track custom events at each stage of your conversion funnel for detailed analytics.
                </p>
                <div className="relative">
                  <pre className="bg-zinc-950 dark:bg-zinc-900/50 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-border text-zinc-300">
                    <code>{funnelSnippet}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(funnelSnippet, 'Funnel snippet')}
                  >
                    {copiedSnippet === 'Funnel snippet' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>

          {/* REVENUE TAB */}
          <TabsContent value="revenue" className="space-y-6">
            {/* Platform selector for revenue */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">select your platform for the correct revenue snippet:</p>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => {
                  const Icon = getPlatformIcon(platform.id);
                  const isSelected = selectedPlatform === platform.id;
                  return (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(isSelected ? null : platform.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
                        isSelected 
                          ? "border-primary bg-primary/10 text-foreground" 
                          : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" style={{ color: platformColors[platform.id] }} />
                      {platform.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* What value to use */}
            <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
              <p className="text-sm font-medium text-foreground mb-2">
                what revenue value should I use?
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>🛒 <strong>Purchases:</strong> use the order total (e.g., $99.99)</li>
                <li>📝 <strong>Form/Leads:</strong> use your average deal size, or $0 to just count them</li>
                <li>👤 <strong>Signups:</strong> use your plan price, or $0 for free signups</li>
              </ul>
            </div>

            {/* Revenue code */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20">
                  <DollarSign className="h-3 w-3 mr-1" />
                  THANK-YOU PAGE ONLY
                </Badge>
                <span className="text-sm font-medium text-foreground">add to your confirmation page</span>
              </div>
              
              <div className="relative">
                <pre className="bg-zinc-950 dark:bg-zinc-900/50 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-border text-zinc-300">
                  <code>{getRevenueSnippetForPlatform()}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(getRevenueSnippetForPlatform(), 'Revenue snippet')}
                >
                  {copiedSnippet === 'Revenue snippet' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              {selectedPlatform === 'shopify' && (
                <p className="text-xs text-muted-foreground">
                  Add this to your <code className="bg-muted px-1 rounded">checkout.liquid</code> or order confirmation page in Shopify.
                </p>
              )}
              {selectedPlatform === 'wordpress' && (
                <p className="text-xs text-muted-foreground">
                  Add this to your WooCommerce <code className="bg-muted px-1 rounded">thankyou.php</code> template.
                </p>
              )}
              {!selectedPlatform && (
                <p className="text-xs text-muted-foreground">
                  Replace <code className="bg-muted px-1 rounded">99.99</code> with your actual order value. Select a platform above for specific instructions.
                </p>
              )}
            </div>

            {/* Event types */}
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm font-medium text-foreground mb-2">other event types you can track:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <code className="bg-muted px-2 py-1 rounded text-muted-foreground">utmone('track', 'lead')</code>
                <code className="bg-muted px-2 py-1 rounded text-muted-foreground">utmone('track', 'signup')</code>
                <code className="bg-muted px-2 py-1 rounded text-muted-foreground">utmone('track', 'demo_request')</code>
                <code className="bg-muted px-2 py-1 rounded text-muted-foreground">utmone('track', 'add_to_cart')</code>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
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
