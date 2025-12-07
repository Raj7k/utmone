import { useState } from "react";
import { Mail, Send, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";

export const EmailToDeveloperModal = () => {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspaceContext();
  const [isOpen, setIsOpen] = useState(false);
  const [developerEmail, setDeveloperEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const workspaceName = currentWorkspace?.name || "utm.one";
  const pixelUrl = `${window.location.origin}/tracker.js?v=2.0`;
  
  const emailSubject = `Setup Tracking for ${workspaceName} (Urgent)`;
  
  const emailBody = `Hi team,

Please add this tracking snippet to the <head> of our website to enable ROI tracking and attribution:

<!-- utm.one Tracking Pixel -->
<script src="${pixelUrl}" async></script>

After installation, trigger this on conversion pages (e.g., Thank You page):

<script>
  // Track purchase/conversion with revenue
  window.utm.track('purchase', { 
    value: TOTAL_AMOUNT,  // Replace with actual order value
    currency: 'USD',
    order_id: 'ORDER_123' // Optional: your order ID
  });
</script>

Optional: Add identity tracking when users log in or submit forms:

<script>
  window.utm.identify('user@example.com', {
    name: 'Customer Name',
    plan: 'pro'
  });
</script>

To verify installation:
1. Open browser DevTools (F12) → Network tab
2. Look for requests to "tracker.js"
3. Check Console for "[utm.one] Pixel v2.0 initialized"

Let me know once it's deployed!

Thanks,
${currentWorkspace?.name || 'The Team'}`;

  const handleSendEmail = () => {
    if (!developerEmail || !developerEmail.includes('@')) {
      toast({
        title: "invalid email",
        description: "please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Open mailto link
    const mailtoLink = `mailto:${developerEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');

    toast({
      title: "email client opened",
      description: "your email client should open with the pre-filled message",
    });
    
    setIsOpen(false);
    setDeveloperEmail("");
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    toast({
      title: "copied",
      description: "email content copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Mail className="h-4 w-4" />
          email to developer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="heading">send to developer</DialogTitle>
          <DialogDescription>
            send installation instructions to your engineering team
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dev-email">developer's email</Label>
            <Input
              id="dev-email"
              type="email"
              placeholder="developer@company.com"
              value={developerEmail}
              onChange={(e) => setDeveloperEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>email preview</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopyEmail}
                className="h-7 gap-1 text-xs"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-muted p-3 rounded-lg max-h-48 overflow-y-auto">
              <p className="text-xs font-medium mb-2">Subject: {emailSubject}</p>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                {emailBody.slice(0, 500)}...
              </pre>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            cancel
          </Button>
          <Button onClick={handleSendEmail} className="gap-2">
            <Send className="h-4 w-4" />
            send email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
