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
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { CheckCircle2, Loader2, ArrowRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type OnboardingStep = 
  | "workspace-create" 
  | "welcome" 
  | "domain" 
  | "verify" 
  | "first-link" 
  | "first-qr" 
  | "analytics" 
  | "team" 
  | "complete";

const ONBOARDING_STORAGE_KEY = "utm-one-onboarding-progress";

export default function OnboardingEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentWorkspace, createWorkspace, isLoading: workspaceLoading } = useWorkspace();
  
  const [step, setStep] = useState<OnboardingStep>("workspace-create");
  const [workspaceName, setWorkspaceName] = useState("");
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

  const steps: OnboardingStep[] = [
    "workspace-create",
    "welcome",
    "domain",
    "verify",
    "first-link",
    "first-qr",
    "analytics",
    "team",
    "complete",
  ];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (savedProgress) {
      try {
        const { step: savedStep, data } = JSON.parse(savedProgress);
        setStep(savedStep);
        if (data.linkTitle) setLinkTitle(data.linkTitle);
        if (data.linkDestination) setLinkDestination(data.linkDestination);
        if (data.domainInput) setDomainInput(data.domainInput);
      } catch (e) {
        console.error("Failed to load progress:", e);
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    const data = { linkTitle, linkDestination, domainInput };
    localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify({ step, data })
    );
  }, [step, linkTitle, linkDestination, domainInput]);

  // Check if already completed
  useEffect(() => {
    if (!currentWorkspace) {
      setStep("workspace-create");
      return;
    }
    
    if (currentWorkspace.onboarding_completed) {
      navigate("/dashboard");
      return;
    }
    
    // If workspace exists but onboarding not complete, start from welcome
    if (step === "workspace-create") {
      setStep("welcome");
    }
  }, [currentWorkspace, navigate]);

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      toast({
        title: "workspace name required",
        description: "please enter a name for your workspace.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createWorkspace(workspaceName);
      setStep("welcome");
    } catch (error: any) {
      toast({
        title: "error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddDomain = async () => {
    if (!currentWorkspace) return;
    if (!domainInput.trim()) {
      toast({
        title: "domain required",
        description: "please enter a domain name.",
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
        title: "error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSkipVerification = () => {
    toast({
      title: "verification pending",
      description: "we'll email you when your domain is verified.",
    });
    setStep("first-link");
  };

  const handleVerifyDomain = async () => {
    if (!addedDomain) return;

    setIsVerifying(true);
    try {
      await verifyDomainMutation.mutateAsync(addedDomain.id);
      toast({
        title: "domain verified",
        description: "your domain is now ready to use.",
      });
      setStep("first-link");
    } catch (error: any) {
      toast({
        title: "verification pending",
        description: "dns propagation can take up to 72 hours. you can continue and we'll verify in the background.",
        variant: "default",
      });
      // Allow continue anyway
      setStep("first-link");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCreateFirstLink = async () => {
    if (!currentWorkspace || !linkTitle || !linkDestination) {
      toast({
        title: "required fields",
        description: "please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("not authenticated");

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
        title: "link created",
        description: "your first short link is ready.",
      });
    } catch (error: any) {
      toast({
        title: "error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleQRGenerated = () => {
    trackFirstQR();
    toast({
      title: "qr code ready",
      description: "your branded qr code has been generated.",
    });
    setStep("analytics");
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

    if (!currentWorkspace) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("not authenticated");

      // Check if user exists
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", teamEmail)
        .single();

      if (existingUser) {
        // Add as workspace member
        const { error } = await supabase
          .from("workspace_members")
          .insert({
            workspace_id: currentWorkspace.id,
            user_id: existingUser.id,
            role: "editor",
          });

        if (error) throw error;
      }

      incrementTeamInvites();
      toast({
        title: "team invite sent",
        description: `invitation sent to ${teamEmail}`,
      });
      setStep("complete");
    } catch (error: any) {
      toast({
        title: "error",
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

      // Clear saved progress
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);

      toast({
        title: "welcome to utm.one",
        description: "your onboarding is complete.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExitOnboarding = async () => {
    if (!currentWorkspace) {
      navigate("/");
      return;
    }

    try {
      const { error } = await supabase
        .from("workspaces")
        .update({ onboarding_completed: true })
        .eq("id", currentWorkspace.id);

      if (error) throw error;

      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (workspaceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Exit button */}
        {step !== "workspace-create" && (
          <div className="mb-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExitOnboarding}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-2" />
              exit onboarding
            </Button>
          </div>
        )}

        {/* Progress bar */}
        {step !== "workspace-create" && (
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              step {currentStepIndex + 1} of {steps.length}
            </p>
          </div>
        )}

        {/* Workspace Creation */}
        {step === "workspace-create" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">create your workspace</CardTitle>
              <CardDescription className="text-lg mt-4">
                let's start with a name for your team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">workspace name</Label>
                <Input
                  id="workspace-name"
                  placeholder="acme marketing"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateWorkspace()}
                />
              </div>

              <Button onClick={handleCreateWorkspace} className="w-full" size="lg">
                create workspace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Welcome */}
        {step === "welcome" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">welcome to utm.one</CardTitle>
              <CardDescription className="text-lg mt-4">
                let's set up your workspace. it takes under 2 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={() => setStep("domain")} className="w-full" size="lg">
                continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Domain Setup */}
        {step === "domain" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>add your branded domain</CardTitle>
              <CardDescription>
                use your own domain for short links. example: yourcompany.com/go/
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="domain">your domain</Label>
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
                <Button variant="outline" onClick={() => setStep("first-link")}>
                  skip
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Domain Verification */}
        {step === "verify" && addedDomain && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>verify your domain</CardTitle>
              <CardDescription>add this DNS record to verify ownership.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <DomainDNSInstructions
                domain={addedDomain.domain}
                verificationCode={addedDomain.verification_code}
              />

              <Alert>
                <AlertDescription>
                  dns verification can take up to 72 hours. you can continue now and we'll verify in the background.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  onClick={handleVerifyDomain}
                  disabled={isVerifying}
                  variant="outline"
                  className="flex-1"
                >
                  {isVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  verify now
                </Button>
                <Button onClick={handleSkipVerification} className="flex-1">
                  continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* First Link */}
        {step === "first-link" && (
          <Card className="max-w-2xl mx-auto">
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
                    placeholder="welcome offer"
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

        {/* QR Code Generation */}
        {step === "first-qr" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>your qr code, designed beautifully</CardTitle>
              <CardDescription>choose a color and add your logo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {createdLink ? (
                <QRCodeGenerator
                  linkId={createdLink.id}
                  shortUrl={createdLink.final_url || createdLink.short_url}
                  onSuccess={handleQRGenerated}
                />
              ) : (
                <Alert>
                  <AlertDescription>
                    create a link first to generate a qr code
                  </AlertDescription>
                </Alert>
              )}

              <Button
                variant="outline"
                onClick={() => setStep("analytics")}
                className="w-full"
              >
                skip for now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Analytics Preview */}
        {step === "analytics" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>see your analytics</CardTitle>
              <CardDescription>see how your links are performing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground mt-1">total clicks</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground mt-1">unique visitors</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold">0%</div>
                  <div className="text-sm text-muted-foreground mt-1">click rate</div>
                </div>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  your analytics will update automatically as people click your links
                </AlertDescription>
              </Alert>

              <Button onClick={handleViewAnalytics} className="w-full">
                continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Team Invitation */}
        {step === "team" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>add your team</CardTitle>
              <CardDescription>
                share access with teammates so everyone follows the same rules.
              </CardDescription>
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

              <Button onClick={handleInviteTeamMember} className="w-full">
                {teamEmail ? "send invite" : "skip"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Completion */}
        {step === "complete" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">you're ready.</CardTitle>
              <CardDescription className="text-lg">
                your workspace is set. your links are clean. your data will be too.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
