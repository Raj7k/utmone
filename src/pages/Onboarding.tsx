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
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const [step, setStep] = useState<"welcome" | "domain" | "verify" | "complete">("welcome");
  const [domainInput, setDomainInput] = useState("");
  const [addedDomain, setAddedDomain] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const addDomainMutation = useAddDomain();
  const verifyDomainMutation = useVerifyDomain();
  const { data: domains } = useWorkspaceDomains(currentWorkspace?.id);

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
      setStep("complete");
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
    if (!currentWorkspace) return;

    try {
      const { error } = await supabase
        .from("workspaces")
        .update({ onboarding_completed: true })
        .eq("id", currentWorkspace.id);

      if (error) throw error;

      toast({
        title: "Onboarding skipped",
        description: "You can add a custom domain later in Settings.",
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

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {step === "welcome" && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">welcome to utm.one</CardTitle>
              <CardDescription className="text-lg mt-4">
                add your domain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  With a custom domain, your short links will look like{" "}
                  <strong>yourbrand.com/go/product</strong> instead of generic URLs.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Button
                  className="w-full h-auto py-6 flex-col items-start"
                  onClick={() => setStep("domain")}
                >
                  <div className="text-lg font-semibold mb-1">use my custom domain</div>
                  <div className="text-sm font-normal opacity-90">
                    i have a domain and want to use it for short links
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-auto py-6 flex-col items-start"
                  onClick={handleSkip}
                >
                  <div className="text-lg font-semibold mb-1">skip for now</div>
                  <div className="text-sm font-normal opacity-70">
                    i'll add my domain later
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "domain" && (
          <Card>
            <CardHeader>
              <CardTitle>add your custom domain</CardTitle>
              <CardDescription>
                add a branded domain to make your links yours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="domain">domain name</Label>
                <Input
                  id="domain"
                  placeholder="yourdomain.com"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
                />
                <p className="text-sm text-muted-foreground">
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
                <Button variant="outline" onClick={() => setStep("welcome")}>
                  back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "verify" && addedDomain && (
          <Card>
            <CardHeader>
              <CardTitle>verify your domain</CardTitle>
              <CardDescription>
                this domain isn't verified yet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <DomainDNSInstructions
                domain={addedDomain.domain}
                verificationCode={addedDomain.verification_code}
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
                <Button variant="outline" onClick={handleSkip}>
                  skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "complete" && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">domain added successfully.</CardTitle>
              <CardDescription className="text-lg">
                your domain is ready
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleComplete} className="w-full" size="lg">
                continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
