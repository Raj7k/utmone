import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";

type Role = "marketer" | "developer" | "founder" | "sales" | "ops" | "creator";

const roleData: Record<Role, { label: string; workspacePlaceholder: string }> = {
  marketer: { label: "Marketer", workspacePlaceholder: "Marketing Hub" },
  developer: { label: "Developer", workspacePlaceholder: "Dev Labs" },
  founder: { label: "Founder", workspacePlaceholder: "The Next Big Thing" },
  sales: { label: "Sales", workspacePlaceholder: "Sales Command" },
  ops: { label: "Marketing Ops", workspacePlaceholder: "Growth Ops" },
  creator: { label: "Creator", workspacePlaceholder: "Creator Studio" },
};

const goals = [
  { id: "campaigns", label: "Track campaigns" },
  { id: "qr", label: "Generate QR codes" },
  { id: "analytics", label: "Analyze performance" },
  { id: "team", label: "Collaborate with team" },
];

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [completionPhase, setCompletionPhase] = useState<"creating" | "configuring" | "ready" | null>(null);

  // Update workspace placeholder based on role
  useEffect(() => {
    if (selectedRole && !workspaceName) {
      setWorkspaceName(roleData[selectedRole].workspacePlaceholder);
    }
  }, [selectedRole, workspaceName]);

  const handleNext = () => {
    if (step === 1 && !fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please tell us your name",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && !selectedRole) {
      toast({
        title: "Role required",
        description: "Please select your role",
        variant: "destructive",
      });
      return;
    }
    if (step < 3) setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const handleFinish = async () => {
    if (!workspaceName.trim()) {
      toast({
        title: "Workspace name required",
        description: "Please name your workspace",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // Completion animation sequence
      setCompletionPhase("creating");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCompletionPhase("configuring");
      await new Promise(resolve => setTimeout(resolve, 800));

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Update profile
      await supabase
        .from("profiles")
        .update({ 
          full_name: fullName,
          user_type: selectedRole === "ops" ? "organization" : "individual",
          icp_role: selectedRole,
          primary_use_case: selectedGoals.join(","),
          onboarding_completed: true,
        })
        .eq("id", user.id);

      // Create workspace
      const slug = workspaceName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const { data: workspace, error: workspaceError } = await supabase
        .from("workspaces")
        .insert({
          name: workspaceName,
          slug,
          owner_id: user.id,
          onboarding_completed: true,
        })
        .select()
        .single();

      if (workspaceError) throw workspaceError;

      setCompletionPhase("ready");
      await new Promise(resolve => setTimeout(resolve, 600));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast({
        title: "Setup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      setIsCreating(false);
      setCompletionPhase(null);
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  // Show completion animation
  if (completionPhase) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          {completionPhase === "creating" && (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p className="text-lg font-medium">Building your workspace...</p>
            </>
          )}
          {completionPhase === "configuring" && (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p className="text-lg font-medium">Configuring analytics...</p>
            </>
          )}
          {completionPhase === "ready" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <p className="text-lg font-medium">All set!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <UtmOneLogo size="xl" />
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Step {step} of 3
          </p>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-bold">What should we call you?</h2>
                  <p className="text-muted-foreground">Let's get to know each other</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    placeholder="e.g., Alex Johnson"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    className="text-lg h-12"
                    autoFocus
                  />
                </div>

                <Button onClick={handleNext} className="w-full h-12" size="lg">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-bold">What's your role?</h2>
                  <p className="text-muted-foreground">Help us personalize your experience</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(roleData) as Role[]).map((role) => (
                    <Button
                      key={role}
                      variant={selectedRole === role ? "default" : "outline"}
                      className="h-auto py-4"
                      onClick={() => setSelectedRole(role)}
                    >
                      {roleData[role].label}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext} className="flex-1">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-bold">Let's name your space</h2>
                  <p className="text-muted-foreground">What brings you here?</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workspaceName">Workspace name</Label>
                  <Input
                    id="workspaceName"
                    placeholder={selectedRole ? roleData[selectedRole].workspacePlaceholder : "My Workspace"}
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="text-lg h-12"
                  />
                </div>

                <div className="space-y-3">
                  <Label>What are you here for? (optional)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {goals.map((goal) => (
                      <Button
                        key={goal.id}
                        variant={selectedGoals.includes(goal.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleGoal(goal.id)}
                      >
                        {goal.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleFinish} 
                    disabled={isCreating}
                    className="flex-1"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Finish setup
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
