import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Loader2, AlertCircle, Globe, ArrowRight, ArrowLeft, CheckCircle2, RefreshCw, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { requireUserId } from "@/lib/getCachedUser";
import { notify } from "@/lib/notify";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DomainSetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  onDomainAdded?: (domain: string) => void;
}

const STEPS = [
  { id: 1, title: "enter domain", description: "your custom domain" },
  { id: 2, title: "verify ownership", description: "add txt record" },
  { id: 3, title: "route traffic", description: "add cname record" },
  { id: 4, title: "complete", description: "you're all set" },
];

const DNS_PROVIDERS = [
  { id: "godaddy", name: "GoDaddy" },
  { id: "cloudflare", name: "Cloudflare" },
  { id: "namecheap", name: "Namecheap" },
  { id: "route53", name: "AWS Route 53" },
  { id: "other", name: "Other" },
];

export const DomainSetupWizard = ({
  open,
  onOpenChange,
  workspaceId,
  onDomainAdded,
}: DomainSetupWizardProps) => {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [domain, setDomain] = useState("");
  const [domainError, setDomainError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "checking" | "success" | "failed">("idle");
  const [selectedProvider, setSelectedProvider] = useState("godaddy");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [domainId, setDomainId] = useState<string | null>(null);

  const resetWizard = () => {
    setCurrentStep(1);
    setDomain("");
    setDomainError(null);
    setVerificationCode("");
    setIsCreating(false);
    setIsVerifying(false);
    setVerificationStatus("idle");
    setDomainId(null);
  };

  const handleClose = () => {
    resetWizard();
    onOpenChange(false);
  };

  const validateDomain = (value: string): boolean => {
    // Remove protocol if present
    const cleaned = value.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    
    // Basic domain validation regex
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    
    if (!domainRegex.test(cleaned)) {
      setDomainError("this doesn't look like a valid domain");
      return false;
    }
    
    // Check for common mistakes
    if (cleaned.includes("http") || cleaned.includes("://")) {
      setDomainError("don't include http:// or https://");
      return false;
    }
    
    setDomainError(null);
    return true;
  };

  const handleDomainChange = (value: string) => {
    // Clean the domain as user types
    const cleaned = value.toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    setDomain(cleaned);
    if (cleaned.length > 3) {
      validateDomain(cleaned);
    } else {
      setDomainError(null);
    }
  };

  const handleStep1Next = async () => {
    if (!validateDomain(domain)) return;
    
    setIsCreating(true);
    try {
      const userId = requireUserId();

      // Check if domain already exists
      const { data: existingDomain } = await supabase
        .from("domains")
        .select("id")
        .eq("domain", domain)
        .maybeSingle();

      if (existingDomain) {
        setDomainError("this domain is already registered");
        setIsCreating(false);
        return;
      }

      // Generate verification code
      const code = `utm_verify_${Math.random().toString(36).substring(2, 15)}`;
      setVerificationCode(code);

      // Create domain record
      const { data: newDomain, error } = await supabase
        .from("domains")
        .insert({
          workspace_id: workspaceId,
          created_by: userId,
          domain,
          verification_code: code,
          is_verified: false,
        })
        .select()
        .single();

      if (error) throw error;
      
      setDomainId(newDomain.id);
      setCurrentStep(2);
    } catch (error: any) {
      notify.error(error.message || "failed to add domain");
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerify = async () => {
    if (!domainId) return;
    
    setIsVerifying(true);
    setVerificationStatus("checking");
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-domain', {
        body: { domainId }
      });

      if (error) throw error;

      if (data.verified) {
        setVerificationStatus("success");
        queryClient.invalidateQueries({ queryKey: ["workspace-domains"] });
        queryClient.invalidateQueries({ queryKey: ["verified-domains"] });
        
        // Move to step 4 (complete)
        setTimeout(() => {
          setCurrentStep(4);
        }, 1000);
      } else {
        setVerificationStatus("failed");
      }
    } catch (error: any) {
      setVerificationStatus("failed");
      notify.error(error.message || "verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleStep3Next = () => {
    // For now, move to step 4 - in production you'd verify CNAME as well
    handleVerify();
  };

  const handleComplete = () => {
    onDomainAdded?.(domain);
    queryClient.invalidateQueries({ queryKey: ["verified-domains"] });
    handleClose();
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isSubdomain = domain.split(".").length > 2;

  const renderProviderInstructions = () => {
    const txtRecord = {
      name: "_utm-verification",
      value: verificationCode,
    };

    const cnameRecord = {
      name: isSubdomain ? domain.split(".")[0] : "@",
      value: "go.utm.one",
    };

    const instructions: Record<string, { txt: string; cname: string }> = {
      godaddy: {
        txt: `1. Go to DNS Management for your domain\n2. Click "Add" under Records\n3. Select TXT as the Type\n4. Enter "${txtRecord.name}" in the Name field\n5. Enter the verification code in the Value field\n6. Save the record`,
        cname: `1. Go to DNS Management\n2. Click "Add" under Records\n3. Select CNAME as the Type\n4. Enter "${cnameRecord.name}" in the Name field\n5. Enter "go.utm.one" in the Value field\n6. Save the record`,
      },
      cloudflare: {
        txt: `1. Go to your domain's DNS settings\n2. Click "Add record"\n3. Select TXT as the Type\n4. Enter "${txtRecord.name}" in the Name field\n5. Enter the verification code in the Content field\n6. Click Save`,
        cname: `1. Go to DNS settings\n2. Click "Add record"\n3. Select CNAME as the Type\n4. Enter "${cnameRecord.name}" in the Name field\n5. Enter "go.utm.one" in the Target field\n6. Click Save (CNAME flattening is automatic)`,
      },
      namecheap: {
        txt: `1. Go to Advanced DNS settings\n2. Click "Add New Record"\n3. Select TXT Record as the Type\n4. Enter "${txtRecord.name}" in the Host field\n5. Enter the verification code in the Value field\n6. Save all changes`,
        cname: `1. Go to Advanced DNS\n2. Click "Add New Record"\n3. Select CNAME Record as the Type\n4. Enter "${cnameRecord.name}" in the Host field\n5. Enter "go.utm.one" in the Value field\n6. Save all changes`,
      },
      route53: {
        txt: `1. Go to the Hosted Zone for your domain\n2. Click "Create record"\n3. Enter "${txtRecord.name}" in the Record name field\n4. Select TXT as the Record type\n5. Enter the verification code wrapped in quotes in the Value field\n6. Click "Create records"`,
        cname: `1. Go to the Hosted Zone\n2. Click "Create record"\n3. Enter "${cnameRecord.name}" in the Record name field\n4. Select CNAME (or ALIAS for root domain) as the Record type\n5. Enter "go.utm.one" in the Value field\n6. Click "Create records"`,
      },
      other: {
        txt: `Add a TXT record with:\n• Name/Host: ${txtRecord.name}\n• Value/Content: ${verificationCode}\n• TTL: 300 (or default)`,
        cname: `Add a CNAME record with:\n• Name/Host: ${cnameRecord.name}\n• Value/Target: go.utm.one\n• TTL: 300 (or default)`,
      },
    };

    return instructions[selectedProvider] || instructions.other;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            add your custom domain
          </DialogTitle>
          <DialogDescription>
            follow these steps to connect your branded domain
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 px-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-8 sm:w-16 h-0.5 mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Enter Domain */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="domain">your domain</Label>
                <Input
                  id="domain"
                  placeholder="go.yourcompany.com"
                  value={domain}
                  onChange={(e) => handleDomainChange(e.target.value)}
                  className={domainError ? "border-destructive" : ""}
                />
                {domainError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {domainError}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">domain tips</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>subdomains like <code className="text-xs bg-muted px-1 py-0.5 rounded">go.yourcompany.com</code> are easiest to set up</li>
                      <li>don't include http:// or https://</li>
                      <li>root domains require additional configuration</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleStep1Next}
                  disabled={!domain || !!domainError || isCreating}
                  className="gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      adding...
                    </>
                  ) : (
                    <>
                      continue
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Verify Ownership (TXT Record) */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-sm font-medium mb-3">add this txt record to verify you own {domain}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div>
                      <p className="text-xs text-muted-foreground">name / host</p>
                      <code className="text-sm font-mono">_utm-verification</code>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard("_utm-verification", "name")}
                    >
                      {copiedField === "name" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">value / content</p>
                      <code className="text-sm font-mono break-all">{verificationCode}</code>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(verificationCode, "value")}
                    >
                      {copiedField === "value" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Tabs value={selectedProvider} onValueChange={setSelectedProvider}>
                <TabsList className="grid grid-cols-5 h-auto p-1">
                  {DNS_PROVIDERS.map((provider) => (
                    <TabsTrigger
                      key={provider.id}
                      value={provider.id}
                      className="text-xs px-2 py-1.5"
                    >
                      {provider.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {DNS_PROVIDERS.map((provider) => (
                  <TabsContent key={provider.id} value={provider.id} className="mt-3">
                    <div className="p-3 rounded-lg bg-muted/50 text-sm">
                      <pre className="whitespace-pre-wrap font-sans text-muted-foreground">
                        {renderProviderInstructions().txt}
                      </pre>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={() => setCurrentStep(1)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  back
                </Button>
                <Button onClick={() => setCurrentStep(3)} className="gap-2">
                  i've added the record
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Route Traffic (CNAME Record) */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-sm font-medium mb-3">add this cname record to route traffic to utm.one</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div>
                      <p className="text-xs text-muted-foreground">name / host</p>
                      <code className="text-sm font-mono">
                        {isSubdomain ? domain.split(".")[0] : "@"}
                      </code>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(isSubdomain ? domain.split(".")[0] : "@", "cname-name")}
                    >
                      {copiedField === "cname-name" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div>
                      <p className="text-xs text-muted-foreground">value / target</p>
                      <code className="text-sm font-mono">go.utm.one</code>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard("go.utm.one", "cname-value")}
                    >
                      {copiedField === "cname-value" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Tabs value={selectedProvider} onValueChange={setSelectedProvider}>
                <TabsList className="grid grid-cols-5 h-auto p-1">
                  {DNS_PROVIDERS.map((provider) => (
                    <TabsTrigger
                      key={provider.id}
                      value={provider.id}
                      className="text-xs px-2 py-1.5"
                    >
                      {provider.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {DNS_PROVIDERS.map((provider) => (
                  <TabsContent key={provider.id} value={provider.id} className="mt-3">
                    <div className="p-3 rounded-lg bg-muted/50 text-sm">
                      <pre className="whitespace-pre-wrap font-sans text-muted-foreground">
                        {renderProviderInstructions().cname}
                      </pre>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              {verificationStatus === "failed" && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                  <p className="text-destructive font-medium mb-1">dns not found yet</p>
                  <p className="text-muted-foreground">
                    this is normal — dns changes can take 1-48 hours to propagate. you can try again later or wait a few minutes.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={() => setCurrentStep(2)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  back
                </Button>
                <Button
                  onClick={handleStep3Next}
                  disabled={isVerifying}
                  className="gap-2"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      verifying...
                    </>
                  ) : verificationStatus === "failed" ? (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      try again
                    </>
                  ) : (
                    <>
                      verify my domain
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-6 space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </motion.div>
              
              <div>
                <h3 className="text-lg font-semibold mb-1">domain added successfully!</h3>
                <p className="text-muted-foreground text-sm">
                  <code className="bg-muted px-2 py-0.5 rounded">{domain}</code> is now ready to use
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                <p>your new domain will appear in all domain selectors. you can now create short links using your branded domain.</p>
              </div>

              <Button onClick={handleComplete} className="w-full">
                start using {domain}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
