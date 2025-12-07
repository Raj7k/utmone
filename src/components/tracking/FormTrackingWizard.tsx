import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Zap, Eye, Code2, AlertTriangle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormTrackingWizardProps {
  pixelId: string;
}

export function FormTrackingWizard({ pixelId }: FormTrackingWizardProps) {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(name);
    setTimeout(() => setCopiedSnippet(null), 2000);
    toast({
      title: "Copied!",
      description: `${name} copied to clipboard.`,
    });
  };

  const manualTrackingCode = `// After form submission success
utmone.trackFormSubmit('lead', {
  form: 'signup-form',
  source: 'landing-page'
});`;

  const manualWithEmailCode = `// After form submission with email capture
utmone.trackFormSubmit('lead', {
  form: 'contact-form',
  email: userEmail,
  name: userName
});`;

  const multiStepCode = `// Track each step of a multi-step form
utmone.trackFormStep('signup', 1, 3); // Step 1 of 3
utmone.trackFormStep('signup', 2, 3); // Step 2 of 3
utmone.trackFormStep('signup', 3, 3); // Step 3 of 3

// On final completion
utmone.trackFormSubmit('lead', { form: 'signup' });`;

  const autoDetectCode = `// Enable auto-detection for forms without thank-you pages
utmone.enableAutoDetect();

// Or with custom success patterns
utmone.enableAutoDetect({
  successPatterns: [
    /success/i,
    /thank you/i,
    /confirmed/i,
    /your journey starts/i
  ],
  debounce: 1000 // ms
});`;

  const fetchInterceptCode = `// Intercept form submission responses
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const response = await originalFetch.apply(this, args);
  
  // Check if this is a form submission endpoint
  if (args[0].includes('/api/submit') && response.ok) {
    utmone.trackFormSubmit('lead', {
      form: 'ajax-form',
      endpoint: args[0]
    });
  }
  
  return response;
};`;

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-display font-semibold text-foreground">Form Conversion Tracking</h3>
        <Badge variant="secondary" className="ml-2">
          <Sparkles className="h-3 w-3 mr-1" />
          New
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Track form submissions even without thank-you page redirects. Choose the method that best fits your form implementation.
      </p>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="manual" className="text-xs">
            <Code2 className="h-3 w-3 mr-1" />
            Manual
          </TabsTrigger>
          <TabsTrigger value="auto" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Auto-Detect
          </TabsTrigger>
          <TabsTrigger value="multistep" className="text-xs">
            Multi-Step
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs">
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                Recommended
              </Badge>
              <span className="text-sm font-medium text-foreground">Most Reliable</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Add this code after your form's success handler. Works with any form type.
            </p>
            
            <div className="relative">
              <pre className="p-3 bg-muted/50 rounded-md overflow-x-auto text-xs font-mono text-foreground">
                {manualTrackingCode}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(manualTrackingCode, "Manual tracking code")}
              >
                {copiedSnippet === "Manual tracking code" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <span className="text-sm font-medium text-foreground">With Email Capture</span>
            <p className="text-xs text-muted-foreground mb-3">
              Pass email for cross-device attribution linking.
            </p>
            
            <div className="relative">
              <pre className="p-3 bg-muted/50 rounded-md overflow-x-auto text-xs font-mono text-foreground">
                {manualWithEmailCode}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(manualWithEmailCode, "Email tracking code")}
              >
                {copiedSnippet === "Email tracking code" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="auto" className="space-y-4">
          <div className="p-4 bg-amber-500/5 rounded-lg border border-amber-500/10">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-foreground">Auto-Detection Mode</span>
                <p className="text-xs text-muted-foreground">
                  Automatically detects success messages like "Thank you" or "Submitted" appearing on the page.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <pre className="p-3 bg-muted/50 rounded-md overflow-x-auto text-xs font-mono text-foreground">
              {autoDetectCode}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(autoDetectCode, "Auto-detect code")}
            >
              {copiedSnippet === "Auto-detect code" ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>

          <div className="p-3 bg-muted/30 rounded-md">
            <p className="text-xs text-muted-foreground">
              <strong>Default patterns detected:</strong> "success", "thank you", "confirmed", "submitted", "complete", "received", "we'll be in touch", "journey starts"
            </p>
          </div>
        </TabsContent>

        <TabsContent value="multistep" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Track progress through multi-step forms to see where users drop off.
          </p>
          
          <div className="relative">
            <pre className="p-3 bg-muted/50 rounded-md overflow-x-auto text-xs font-mono text-foreground">
              {multiStepCode}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(multiStepCode, "Multi-step code")}
            >
              {copiedSnippet === "Multi-step code" ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>

          <div className="p-3 bg-primary/5 rounded-md border border-primary/10">
            <p className="text-xs text-muted-foreground">
              <strong>Tip:</strong> This is perfect for forms like Keka's signup flow where users complete multiple steps before seeing a success message.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Intercept AJAX/fetch requests to detect successful form submissions at the network level.
          </p>
          
          <div className="relative">
            <pre className="p-3 bg-muted/50 rounded-md overflow-x-auto text-xs font-mono text-foreground">
              {fetchInterceptCode}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(fetchInterceptCode, "Fetch intercept code")}
            >
              {copiedSnippet === "Fetch intercept code" ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>

          <div className="p-3 bg-muted/30 rounded-md">
            <p className="text-xs text-muted-foreground">
              <strong>URL-based detection:</strong> The pixel automatically detects success when URLs contain <code className="font-mono">?success=true</code>, <code className="font-mono">#thank-you</code>, or paths like <code className="font-mono">/confirmation</code>.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
