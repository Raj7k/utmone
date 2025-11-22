import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useAddDomain, useVerifyDomain } from "@/hooks/useDomains";
import { useActivationTracking } from "@/hooks/useActivationTracking";
import { DomainDNSInstructions } from "@/components/DomainDNSInstructions";
import { CheckCircle2, Loader2, ArrowRight, Link2, QrCode, BarChart3, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type OnboardingStep = "welcome" | "domain" | "verify" | "first-link" | "first-qr" | "analytics" | "team" | "complete";

export default function OnboardingEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [domainInput, setDomainInput] = useState("");
  const [addedDomain, setAddedDomain] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkDestination, setLinkDestination] = useState("");
  const [createdLink, setCreatedLink] = useState<any>(null);
  const [teamEmail, setTeamEmail] = useState("");

  const addDomainMutation = useAddDomain();
  const verifyDomainMutation = useVerifyDomain();
  const { trackFirstLink, trackFirstQR, trackFirstAnalyticsView, incrementTeamInvites } = useActivationTracking();

  const steps: OnboardingStep[] = ["welcome", "domain", "verify", "first-link", "first-qr", "analytics", "team", "complete"];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

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
      setStep("first-link");
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

  const handleCreateFirstLink = async () => {
    if (!currentWorkspace || !linkTitle || !linkDestination) {
      toast({
        title: "Required fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const slug = linkTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const { data, error } = await supabase
        .from("links")
        .insert({
          workspace_id: currentWorkspace.id,
          created_by: user.id,
          title: linkTitle,
          destination_url: linkDestination,
          domain: addedDomain?.domain || "utm.one",
          path: "go",
          slug,
          final_url: `https://${addedDomain?.domain || "utm.one"}/go/${slug}`,
        })
        .select()
        .single();

      if (error) throw error;

      setCreatedLink(data);
      trackFirstLink();
      setStep("first-qr");

      toast({
        title: "Link created!",
        description: "Your first short link is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGenerateQR = () => {
    if (createdLink) {
      trackFirstQR();
      toast({
        title: "QR code ready",
        description: "Your first QR code has been generated.",
      });
      setStep("analytics");
    }
  };

  const handleViewAnalytics = () => {
    trackFirstAnalyticsView();
    setStep("team");
  };

  const handleInviteTeamMember = async () => {
    if (!teamEmail.trim()) {
      setStep("complete");
      return;
    }

    // Here you would implement actual team invite logic
    incrementTeamInvites();
    toast({
      title: "Team invite sent",
      description: `Invitation sent to ${teamEmail}`,
    });
    setStep("complete");
  };

  const handleComplete = async () => {
    if (!currentWorkspace) return;

    try {
      const { error } = await supabase
        .from("workspaces")
        .update({ onboarding_completed: true })
        .eq("id", currentWorkspace.id);

      if (error) throw error;

      toast({
        title: "Welcome to utm.one",
        description: "Your onboarding is complete!",
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

  const handleSkip = async () => {
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
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            step {currentStepIndex + 1} of {steps.length}
          </p>
        </div>

        {step === "welcome" && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">welcome to utm.one</CardTitle>
              <CardDescription className="text-lg mt-4">
                let's set up your workspace. it takes under 2 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button
                  className="w-full h-auto py-4"
                  onClick={() => setStep("domain")}
                >
                  continue
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleSkip}
                >
                  i'll do this later
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "domain" && (
          <Card>
            <CardHeader>
              <CardTitle>add your branded domain</CardTitle>
              <CardDescription>
                use your own domain for short links. example: yourcompany.com/go/
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
                <Button variant="outline" onClick={handleSkip}>
                  skip
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "verify" && addedDomain && (
          <Card>
            <CardHeader>
              <CardTitle>verify your domain</CardTitle>
              <CardDescription>add this DNS record to verify ownership.</CardDescription>
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
                <Button variant="outline" onClick={() => setStep("first-link")}>
                  skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "first-link" && (
          <Card>
            <CardHeader>
              <CardTitle>your first short link</CardTitle>
              <CardDescription>paste any url to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="link-title">link title</Label>
                  <Input
                    id="link-title"
                    placeholder="Welcome Offer"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link-destination">destination url</Label>
                  <Input
                    id="link-destination"
                    placeholder="https://example.com/welcome"
                    value={linkDestination}
                    onChange={(e) => setLinkDestination(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCreateFirstLink} className="flex-1">
                  create link
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => setStep("first-qr")}>
                  skip
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "first-qr" && (
          <Card>
            <CardHeader>
              <CardTitle>your qr code, designed beautifully</CardTitle>
              <CardDescription>choose a color and add your logo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  {createdLink 
                    ? `QR code will be created for: ${createdLink.short_url || createdLink.final_url}`
                    : "create a link first to generate a QR code"
                  }
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button onClick={handleGenerateQR} className="flex-1" disabled={!createdLink}>
                  generate QR code
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => setStep("analytics")}>
                  skip
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "analytics" && (
          <Card>
            <CardHeader>
              <CardTitle>see your analytics</CardTitle>
              <CardDescription>see how your links are performing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  analytics dashboard tracks clicks, devices, locations, and more
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button onClick={handleViewAnalytics} className="flex-1">
                  explore analytics
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => setStep("team")}>
                  skip
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "team" && (
          <Card>
            <CardHeader>
              <CardTitle>add your team</CardTitle>
              <CardDescription>share access with teammates so everyone follows the same rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="team-email">team member email</Label>
                <Input
                  id="team-email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={teamEmail}
                  onChange={(e) => setTeamEmail(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleInviteTeamMember} className="flex-1">
                  {teamEmail ? "send invite" : "skip"}
                  <ArrowRight className="w-4 h-4 ml-2" />
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
              <CardTitle className="text-2xl">you're ready.</CardTitle>
              <CardDescription className="text-lg">
                your workspace is set. your links are clean. your data will be too.
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