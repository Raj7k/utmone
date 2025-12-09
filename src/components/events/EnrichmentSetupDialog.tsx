import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Loader2,
  ExternalLink,
  DollarSign
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EnrichmentSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  onComplete: () => void;
}

type Provider = "apollo" | "clay" | "zoominfo";

const providers = [
  {
    id: "apollo" as Provider,
    name: "Apollo.io",
    description: "best for b2b lead data",
    matchRate: "70-80%",
    pricing: "$49/mo"
  },
  {
    id: "clay" as Provider,
    name: "Clay",
    description: "flexible webhook workflows",
    matchRate: "60-75%",
    pricing: "usage-based"
  },
  {
    id: "zoominfo" as Provider,
    name: "ZoomInfo",
    description: "enterprise-grade data",
    matchRate: "80-90%",
    pricing: "enterprise"
  }
];

export const EnrichmentSetupDialog = ({
  open,
  onOpenChange,
  workspaceId,
  onComplete
}: EnrichmentSetupDialogProps) => {
  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
    setStep(2);
  };

  const handleSave = async () => {
    if (!selectedProvider) return;
    
    setIsSaving(true);
    try {
      const settings: Record<string, string> = {
        enrichment_provider: selectedProvider
      };
      
      if (selectedProvider === "apollo") {
        settings.apollo_api_key = apiKey;
      } else if (selectedProvider === "clay") {
        settings.clay_webhook_url = webhookUrl;
      } else if (selectedProvider === "zoominfo") {
        settings.zoominfo_client_id = clientId;
        settings.zoominfo_client_secret = clientSecret;
      }

      // Get current workspace settings
      const { data: currentWorkspace } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();

      const currentSettings = (currentWorkspace as any)?.settings || {};
      const newSettings = { ...currentSettings, ...settings };

      const { error } = await supabase
        .from('workspaces')
        .update({ settings: newSettings } as any)
        .eq('id', workspaceId);

      if (error) throw error;

      setStep(3);
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: "failed to save",
        description: "please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('enrich-lead', {
        body: {
          firstName: "Test",
          lastName: "User",
          company: "Acme Corp",
          workspaceId
        }
      });

      if (error) throw error;

      if (data?.email || !data?.error) {
        setTestSuccess(true);
        toast({
          title: "connection successful",
          description: "enrichment is working correctly",
        });
      } else {
        toast({
          title: "connection issue",
          description: data.message || "could not verify connection",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Test failed:', error);
      toast({
        title: "test failed",
        description: "please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleComplete = () => {
    onComplete();
    onOpenChange(false);
    // Reset state
    setStep(1);
    setSelectedProvider(null);
    setApiKey("");
    setWebhookUrl("");
    setClientId("");
    setClientSecret("");
    setTestSuccess(false);
  };

  const canProceed = () => {
    if (!selectedProvider) return false;
    if (selectedProvider === "apollo") return !!apiKey;
    if (selectedProvider === "clay") return !!webhookUrl;
    if (selectedProvider === "zoominfo") return !!clientId && !!clientSecret;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            set up lead enrichment
          </DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={cn(
                "flex-1 h-1 rounded-full transition-colors",
                s <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">save $3,000+ per event</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  auto-enrich missing emails from badge scans instead of renting expensive hardware scanners
                </p>
              </div>

              <p className="text-sm text-muted-foreground">choose your enrichment provider:</p>

              <div className="space-y-3">
                {providers.map((provider) => (
                  <Card 
                    key={provider.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:border-primary/50",
                      selectedProvider === provider.id && "border-primary bg-primary/5"
                    )}
                    onClick={() => handleProviderSelect(provider.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{provider.name}</h4>
                        <p className="text-sm text-muted-foreground">{provider.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{provider.matchRate}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{provider.pricing}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep(1)}
                className="mb-2"
              >
                ← back
              </Button>

              {selectedProvider === "apollo" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>apollo api key</Label>
                    <Input
                      type="password"
                      placeholder="your apollo api key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      find at{" "}
                      <a 
                        href="https://app.apollo.io/#/settings/integrations/api" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        apollo settings <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {selectedProvider === "clay" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>clay webhook url</Label>
                    <Input
                      type="url"
                      placeholder="https://api.clay.com/v1/..."
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                    <p className="text-xs font-medium">setup steps:</p>
                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>go to clay → workflows → create new</li>
                      <li>add "http request" trigger</li>
                      <li>add person enrichment steps</li>
                      <li>copy webhook url</li>
                    </ol>
                  </div>
                </div>
              )}

              {selectedProvider === "zoominfo" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>client id</Label>
                    <Input
                      placeholder="your zoominfo client id"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>client secret</Label>
                    <Input
                      type="password"
                      placeholder="your zoominfo client secret"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      get from{" "}
                      <a 
                        href="https://developer.zoominfo.com" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        zoominfo developer portal <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSave} 
                disabled={!canProceed() || isSaving}
                className="w-full gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    save & continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 text-center"
            >
              {testSuccess ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">enrichment ready!</h3>
                  <p className="text-sm text-muted-foreground">
                    badge scans will now be automatically enriched with missing contact info
                  </p>
                  <Button onClick={handleComplete} className="w-full">
                    done
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">test your connection</h3>
                  <p className="text-sm text-muted-foreground">
                    we'll verify your credentials are working correctly
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleComplete}
                      className="flex-1"
                    >
                      skip test
                    </Button>
                    <Button 
                      onClick={handleTest}
                      disabled={isTesting}
                      className="flex-1"
                    >
                      {isTesting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "test connection"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
