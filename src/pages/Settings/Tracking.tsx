import { useState } from "react";
import { Copy, CheckCircle2, Code, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippetCode);
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

      {/* How It Works */}
      <Card className="p-6">
        <h3 className="text-title-3 font-semibold heading mb-4">how it works</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
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
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
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
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
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
        </div>
      </Card>

      {/* Installation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-title-3 font-semibold heading">installation snippet</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
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
              {`// Track custom events
window.utm.track('button_clicked', {
  button_id: 'cta-hero',
  location: 'homepage'
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
          <p><strong>Step 2:</strong> Open browser DevTools (F12) → Network tab</p>
          <p><strong>Step 3:</strong> Look for requests to <code className="bg-muted px-1 py-0.5 rounded text-xs">tracker.js</code></p>
          <p><strong>Step 4:</strong> Navigate to another page - you should see tracking requests</p>
          <p><strong>Step 5:</strong> Check Application → Cookies → Look for <code className="bg-muted px-1 py-0.5 rounded text-xs">utm_vid</code> cookie</p>
        </div>
      </Card>
    </div>
  );
};
