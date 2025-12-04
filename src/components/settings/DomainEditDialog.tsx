import { useState } from "react";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useVerifyDomain } from "@/hooks/useVerifyDomain";
import { Loader2, Copy, Check, CheckCircle2, HelpCircle, AlertCircle, ChevronDown, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface DomainEditDialogProps {
  domain: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DomainEditDialog({ domain, open, onOpenChange }: DomainEditDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const verifyDomainMutation = useVerifyDomain();
  const [isLoading, setIsLoading] = useState(false);
  const [copiedFields, setCopiedFields] = useState({
    txtName: false,
    txtNameFull: false,
    txtValue: false,
    cnameName: false,
    cnameValue: false,
    subdomainCname: false,
    subdomainCname2: false,
    nginxProxy: false,
    apacheProxy: false,
    cloudflareTransform: false,
    vercelRewrite: false,
  });
  const [dnsOpen, setDnsOpen] = useState(!domain?.is_verified); // Open by default for unverified
  const [routingOption, setRoutingOption] = useState<'subdomain' | 'cloudflare' | 'proxy' | null>(null);
  const [cloudflareGuideOpen, setCloudflareGuideOpen] = useState(false);
  const [proxyExamplesOpen, setProxyExamplesOpen] = useState(false);
  const [subdomainPrefix, setSubdomainPrefix] = useState("go");

  // Parse existing domain_settings or use defaults
  const settings = domain?.domain_settings || {};
  const [pathPrefix, setPathPrefix] = useState(settings.path_prefix || "");
  const [fallbackUrl, setFallbackUrl] = useState(settings.fallback_url || "");
  const [redirectType, setRedirectType] = useState(settings.redirect_type || "302");
  const [defaultUtmSource, setDefaultUtmSource] = useState(settings.default_utm_source || "");
  const [defaultUtmMedium, setDefaultUtmMedium] = useState(settings.default_utm_medium || "");
  const [defaultUtmCampaign, setDefaultUtmCampaign] = useState(settings.default_utm_campaign || "");

  const isVerified = domain?.is_verified;
  const verificationCode = domain?.verification_code;

  const handleCopy = async (text: string, type: keyof typeof copiedFields) => {
    await navigator.clipboard.writeText(text);
    setCopiedFields(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopiedFields(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  const handleVerify = () => {
    verifyDomainMutation.mutate(domain.id);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedSettings = {
        path_prefix: pathPrefix.trim(),
        fallback_url: fallbackUrl.trim(),
        redirect_type: redirectType,
        default_utm_source: defaultUtmSource.trim(),
        default_utm_medium: defaultUtmMedium.trim(),
        default_utm_campaign: defaultUtmCampaign.trim(),
      };

      const { error } = await supabase
        .from("domains")
        .update({ domain_settings: updatedSettings })
        .eq("id", domain.id);

      if (error) throw error;

      toast({
        title: "Domain updated",
        description: "Your domain settings have been saved.",
      });

      queryClient.invalidateQueries({ queryKey: ["workspace-domains"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>edit domain settings</DialogTitle>
          <DialogDescription>
            configure advanced settings for {domain?.domain}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* DNS Verification Section - Always show with collapsible */}
          <div className="space-y-3">
            {/* Verification Status Badge */}
            <div className={`flex items-center gap-2 p-3 border rounded-lg ${
              isVerified 
                ? 'border-green-500/20 bg-green-500/10' 
                : 'border-destructive/20 bg-destructive/10'
            }`}>
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">domain verified ✓</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">domain not verified</span>
                </>
              )}
            </div>

            {/* Collapsible DNS Records */}
            <Collapsible open={dnsOpen} onOpenChange={setDnsOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-between p-3 h-auto hover:bg-muted/50"
                >
                  <span className="text-sm font-medium">
                    {isVerified ? 'view dns records' : 'dns setup instructions'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dnsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-4 pt-3">
                <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
                  {!isVerified && (
                    <p className="text-sm text-muted-foreground">
                      add these DNS records to your domain registrar to verify ownership:
                    </p>
                  )}
                  {isVerified && (
                    <p className="text-sm text-muted-foreground">
                      these are your current DNS records. save them for reference or troubleshooting.
                    </p>
                  )}

                  {/* TXT Record */}
                  <div className="space-y-3">
                    <Label className="text-xs font-semibold uppercase tracking-wide">TXT Record</Label>
                    
                    {/* Provider-specific guidance */}
                    <div className="rounded-md bg-muted/50 p-3 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        <strong>For most DNS providers</strong> (GoDaddy, Cloudflare, Namecheap, etc.):
                      </p>
                      <div className="flex items-center gap-2">
                        <Input 
                          value="_utm-verification" 
                          readOnly 
                          className="font-mono text-xs bg-background"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy('_utm-verification', 'txtName')}
                        >
                          {copiedFields.txtName ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        Enter just <code className="bg-background px-1 rounded">_utm-verification</code> - your provider will automatically append <code className="bg-background px-1 rounded">.{domain?.domain}</code>
                      </p>
                    </div>

                    {/* Advanced users / Route53 */}
                    <Collapsible>
                      <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        Advanced: Full FQDN for Route53/Advanced DNS <ChevronDown className="h-3 w-3" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <div className="flex items-center gap-2">
                          <Input 
                            value={`_utm-verification.${domain?.domain}`} 
                            readOnly 
                            className="font-mono text-xs"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(`_utm-verification.${domain?.domain}`, 'txtNameFull')}
                          >
                            {copiedFields.txtNameFull ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Only use this format if your DNS provider requires full FQDN (like AWS Route53)
                        </p>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* TXT Value */}
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Value</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={verificationCode || ''} 
                          readOnly 
                          className="font-mono text-xs"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(verificationCode || '', 'txtValue')}
                        >
                          {copiedFields.txtValue ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* CNAME Record */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide">CNAME Record (optional)</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Label className="text-xs text-muted-foreground">Name</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              value="@"
                              readOnly
                              className="font-mono text-xs"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopy("@", 'cnameName')}
                            >
                              {copiedFields.cnameName ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Label className="text-xs text-muted-foreground">Value</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              value="go.utm.one"
                              readOnly
                              className="font-mono text-xs"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopy("go.utm.one", 'cnameValue')}
                            >
                              {copiedFields.cnameValue ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Troubleshooting Section */}
                  <div className="rounded-md border border-muted bg-muted/20 p-3 space-y-2">
                    <p className="text-xs font-medium">Troubleshooting</p>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>DNS changes can take 24-72 hours to propagate globally</li>
                      <li>Check propagation status at <a href="https://dnschecker.org" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'rgba(59,130,246,1)' }}>dnschecker.org</a></li>
                      <li>Common mistake: entering <code className="bg-background px-1 rounded">_utm-verification.{domain?.domain}</code> creates <code className="bg-background px-1 rounded">_utm-verification.{domain?.domain}.{domain?.domain}</code></li>
                    </ul>
                  </div>

                  {!isVerified && (
                    <Button
                      onClick={handleVerify}
                      disabled={verifyDomainMutation.isPending}
                      className="w-full"
                    >
                      {verifyDomainMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      verify domain
                    </Button>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Step 2: Traffic Routing Configuration */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex items-start gap-3 mb-4">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                domain?.is_verified 
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" 
                  : "bg-muted text-muted-foreground"
              )}>
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  configure traffic routing
                  {domain?.is_verified && (
                    <span className="ml-2 text-sm font-normal text-orange-600 dark:text-orange-400">
                      ⚠️ required for links to work
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {domain?.is_verified 
                    ? "domain verified! choose how to route traffic to your short links."
                    : "complete step 1 first, then configure routing."}
                </p>
              </div>
            </div>

            {domain?.is_verified && (
              <div className="ml-11 space-y-4">
                <Alert className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-sm">
                    <strong>not ready for custom domain setup?</strong> use <code className="bg-background px-1 py-0.5 rounded text-xs font-mono">utm.click</code> or <code className="bg-background px-1 py-0.5 rounded text-xs font-mono">go.utm.one</code> for now - they work immediately with zero configuration.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground mb-2">
                    choose your setup method:
                  </div>

                  {/* Option 1: Subdomain (Easiest) */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setRoutingOption(routingOption === 'subdomain' ? null : 'subdomain')}
                      className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-foreground">option 1: subdomain</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
                              🏆 easiest • recommended for marketers
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            create a subdomain like <code className="bg-muted px-1 py-0.5 rounded">go.{domain?.domain}</code> and point it to utm.click or go.utm.one
                          </p>
                        </div>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-2",
                          routingOption === 'subdomain' && "rotate-180"
                        )} />
                      </div>
                    </button>

                    {routingOption === 'subdomain' && (
                      <div className="p-4 pt-0 space-y-3">
                        <div className="rounded-md bg-muted/30 p-3 space-y-3">
                          <p className="text-xs text-muted-foreground">
                            <strong>why this works:</strong> CNAME to utm.click or go.utm.one works because Cloudflare automatically handles SSL for both domains
                          </p>
                          <p className="text-xs text-foreground font-medium">
                            ✓ no server setup • works in minutes • perfect for non-technical users
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">1. choose your subdomain prefix</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={subdomainPrefix}
                              onChange={(e) => setSubdomainPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                              placeholder="go"
                              className="flex-none w-24 font-mono text-sm"
                            />
                            <span className="text-sm text-muted-foreground">.</span>
                            <div className="flex-1 px-3 py-2 rounded-md bg-muted/50 text-sm font-mono">
                              {domain?.domain}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            popular choices: go, links, l, track
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">2. add this CNAME record to your DNS</Label>
                          <div className="rounded-lg border border-border bg-card p-3 space-y-3">
                            <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground">
                              <div>type</div>
                              <div>name</div>
                              <div>value (choose one)</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="px-2 py-1.5 rounded bg-muted/50 text-xs font-mono">CNAME</div>
                              <div className="px-2 py-1.5 rounded bg-muted/50 text-xs font-mono">{subdomainPrefix}</div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                  <div className="flex-1 px-2 py-1.5 rounded bg-muted/50 text-xs font-mono">utm.click</div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopy('utm.click', 'subdomainCname')}
                                    className="h-7 w-7 p-0"
                                  >
                                    {copiedFields.subdomainCname ? (
                                      <Check className="h-3 w-3 text-green-600" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                                <div className="text-xs text-muted-foreground text-center">or</div>
                                <div className="flex items-center gap-1">
                                  <div className="flex-1 px-2 py-1.5 rounded bg-muted/50 text-xs font-mono">go.utm.one</div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopy('go.utm.one', 'subdomainCname2')}
                                    className="h-7 w-7 p-0"
                                  >
                                    {copiedFields.subdomainCname2 ? (
                                      <Check className="h-3 w-3 text-green-600" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            💡 changes typically propagate in 5-30 minutes
                          </p>
                        </div>

                        <Alert className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-xs">
                            <strong>your links will work at:</strong> <code className="bg-background px-1 py-0.5 rounded font-mono">{subdomainPrefix}.{domain?.domain}/slug</code>
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Root Domain via Cloudflare */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setRoutingOption(routingOption === 'cloudflare' ? null : 'cloudflare')}
                      className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-foreground">option 2: root domain via cloudflare</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 font-medium">
                              ⚠️ advanced • requires cloudflare account
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            for using <code className="bg-muted px-1 py-0.5 rounded">{domain?.domain}</code> directly (no subdomain) • requires DNS transfer to Cloudflare
                          </p>
                        </div>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-2",
                          routingOption === 'cloudflare' && "rotate-180"
                        )} />
                      </div>
                    </button>

                    {routingOption === 'cloudflare' && (
                      <div className="p-4 pt-0 space-y-4">
                        <Alert className="bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <AlertDescription className="text-xs">
                            <strong>requirements:</strong> free Cloudflare account • DNS nameserver change at your registrar • 24-48hr DNS propagation
                          </AlertDescription>
                        </Alert>

                        <Collapsible open={cloudflareGuideOpen} onOpenChange={setCloudflareGuideOpen}>
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                              <span className="text-xs">step-by-step cloudflare setup guide</span>
                              <ChevronDown className={cn(
                                "w-3 h-3 ml-2 transition-transform",
                                cloudflareGuideOpen && "rotate-180"
                              )} />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3 space-y-4">
                            <div className="space-y-3">
                              {[
                                {
                                  step: "1. create cloudflare account",
                                  description: "sign up at cloudflare.com (free plan works)",
                                  link: "https://dash.cloudflare.com/sign-up"
                                },
                                {
                                  step: "2. add your domain to cloudflare",
                                  description: "click 'Add a Site' → enter your domain → select Free plan",
                                  link: null
                                },
                                {
                                  step: "3. update nameservers at your registrar",
                                  description: "cloudflare will show you 2 nameservers. go to your domain registrar (godaddy, namecheap, etc.) and replace existing nameservers with cloudflare's.",
                                  providers: [
                                    { name: "GoDaddy", hint: "DNS Management → Nameservers → Change → Custom" },
                                    { name: "Namecheap", hint: "Domain List → Manage → Nameservers → Custom DNS" },
                                    { name: "Google Domains", hint: "DNS → Name servers → Use custom name servers" },
                                    { name: "Route53", hint: "Registered domains → Update name servers" }
                                  ]
                                },
                                {
                                  step: "4. wait for dns propagation",
                                  description: "cloudflare will verify nameserver change (5min - 48hrs). you'll get an email when active.",
                                  link: null
                                },
                                {
                                  step: "5. create worker route",
                                  description: "in cloudflare dashboard: Workers & Pages → Create Worker → paste code below → Deploy → add route: yourdomain.com/*",
                                  code: `// Cloudflare Worker for ${domain?.domain}
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetUrl = \`https://go.utm.one\${url.pathname}\${url.search}\`;
    
    return fetch(targetUrl, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        'X-Original-Host': url.hostname,
      },
      redirect: 'manual'
    });
  }
}`
                                },
                                {
                                  step: "6. configure ssl",
                                  description: "SSL/TLS → Overview → set to 'Full' mode (not Flexible, not Strict)",
                                  link: null
                                }
                              ].map((item, idx) => (
                                <div key={idx} className="rounded-lg border border-border bg-card p-3 space-y-2">
                                  <div className="font-medium text-sm text-foreground">{item.step}</div>
                                  <p className="text-xs text-muted-foreground">{item.description}</p>
                                  {item.link && (
                                    <a 
                                      href={item.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs hover:underline inline-flex items-center gap-1" style={{ color: 'rgba(59,130,246,1)' }}
                                    >
                                      open cloudflare →
                                    </a>
                                  )}
                                  {item.providers && (
                                    <div className="mt-2 space-y-1">
                                      {item.providers.map((provider, pidx) => (
                                        <div key={pidx} className="text-xs">
                                          <span className="font-medium">{provider.name}:</span> <span className="text-muted-foreground">{provider.hint}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {item.code && (
                                    <div className="relative">
                                      <pre className="text-xs bg-muted/50 p-3 rounded overflow-x-auto">
                                        <code>{item.code}</code>
                                      </pre>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCopy(item.code, 'nginxProxy')}
                                        className="absolute top-2 right-2 h-6 w-6 p-0"
                                      >
                                        {copiedFields.nginxProxy ? (
                                          <Check className="h-3 w-3 text-green-600" />
                                        ) : (
                                          <Copy className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>

                        <Alert className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900">
                          <Info className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-xs">
                            <strong>estimated time:</strong> 30-60 minutes (mostly waiting for DNS propagation)
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>

                  {/* Option 3: Reverse Proxy */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setRoutingOption(routingOption === 'proxy' ? null : 'proxy')}
                      className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-foreground">option 3: reverse proxy</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-medium">
                              🔧 for technical teams • requires server access
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            if you already have a website with SSL, configure your server to proxy requests to go.utm.one
                          </p>
                        </div>
                        <ChevronDown className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-2",
                          routingOption === 'proxy' && "rotate-180"
                        )} />
                      </div>
                    </button>

                    {routingOption === 'proxy' && (
                      <div className="p-4 pt-0 space-y-3">
                        <div className="rounded-md bg-muted/30 p-3">
                          <p className="text-xs text-foreground">
                            <strong>how it works:</strong> your existing SSL certificate handles encryption, your server forwards short link requests to go.utm.one
                          </p>
                        </div>

                        <Collapsible open={proxyExamplesOpen} onOpenChange={setProxyExamplesOpen}>
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                              <span className="text-xs">view configuration examples</span>
                              <ChevronDown className={cn(
                                "w-3 h-3 ml-2 transition-transform",
                                proxyExamplesOpen && "rotate-180"
                              )} />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3 space-y-3">
                            {[
                              {
                                name: "nginx",
                                code: `# Add to your nginx config
location / {
    proxy_pass https://go.utm.one;
    proxy_set_header Host go.utm.one;
    proxy_set_header X-Original-Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_redirect off;
}`,
                                copyKey: 'nginxProxy' as const
                              },
                              {
                                name: "Apache",
                                code: `# Add to your .htaccess or Apache config
<IfModule mod_proxy.c>
    ProxyPreserveHost Off
    ProxyPass / https://go.utm.one/
    ProxyPassReverse / https://go.utm.one/
    RequestHeader set X-Original-Host "${domain?.domain}"
</IfModule>`,
                                copyKey: 'apacheProxy' as const
                              },
                              {
                                name: "Cloudflare Transform Rules",
                                code: `# Cloudflare Dashboard → Rules → Transform Rules
# Create HTTP Request Header Modification
When: hostname equals "${domain?.domain}"
Then: Set dynamic header "Host" = "go.utm.one"
      Set static header "X-Original-Host" = "${domain?.domain}"
      
# Then create a Redirect Rule
When: hostname equals "${domain?.domain}"
Then: Dynamic URL Redirect to concat("https://go.utm.one", http.request.uri.path)`,
                                copyKey: 'cloudflareTransform' as const
                              },
                              {
                                name: "Vercel",
                                code: `// vercel.json
{
  "rewrites": [
    {
      "source": "/:slug",
      "destination": "https://go.utm.one/:slug",
      "headers": {
        "X-Original-Host": "${domain?.domain}"
      }
    }
  ]
}`,
                                copyKey: 'vercelRewrite' as const
                              }
                            ].map((example, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="text-xs font-medium text-foreground">{example.name}</div>
                                <div className="relative">
                                  <pre className="text-xs bg-muted/50 p-3 rounded overflow-x-auto">
                                    <code>{example.code}</code>
                                  </pre>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopy(example.code, example.copyKey)}
                                    className="absolute top-2 right-2 h-6 w-6 p-0"
                                  >
                                    {copiedFields[example.copyKey] ? (
                                      <Check className="h-3 w-3 text-green-600" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>

                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            <strong>important:</strong> make sure to pass the <code className="bg-background px-1 py-0.5 rounded font-mono">X-Original-Host</code> header so our system knows which domain the request came from
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                </div>

                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>note:</strong> dns propagation can take 5 minutes to 72 hours depending on your provider and configuration method
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Path Prefix */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="pathPrefix">path prefix (optional)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      adds a path segment before the slug. useful for organizing links by category or team.
                      example: domain.com/go/slug or domain.com/team/slug
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="pathPrefix"
              placeholder="e.g., /go/ or /u/"
              value={pathPrefix}
              onChange={(e) => setPathPrefix(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              adds a path before the slug. example: domain.com/go/slug
            </p>
          </div>

          {/* Fallback URL */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="fallbackUrl">fallback url (optional)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      when someone visits a short link that doesn't exist (404), redirect them here instead.
                      great for sending users to your homepage or a custom 404 page instead of showing an error.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="fallbackUrl"
              placeholder="https://yourdomain.com"
              value={fallbackUrl}
              onChange={(e) => setFallbackUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              where to redirect when a short link doesn't exist
            </p>
          </div>

          {/* Redirect Type */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="redirectType">redirect type</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      <strong>302 (temporary):</strong> recommended for most cases. allows analytics tracking and lets you change destinations later.
                      <br/><br/>
                      <strong>301 (permanent):</strong> better for SEO if the destination never changes. browsers cache it, so analytics may be incomplete.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={redirectType} onValueChange={setRedirectType}>
              <SelectTrigger id="redirectType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="302">302 (temporary)</SelectItem>
                <SelectItem value="301">301 (permanent)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              301 is cached by browsers, 302 allows tracking changes
            </p>
          </div>

          {/* Default UTM Parameters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-base">default utm parameters (optional)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">
                      set default UTM values for this domain. they'll automatically pre-fill when creating new links,
                      saving time and ensuring consistency across your team's campaigns.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground">
              these values will be pre-filled when creating links with this domain
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultUtmSource">utm_source</Label>
                <Input
                  id="defaultUtmSource"
                  placeholder="e.g., newsletter"
                  value={defaultUtmSource}
                  onChange={(e) => setDefaultUtmSource(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultUtmMedium">utm_medium</Label>
                <Input
                  id="defaultUtmMedium"
                  placeholder="e.g., email"
                  value={defaultUtmMedium}
                  onChange={(e) => setDefaultUtmMedium(e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="defaultUtmCampaign">utm_campaign</Label>
                <Input
                  id="defaultUtmCampaign"
                  placeholder="e.g., spring-sale-2025"
                  value={defaultUtmCampaign}
                  onChange={(e) => setDefaultUtmCampaign(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
