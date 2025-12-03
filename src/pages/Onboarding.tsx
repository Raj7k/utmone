import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useAddDomain, useVerifyDomain, useWorkspaceDomains } from "@/hooks/useDomains";
import { DomainDNSInstructions } from "@/components/DomainDNSInstructions";
import { CheckCircle2, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const [step, setStep] = useState<"welcome" | "domain" | "verify" | "pixel" | "complete">("welcome");
  const [domainInput, setDomainInput] = useState("");
  const [addedDomain, setAddedDomain] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  const addDomainMutation = useAddDomain();
  const verifyDomainMutation = useVerifyDomain();
  const { data: domains } = useWorkspaceDomains(currentWorkspace?.id);

  useEffect(() => {
    const checkAndCreateWorkspace = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Trust that Auth.tsx sent us here correctly - only create workspace if needed
      // Don't double-check workspaces to avoid redirect loops
      if (!currentWorkspace) {
        setIsCreatingWorkspace(true);
        const slug = user.email?.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, '-') || 'workspace';
        const { data: newWorkspace, error } = await supabase
          .from("workspaces")
          .insert({
            name: `${user.email?.split("@")[0]}'s Workspace`,
            slug: slug,
            owner_id: user.id,
          })
          .select()
          .single();

        if (error) {
          toast({
            title: "Error",
            description: "Failed to create workspace",
            variant: "destructive",
          });
        }
        setIsCreatingWorkspace(false);
      }
    };

    checkAndCreateWorkspace();
  }, [navigate, toast, currentWorkspace]);

  useEffect(() => {
    if (!currentWorkspace) return;
    if (currentWorkspace.onboarding_completed) {
      navigate("/dashboard");
    }
  }, [currentWorkspace, navigate]);

  const handleAddDomain = async () => {
    if (!currentWorkspace) return;
    if (!domainInput.trim()) {
      toast({
        title: "Domain required",
        description: "Please enter a domain name.",
        variant: "destructive",
      });
      return;
    }

    const cleanDomain = domainInput.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, "");

    try {
      const domain = await addDomainMutation.mutateAsync({
        workspaceId: currentWorkspace.id,
        domain: cleanDomain,
      });
      setAddedDomain(domain);
      setStep("verify");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVerifyDomain = async () => {
    if (!addedDomain) return;

    setIsVerifying(true);
    try {
      await verifyDomainMutation.mutateAsync(addedDomain.id);
      setStep("pixel");
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: "Please check your DNS settings and try again in a few minutes.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSkip = async () => {
    setStep("pixel");
  };

  const handleSkipPixel = async () => {
    if (!currentWorkspace) return;

    try {
      const { error } = await supabase
        .from("workspaces")
        .update({ onboarding_completed: true })
        .eq("id", currentWorkspace.id);

      if (error) throw error;

      toast({
        title: "Onboarding skipped",
        description: "You can install the tracking pixel later in Settings.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleComplete = async () => {
    if (!currentWorkspace) return;

    try {
      const { error } = await supabase
        .from("workspaces")
        .update({ onboarding_completed: true })
        .eq("id", currentWorkspace.id);

      if (error) throw error;

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!currentWorkspace || isCreatingWorkspace) {
    return (
      <div className="dark min-h-screen flex items-center justify-center" style={{ background: '#050505' }}>
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-white" />
          <p className="text-sm text-white/60">
            {isCreatingWorkspace ? "creating your workspace..." : "loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen flex items-center justify-center p-4" style={{ background: '#050505' }}>
      <div className="w-full max-w-3xl">
        {/* Logo at top */}
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/src/assets/utm-one-logo.svg" 
            alt="utm.one" 
            className="h-8 w-auto"
          />
        </div>
        
        {step === "welcome" && (
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-display font-bold text-white">welcome to utm.one</CardTitle>
              <CardDescription className="text-white/60 text-lg mt-4">
                add your domain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-white/5 border-white/10">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-white/60">
                  with a custom domain, your short links will look like{" "}
                  <strong className="text-white">yourbrand.com/go/product</strong> instead of generic URLs.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full h-auto py-6 flex-col items-start"
                  onClick={() => setStep("domain")}
                >
                  <div className="text-lg font-semibold mb-1">use my custom domain</div>
                  <div className="text-sm font-normal text-white/60">
                    i have a domain and want to use it for short links
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-auto py-6 flex-col items-start border-white/10 text-white hover:bg-white/10"
                  onClick={handleSkip}
                >
                  <div className="text-lg font-semibold mb-1">skip for now</div>
                  <div className="text-sm font-normal text-white/40">
                    i'll add my domain later
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "domain" && (
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-display font-bold text-white">add your custom domain</CardTitle>
              <CardDescription className="text-white/60">
                add a branded domain to make your links yours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm text-white" htmlFor="domain">domain name</Label>
                <Input
                  id="domain"
                  placeholder="yourdomain.com"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                <p className="text-xs text-white/40">
                  your domain increases trust and click-through rates.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddDomain}
                  disabled={addDomainMutation.isPending}
                  className="flex-1"
                >
                  {addDomainMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => setStep("welcome")} className="border-white/10 text-white hover:bg-white/10">
                  back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "verify" && addedDomain && (
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-display font-bold text-white">verify your domain</CardTitle>
              <CardDescription className="text-white/60">
                this domain isn't verified yet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <DomainDNSInstructions
                domain={addedDomain.domain}
                verificationCode={addedDomain.verification_code}
                domainId={addedDomain.id}
              />

              <div className="flex gap-3">
                <Button
                  onClick={handleVerifyDomain}
                  disabled={isVerifying}
                  className="flex-1"
                >
                  {isVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  verify domain
                </Button>
                <Button variant="ghost" onClick={handleSkip} className="text-white/60 hover:text-white hover:bg-white/10">
                  skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "pixel" && (
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-display font-bold text-white">install tracking pixel</CardTitle>
              <CardDescription className="text-white/60">
                track conversions and analytics on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-amber-500/10 border-amber-500/20">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-white">
                  <strong>⚠️ critical for tracking:</strong> without the tracking pixel, you won't be able to track 
                  conversions, page views, or any analytics data from your website.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Label className="text-sm text-white">what it does</Label>
                <ul className="space-y-2 text-white/60">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>tracks link clicks and conversions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>monitors user behavior and analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>measures campaign performance</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    navigate('/settings?tab=pixel');
                  }}
                  className="flex-1"
                >
                  install pixel
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="ghost" onClick={handleSkipPixel} className="text-white/60 hover:text-white hover:bg-white/10">
                  skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "complete" && (
          <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <CardTitle className="text-2xl font-display font-bold text-white">setup complete.</CardTitle>
              <CardDescription className="text-white/60 text-lg">
                you're ready to start creating links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleComplete} className="w-full" size="lg">
                go to dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
