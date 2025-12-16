import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, ShoppingCart, FileText, UserPlus, Target,
  Copy, Check, ChevronRight, ChevronLeft, Calculator,
  Lightbulb, HelpCircle, ArrowRight, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notify";
import { RevenueValueCalculator } from "./RevenueValueCalculator";

interface RevenueTrackingWizardProps {
  pixelId: string;
  supabaseUrl: string;
}

type TrackingType = 'purchase' | 'lead' | 'signup' | 'custom';
type ValueType = 'dynamic' | 'fixed' | 'calculate';
type Platform = 'html' | 'shopify' | 'wordpress' | 'react';

const trackingTypes = [
  { type: 'purchase' as TrackingType, icon: ShoppingCart, label: 'Online Purchase', description: 'E-commerce, checkout, payment', color: 'text-green-600 bg-green-500/10' },
  { type: 'lead' as TrackingType, icon: FileText, label: 'Form Submission', description: 'Contact form, demo request', color: 'text-blue-600 bg-blue-500/10' },
  { type: 'signup' as TrackingType, icon: UserPlus, label: 'Account Signup', description: 'Registration, trial start', color: 'text-purple-600 bg-purple-500/10' },
  { type: 'custom' as TrackingType, icon: Target, label: 'Custom Goal', description: 'Download, video, button click', color: 'text-slate-600 bg-slate-500/10' },
];

export function RevenueTrackingWizard({ pixelId, supabaseUrl }: RevenueTrackingWizardProps) {
  const [step, setStep] = useState(1);
  const [trackingType, setTrackingType] = useState<TrackingType | null>(null);
  const [valueType, setValueType] = useState<ValueType | null>(null);
  const [fixedValue, setFixedValue] = useState<string>("");
  const [platform, setPlatform] = useState<Platform>('html');
  const [copied, setCopied] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const getEventName = () => {
    switch (trackingType) {
      case 'purchase': return 'purchase';
      case 'lead': return 'lead';
      case 'signup': return 'signup';
      default: return 'conversion';
    }
  };

  const getRevenueValue = () => {
    if (valueType === 'fixed' || valueType === 'calculate') {
      return fixedValue || '0';
    }
    // Dynamic placeholders by platform
    switch (platform) {
      case 'shopify': return '{{ total_price | money_without_currency }}';
      case 'wordpress': return '<?php echo $order->get_total(); ?>';
      case 'react': return 'order.total';
      default: return 'YOUR_ORDER_TOTAL';
    }
  };

  const generateCode = () => {
    const eventName = getEventName();
    const revenueValue = getRevenueValue();
    const isDynamic = valueType === 'dynamic';

    if (platform === 'shopify') {
      return `{% if first_time_accessed %}
<script>
  // Track ${trackingType === 'purchase' ? 'purchase' : 'conversion'} - runs once on thank-you page
  utmone('track', '${eventName}', { 
    revenue: ${isDynamic ? revenueValue : revenueValue} 
  });
  
  // Link visitor to customer email
  utmone('identify', '{{ customer.email }}', '{{ customer.name }}');
</script>
{% endif %}`;
    }

    if (platform === 'wordpress') {
      const phpValue = isDynamic ? revenueValue : revenueValue;
      return `<?php if (is_order_received_page()): ?>
<script>
  // Track ${trackingType === 'purchase' ? 'purchase' : 'conversion'}
  utmone('track', '${eventName}', { 
    revenue: ${phpValue} 
  });
</script>
<?php endif; ?>`;
    }

    if (platform === 'react') {
      const jsValue = isDynamic ? revenueValue : revenueValue;
      return `// After successful ${trackingType === 'purchase' ? 'payment' : 'form submission'}
window.utmone('track', '${eventName}', { 
  revenue: ${jsValue} 
});

// Optional: Link visitor to user email
window.utmone('identify', user.email, user.name);`;
    }

    // HTML/Generic
    return `<script>
  // Add this to your thank-you/confirmation page
  utmone('track', '${eventName}', { 
    revenue: ${isDynamic ? revenueValue : revenueValue} 
  });
</script>`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    notify.success("copied!", { description: "Code copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleValueCalculated = (value: number) => {
    setFixedValue(value.toString());
    setValueType('calculate');
    setShowCalculator(false);
  };

  const resetWizard = () => {
    setStep(1);
    setTrackingType(null);
    setValueType(null);
    setFixedValue("");
    setShowCalculator(false);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-display font-semibold text-foreground">revenue tracking wizard</h3>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            Easy Setup
          </Badge>
        </div>
        {step > 1 && (
          <Button variant="ghost" size="sm" onClick={resetWizard}>
            start over
          </Button>
        )}
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {s}
            </div>
            {s < 3 && <div className={cn("w-12 h-0.5", step > s ? "bg-primary" : "bg-muted")} />}
          </div>
        ))}
      </div>

      {/* Step 1: What are you tracking? */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">what are you tracking?</h4>
            <p className="text-xs text-muted-foreground">choose the type of conversion you want to measure</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trackingTypes.map(({ type, icon: Icon, label, description, color }) => (
              <Card
                key={type}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:shadow-md border-2",
                  trackingType === type 
                    ? "border-primary ring-2 ring-primary/20" 
                    : "border-transparent hover:border-muted-foreground/20"
                )}
                onClick={() => setTrackingType(type)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button 
            className="w-full" 
            onClick={() => setStep(2)}
            disabled={!trackingType}
          >
            continue
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 2: What's the value? */}
      {step === 2 && (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="mb-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            back
          </Button>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">
              {trackingType === 'purchase' 
                ? "how do you get the order total?" 
                : trackingType === 'lead'
                ? "what's a lead worth to you?"
                : "what value should we track?"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {trackingType === 'purchase'
                ? "we'll help you get the exact order amount"
                : "this helps calculate your marketing ROI"}
            </p>
          </div>

          <div className="space-y-3">
            {trackingType === 'purchase' && (
              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all border-2",
                  valueType === 'dynamic' ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/20"
                )}
                onClick={() => { setValueType('dynamic'); setShowCalculator(false); }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">I can get the order total from my checkout</p>
                    <p className="text-xs text-muted-foreground">Recommended - tracks the exact amount of each order</p>
                  </div>
                </div>
              </Card>
            )}

            <Card
              className={cn(
                "p-4 cursor-pointer transition-all border-2",
                valueType === 'fixed' ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/20"
              )}
              onClick={() => { setValueType('fixed'); setShowCalculator(false); }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">
                    {trackingType === 'purchase' ? "I'll use a fixed average value" : "I know my value"}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {trackingType === 'purchase' 
                      ? "Use your average order value for all purchases"
                      : trackingType === 'lead'
                      ? "Enter your estimated deal size or lead value"
                      : "Enter a fixed value for this conversion"}
                  </p>
                  {valueType === 'fixed' && (
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground">Value:</Label>
                      <div className="relative flex-1 max-w-[150px]">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                        <Input
                          type="number"
                          value={fixedValue}
                          onChange={(e) => setFixedValue(e.target.value)}
                          className="pl-7 h-8"
                          placeholder="99.99"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {(trackingType === 'lead' || trackingType === 'signup') && (
              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all border-2",
                  showCalculator ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/20"
                )}
                onClick={() => { setShowCalculator(true); setValueType(null); }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                    <Calculator className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">I don't know my value - help me calculate</p>
                    <p className="text-xs text-muted-foreground">We'll estimate based on your conversion rate and average sale</p>
                  </div>
                </div>
              </Card>
            )}

            <Card
              className={cn(
                "p-4 cursor-pointer transition-all border-2",
                valueType === 'calculate' && !showCalculator ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/20"
              )}
              onClick={() => { setValueType('calculate'); setFixedValue('0'); setShowCalculator(false); }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-500/10 text-slate-600">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Just count conversions (no dollar value)</p>
                  <p className="text-xs text-muted-foreground">Track as $0 - you can add value later</p>
                </div>
              </div>
            </Card>
          </div>

          {showCalculator && (
            <RevenueValueCalculator 
              onValueCalculated={handleValueCalculated}
              initialValue={parseFloat(fixedValue) || undefined}
            />
          )}

          <Button 
            className="w-full" 
            onClick={() => setStep(3)}
            disabled={!valueType && !showCalculator}
          >
            generate my code
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 3: Generated Code */}
      {step === 3 && (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="mb-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            back
          </Button>

          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-foreground">your tracking code is ready!</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {valueType === 'dynamic' 
                ? `Add this code to your thank-you page. It will track each ${trackingType} with the actual order amount.`
                : fixedValue && parseFloat(fixedValue) > 0
                ? `Add this code to your thank-you page. Each ${trackingType === 'lead' ? 'form submission' : trackingType} will be tracked as $${fixedValue}.`
                : `Add this code to track ${trackingType === 'lead' ? 'form submissions' : trackingType + 's'} without a dollar value.`}
            </p>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">choose your platform:</Label>
            <Tabs value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="shopify">Shopify</TabsTrigger>
                <TabsTrigger value="wordpress">WordPress</TabsTrigger>
                <TabsTrigger value="react">React</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-48">
              <code>{generateCode()}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={copyCode}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {/* Platform-specific help */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                {platform === 'shopify' && (
                  <p>Paste in <strong>Shopify Admin → Settings → Checkout → Additional scripts</strong> or in your theme's <strong>order confirmation</strong> template.</p>
                )}
                {platform === 'wordpress' && (
                  <p>For WooCommerce: paste in your theme's <strong>thankyou.php</strong> template, or use a plugin like <strong>Insert Headers and Footers</strong>.</p>
                )}
                {platform === 'react' && (
                  <p>Call this after your payment succeeds (in the success callback of your payment processor like Stripe).</p>
                )}
                {platform === 'html' && (
                  <p>Paste this code on your thank-you/confirmation page, after the base utm.one pixel loads.</p>
                )}
              </div>
            </div>
          </div>

          {valueType === 'dynamic' && (
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Important:</strong> Replace <code className="font-mono bg-amber-500/20 px-1 rounded">YOUR_ORDER_TOTAL</code> with your platform's variable for the order amount.
              </p>
            </div>
          )}

          <Button className="w-full" variant="outline" onClick={resetWizard}>
            set up another conversion
          </Button>
        </div>
      )}
    </Card>
  );
}
