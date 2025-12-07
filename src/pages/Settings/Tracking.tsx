import { useState } from "react";
import { Copy, CheckCircle2, Code, Zap, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { PixelDebugger } from "@/components/tracking/PixelDebugger";
import { EmailToDeveloperModal } from "@/components/tracking/EmailToDeveloperModal";

export const Tracking = () => {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspaceContext();
  const [copied, setCopied] = useState(false);

  const workspaceId = currentWorkspace?.id || 'YOUR_WORKSPACE_ID';
  
  const snippetCode = `<!-- utm.one Tracking Pixel v2.0 -->
<script src="${window.location.origin}/tracker.js?v=2.0" async></script>

<!-- Optional: Identify users (place after user logs in) -->
<script>
  // Auto-identify on login (if email is available)
  window.utm.identify('user@example.com');
  
  // Or identify with additional data
  window.utm.identify('user@example.com', {
    name: 'John Doe',
    plan: 'pro'
  });
</script>`;

  const revenueCode = `<!-- Track Purchase/Conversion with Revenue -->
<script>
  // On your Thank You / Confirmation page:
  window.utm.track('purchase', { 
    value: 99.99,           // Order amount
    currency: 'USD',        // Currency code
    order_id: 'ORD-12345'   // Your order ID
  });
  
  // Or track leads:
  window.utm.track('lead', { 
    value: 500,             // Lead value estimate
    form_name: 'demo_request'
  });
</script>`;

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "copied",
      description: "tracking snippet copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-2 font-semibold heading mb-2">tracking pixel</h2>
        <p className="text-body-apple text-secondary-label">
          install the utm.one tracking pixel to capture visitor journeys and enable identity resolution
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

      {/* Real-Time Debugger */}
      <PixelDebugger />

      {/* How It Works */}
      <Card className="p-6">
        <h3 className="text-title-3 font-semibold heading mb-4">how it works</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
              <span className="text-sm font-semibold text-primary">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-label mb-1">auto-capture visitor id</p>
              <p className="text-xs text-secondary-label">
                When someone clicks your short link, utm.one automatically appends a unique visitor ID to the URL (?utm_vid=...). 
                The tracking pixel saves this to a 30-day cookie.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
              <span className="text-sm font-semibold text-primary">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-label mb-1">track every pageview</p>
              <p className="text-xs text-secondary-label">
                On every page load, the pixel sends the visitor ID + page URL + UTM parameters to utm.one. 
                This builds the complete customer journey.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
              <span className="text-sm font-semibold text-primary">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-label mb-1">identity resolution</p>
              <p className="text-xs text-secondary-label">
                When a user logs in or submits a form, call window.utm.identify(email) to link the visitor ID to their email. 
                The pixel also auto-captures form submissions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-500/10">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-label mb-1">revenue attribution</p>
              <p className="text-xs text-secondary-label">
                Call window.utm.track('purchase', &#123; value: 99.99 &#125;) on your thank you page to track revenue. 
                This enables ROI reporting across all your campaigns.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Installation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-title-3 font-semibold heading">installation snippet</h3>
          </div>
          <div className="flex items-center gap-2">
            <EmailToDeveloperModal />
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(snippetCode)}
              className="gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  copy code
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
            <code>{snippetCode}</code>
          </pre>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-secondary-label mb-2">
            <strong>Installation Instructions:</strong>
          </p>
          <ol className="text-xs text-secondary-label space-y-1 ml-4 list-decimal">
            <li>Paste the first &lt;script&gt; tag in your website's &lt;head&gt; section</li>
            <li>The pixel will auto-track all pageviews and form submissions</li>
            <li>Use window.utm.identify('email') after user login to link visitor ID to email</li>
            <li>Refresh your page - you should see tracking events in your browser console</li>
          </ol>
        </div>
      </Card>

      {/* Revenue Tracking (NEW) */}
      <Card className="p-6 border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h3 className="text-title-3 font-semibold heading">revenue tracking</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(revenueCode)}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            copy code
          </Button>
        </div>

        <p className="text-sm text-secondary-label mb-4">
          Add this code to your confirmation/thank you page to track revenue and conversions:
        </p>

        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
            <code>{revenueCode}</code>
          </pre>
        </div>

        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-xs text-green-800 dark:text-green-200">
            <strong>Pro tip:</strong> Replace <code className="bg-green-100 dark:bg-green-800/40 px-1 rounded">99.99</code> with 
            your dynamic order total variable (e.g., <code className="bg-green-100 dark:bg-green-800/40 px-1 rounded">orderData.total</code>)
          </p>
        </div>
      </Card>

      {/* No-Code Auto-Capture */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-title-3 font-semibold heading">no-code auto-capture</h3>
        </div>
        <p className="text-sm text-secondary-label mb-4">
          The tracking pixel automatically listens for form submissions and captures email addresses. 
          No additional code required.
        </p>
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs font-mono text-label">
            ✅ Auto-detects: input[type="email"]<br />
            ✅ Auto-captures: On form submit<br />
            ✅ Auto-identifies: Links visitor_id → email
          </p>
        </div>
      </Card>

      {/* Advanced Usage */}
      <Card className="p-6">
        <h3 className="text-title-3 font-semibold heading mb-4">advanced usage</h3>
        <div className="space-y-3">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs font-medium text-label mb-1">Manual Identity Resolution</p>
            <pre className="text-xs font-mono text-secondary-label">
              {`// After user logs in
window.utm.identify('user@example.com', {
  name: 'John Doe',
  plan: 'enterprise',
  signup_date: '2024-01-01'
});`}
            </pre>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs font-medium text-label mb-1">Custom Event Tracking</p>
            <pre className="text-xs font-mono text-secondary-label">
              {`// Track custom events with revenue
window.utm.track('purchase', {
  value: 149.99,
  currency: 'USD',
  product: 'Enterprise Plan'
});

// Track leads
window.utm.track('lead', {
  value: 1000,
  source: 'demo_form'
});`}
            </pre>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs font-medium text-label mb-1">Get Visitor ID</p>
            <pre className="text-xs font-mono text-secondary-label">
              {`// Access visitor ID programmatically
const visitorId = window.utm.getVisitorId();
console.log('Current visitor:', visitorId);`}
            </pre>
          </div>
        </div>
      </Card>

      {/* Verification */}
      <Card className="p-6">
        <h3 className="text-title-3 font-semibold heading mb-4">verify installation</h3>
        <div className="space-y-2 text-sm text-secondary-label">
          <p><strong>Step 1:</strong> Open your website with the tracking pixel installed</p>
          <p><strong>Step 2:</strong> Open browser DevTools (F12) → Console tab</p>
          <p><strong>Step 3:</strong> Look for <code className="bg-muted px-1 py-0.5 rounded text-xs">[utm.one] Pixel v2.0 initialized</code></p>
          <p><strong>Step 4:</strong> Test revenue tracking: <code className="bg-muted px-1 py-0.5 rounded text-xs">window.utm.track('test', &#123; value: 100 &#125;)</code></p>
          <p><strong>Step 5:</strong> Watch the debugger above - it should turn green!</p>
        </div>
      </Card>
    </div>
  );
};
