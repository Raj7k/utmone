import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import { UserTypeSelector } from "@/components/onboarding/UserTypeSelector";
import { ICPQuestions } from "@/components/onboarding/ICPQuestions";
import { Loader2, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type OnboardingStep = 
  | "user-type"
  | "icp-questions"
  | "workspace-create"
  | "complete";

const ONBOARDING_STORAGE_KEY = "utm-one-onboarding-progress";

export default function OnboardingEnhanced() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentWorkspace, createWorkspace, isLoading: workspaceLoading } = useWorkspace();
  
  const [step, setStep] = useState<OnboardingStep>("user-type");
  const [userType, setUserType] = useState<"individual" | "organization">("individual");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [primaryUseCase, setPrimaryUseCase] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");

  const steps: OnboardingStep[] = ["user-type", "icp-questions", "workspace-create", "complete"];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress);
        if (data.userType) setUserType(data.userType);
        if (data.role) setRole(data.role);
        if (data.teamSize) setTeamSize(data.teamSize);
        if (data.primaryUseCase) setPrimaryUseCase(data.primaryUseCase);
        if (data.workspaceName) setWorkspaceName(data.workspaceName);
      } catch (e) {
        console.error("Failed to load progress:", e);
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    const data = { userType, role, teamSize, primaryUseCase, workspaceName };
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data));
  }, [userType, role, teamSize, primaryUseCase, workspaceName]);

  // Check if already has workspace
  useEffect(() => {
    if (currentWorkspace && currentWorkspace.onboarding_completed) {
      navigate("/dashboard");
    }
  }, [currentWorkspace, navigate]);

  const handleUserTypeSelect = (type: "individual" | "organization") => {
    setUserType(type);
    setStep("icp-questions");
  };

  const handleICPContinue = async () => {
    if (!role || !primaryUseCase) {
      toast({
        title: "required fields",
        description: "please complete all fields to continue.",
        variant: "destructive",
      });
      return;
    }

    if (userType === "organization" && !teamSize) {
      toast({
        title: "required fields",
        description: "please select your team size.",
        variant: "destructive",
      });
      return;
    }

    // Save ICP data to profile
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({
            user_type: userType,
            icp_role: role,
            team_size: teamSize || null,
            primary_use_case: primaryUseCase,
          })
          .eq("id", user.id);
      }
    } catch (error) {
      console.error("Failed to save ICP data:", error);
    }

    setStep("workspace-create");
  };

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

      localStorage.removeItem(ONBOARDING_STORAGE_KEY);

      toast({
        title: "welcome to utm.one",
        description: "your workspace is ready.",
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

  const handleExitOnboarding = () => {
    if (currentWorkspace) {
      supabase
        .from("workspaces")
        .update({ onboarding_completed: true })
        .eq("id", currentWorkspace.id)
        .then(() => {
          localStorage.removeItem(ONBOARDING_STORAGE_KEY);
          navigate("/dashboard");
        });
    }
  };

  if (workspaceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-system-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grouped-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Exit button */}
        {step !== "user-type" && (
          <div className="mb-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExitOnboarding}
              className="text-secondary-label hover:text-label"
            >
              <X className="w-4 h-4 mr-2" />
              skip for now
            </Button>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-8">
          <div className="w-full bg-fill-tertiary h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-system-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-footnote text-tertiary-label mt-2 text-center">
            step {currentStepIndex + 1} of {steps.length}
          </p>
        </div>

        {/* Step 1: User Type Selection */}
        {step === "user-type" && (
          <Card variant="grouped" className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-title-1">welcome to utm.one</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label text-lg mt-4">
                are you setting up for yourself or your team?
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <UserTypeSelector onSelect={handleUserTypeSelect} />
            </CardContent>
          </Card>
        )}

        {/* Step 2: ICP Questions */}
        {step === "icp-questions" && (
          <Card variant="grouped" className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-title-2">tell us about yourself</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label">
                this helps us personalize your experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ICPQuestions
                userType={userType}
                role={role}
                teamSize={teamSize}
                primaryUseCase={primaryUseCase}
                onRoleChange={setRole}
                onTeamSizeChange={setTeamSize}
                onUseCaseChange={setPrimaryUseCase}
              />

              <Button 
                variant="system" 
                onClick={handleICPContinue} 
                className="w-full"
                size="lg"
              >
                continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Workspace Creation */}
        {step === "workspace-create" && (
          <Card variant="grouped" className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-title-1">create your workspace</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label text-lg mt-4">
                {userType === "individual" 
                  ? "give your workspace a name."
                  : "what should we call your team workspace?"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-subheadline text-label" htmlFor="workspace-name">
                  workspace name
                </Label>
                <Input
                  variant="system"
                  id="workspace-name"
                  placeholder={userType === "individual" ? "my workspace" : "acme marketing"}
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateWorkspace()}
                />
              </div>

              <Button 
                variant="system" 
                onClick={handleCreateWorkspace} 
                className="w-full" 
                size="lg"
              >
                create workspace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Complete */}
        {step === "complete" && (
          <Card variant="grouped" className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-system-green/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-system-green" />
              </div>
              <CardTitle className="text-title-1">you're all set</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label text-lg mt-4">
                your workspace is ready. let's start creating short links.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                variant="system" 
                onClick={handleComplete} 
                className="w-full" 
                size="lg"
              >
                go to dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
