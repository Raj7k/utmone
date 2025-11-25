import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const { currentWorkspace, createWorkspace, isLoading: workspaceLoading } = useWorkspace();
  
  const [step, setStep] = useState<OnboardingStep>("user-type");
  const [userType, setUserType] = useState<"individual" | "organization">("individual");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [primaryUseCase, setPrimaryUseCase] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [createdWorkspaceId, setCreatedWorkspaceId] = useState<string | null>(null);

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
        title: "Required fields",
        description: "Please complete all fields to continue.",
        variant: "destructive",
      });
      return;
    }

    if (userType === "organization" && !teamSize) {
      toast({
        title: "Required fields",
        description: "Please select your team size.",
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
        title: "Workspace name required",
        description: "Please enter a name for your workspace.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const slug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      // Create workspace directly
      const { data, error } = await supabase
        .from("workspaces")
        .insert({ name: workspaceName, slug, owner_id: user.id })
        .select()
        .single();

      if (error) {
        // Check for duplicate slug error (Postgres error code 23505)
        if (error.code === "23505") {
          toast({
            title: "Workspace name unavailable",
            description: "A workspace with this name already exists. Please try a different name.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }
      
      // Store created workspace ID
      setCreatedWorkspaceId(data.id);
      
      // Invalidate queries to refresh context
      queryClient.invalidateQueries({ queryKey: ["client-workspaces"] });
      
      setStep("complete");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleComplete = async () => {
    const workspaceId = currentWorkspace?.id || createdWorkspaceId;
    if (!workspaceId) {
      toast({
        title: "Error",
        description: "Workspace not found. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("workspaces")
        .update({ onboarding_completed: true })
        .eq("id", workspaceId);

      if (error) throw error;

      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      queryClient.invalidateQueries({ queryKey: ["client-workspaces"] });

      toast({
        title: "Welcome to utm.one",
        description: "Your workspace is ready.",
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
              <CardTitle className="text-title-1">Welcome to utm.one</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label text-lg mt-4">
                Are you setting up for yourself or your team?
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
              <CardTitle className="text-title-2">Tell us about yourself</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label">
                This helps us personalize your experience.
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
              <CardTitle className="text-title-1">Create your workspace</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label text-lg mt-4">
                {userType === "individual" 
                  ? "Give your workspace a name."
                  : "What should we call your team workspace?"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-subheadline text-label" htmlFor="workspace-name">
                  Workspace name
                </Label>
                <Input
                  variant="system"
                  id="workspace-name"
                  placeholder={userType === "individual" ? "My Workspace" : "Acme Marketing"}
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
                Create workspace
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
              <CardTitle className="text-title-1">You're all set</CardTitle>
              <CardDescription className="text-body-apple text-secondary-label text-lg mt-4">
                Your workspace is ready. Let's start creating short links.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                variant="system" 
                onClick={handleComplete} 
                className="w-full" 
                size="lg"
              >
                Go to dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
