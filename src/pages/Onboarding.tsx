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
        navigate("/login");
        return;
      }

      // Check if user owns any workspaces
      const { data: ownedWorkspaces } = await supabase
        .from("workspaces")
        .select("*")
        .eq("owner_id", user.id);

      // Check if user is a member of any workspaces
      const { data: memberWorkspaces } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", user.id);

      const hasAnyWorkspace = (ownedWorkspaces?.length || 0) + (memberWorkspaces?.length || 0) > 0;

      // If user has ANY workspace access (owned or member), redirect to dashboard
      if (hasAnyWorkspace) {
        navigate("/dashboard");
        return;
      }

      // Only create workspace if user genuinely has no access
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
    };

    checkAndCreateWorkspace();
  }, [navigate, toast]);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-sm text-secondary-label">
            {isCreatingWorkspace ? "Creating your workspace..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grouped-background flex items-center justify-center p-4">
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
          <Card variant="grouped">
            <CardHeader className="text-center">
              <CardTitle className="text-title-1">welcome to utm.one</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label text-lg mt-4">
                add your domain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-fill-tertiary border-separator">
                <CheckCircle2 className="h-4 w-4 text-system-green" />
                <AlertDescription className="text-body-apple text-secondary-label">
                  With a custom domain, your short links will look like{" "}
                  <strong className="text-label">yourbrand.com/go/product</strong> instead of generic URLs.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Button
                  variant="system"
                  size="lg"
                  className="w-full h-auto py-6 flex-col items-start"
                  onClick={() => setStep("domain")}
                >
                  <div className="text-headline font-semibold mb-1">use my custom domain</div>
                  <div className="text-subheadline font-normal text-secondary-label">
                    i have a domain and want to use it for short links
                  </div>
                </Button>

                <Button
                  variant="system-secondary"
                  size="lg"
                  className="w-full h-auto py-6 flex-col items-start"
                  onClick={handleSkip}
                >
                  <div className="text-headline font-semibold mb-1">skip for now</div>
                  <div className="text-subheadline font-normal text-tertiary-label">
                    i'll add my domain later
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "domain" && (
          <Card variant="grouped">
            <CardHeader>
              <CardTitle className="text-title-2">add your custom domain</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label">
                add a branded domain to make your links yours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-subheadline text-label" htmlFor="domain">domain name</Label>
                <Input
                  variant="system"
                  id="domain"
                  placeholder="yourdomain.com"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
                />
                <p className="text-footnote text-tertiary-label">
                  your domain increases trust and click-through rates.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="system"
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
                <Button variant="system-secondary" onClick={() => setStep("welcome")}>
                  back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "verify" && addedDomain && (
          <Card variant="grouped">
            <CardHeader>
              <CardTitle className="text-title-2">verify your domain</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label">
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
                  variant="system"
                  onClick={handleVerifyDomain}
                  disabled={isVerifying}
                  className="flex-1"
                >
                  {isVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  verify domain
                </Button>
                <Button variant="system-tertiary" onClick={handleSkip}>
                  skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "pixel" && (
          <Card variant="grouped">
            <CardHeader>
              <CardTitle className="text-title-2">install tracking pixel</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label">
                track conversions and analytics on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-system-orange/10 border-system-orange/20">
                <AlertCircle className="h-4 w-4 text-system-orange" />
                <AlertDescription className="text-body-apple text-label">
                  <strong>⚠️ critical for tracking:</strong> without the tracking pixel, you won't be able to track 
                  conversions, page views, or any analytics data from your website.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Label className="text-subheadline text-label">what it does</Label>
                <ul className="space-y-2 text-body-apple text-secondary-label">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-system-green flex-shrink-0 mt-0.5" />
                    <span>tracks link clicks and conversions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-system-green flex-shrink-0 mt-0.5" />
                    <span>monitors user behavior and analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-system-green flex-shrink-0 mt-0.5" />
                    <span>measures campaign performance</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="system"
                  onClick={() => {
                    navigate('/settings?tab=pixel');
                  }}
                  className="flex-1"
                >
                  install pixel
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="system-tertiary" onClick={handleSkipPixel}>
                  skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "complete" && (
          <Card variant="grouped">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-system-green/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-system-green" />
              </div>
              <CardTitle className="text-title-2">setup complete.</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label text-lg">
                you're ready to start creating links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="system" onClick={handleComplete} className="w-full" size="lg">
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
