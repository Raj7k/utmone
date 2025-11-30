import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  Megaphone, 
  Rocket, 
  Video, 
  Calendar,
  Code,
  TrendingUp,
  Wand2
} from "lucide-react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";

type Role = "marketer" | "developer" | "founder" | "sales" | "ops" | "creator" | "organizer";

interface RoleConfig {
  label: string;
  hint_workspace: string;
  hint_link: string;
  icon: React.ReactNode;
}

const ROLE_CONFIG: Record<Role, RoleConfig> = {
  marketer: {
    label: "Growth Marketer",
    hint_workspace: "Acme Growth Team",
    hint_link: "hubspot.com/summer-campaign",
    icon: <Megaphone className="w-4 h-4" />,
  },
  founder: {
    label: "Founder / CEO",
    hint_workspace: "The Next Big Thing Inc",
    hint_link: "ycombinator.com/apply",
    icon: <Rocket className="w-4 h-4" />,
  },
  creator: {
    label: "Content Creator",
    hint_workspace: "Sarah's Community",
    hint_link: "youtube.com/c/sarah",
    icon: <Video className="w-4 h-4" />,
  },
  organizer: {
    label: "Event Organizer",
    hint_workspace: "Tech Summit 2025",
    hint_link: "lu.ma/launch-party",
    icon: <Calendar className="w-4 h-4" />,
  },
  developer: {
    label: "Developer",
    hint_workspace: "Dev Labs",
    hint_link: "github.com/my-project",
    icon: <Code className="w-4 h-4" />,
  },
  sales: {
    label: "Sales",
    hint_workspace: "Sales Command",
    hint_link: "salesforce.com/q1-campaign",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  ops: {
    label: "Marketing Ops",
    hint_workspace: "Growth Ops",
    hint_link: "marketo.com/lead-gen",
    icon: <TrendingUp className="w-4 h-4" />,
  },
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
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [completionPhase, setCompletionPhase] = useState<"creating" | "configuring" | "ready" | null>(null);
  const [placeholderKey, setPlaceholderKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Animated placeholder update when role changes
  useEffect(() => {
    if (selectedRole) {
      setPlaceholderKey(prev => prev + 1);
    }
  }, [selectedRole]);

  // Auto-redirect to dashboard when ready (safety net)
  useEffect(() => {
    if (completionPhase === "ready") {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [completionPhase, navigate]);

  const currentPlaceholder = selectedRole 
    ? `e.g., ${ROLE_CONFIG[selectedRole].hint_workspace}`
    : "e.g., My Workspace";

  // Smart fill with typewriter effect
  const handleSmartFill = () => {
    if (!selectedRole) return;
    
    const hint = ROLE_CONFIG[selectedRole].hint_workspace;
    setWorkspaceName("");
    
    let index = 0;
    const interval = setInterval(() => {
      if (index <= hint.length) {
        setWorkspaceName(hint.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

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

      // Invalidate workspace cache to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["client-workspaces"] });

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
              className="space-y-4"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <p className="text-lg font-medium">All set!</p>
              <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
              <Button 
                onClick={() => navigate("/dashboard")} 
                variant="outline"
                className="mt-4"
              >
                Go to Dashboard
              </Button>
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
              <motion.div layout>
                <Card className="p-8 space-y-6">
                  <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold">What's your role?</h2>
                    <p className="text-muted-foreground">Help us personalize your experience</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Your role</Label>
                    <Select
                      value={selectedRole || ""}
                      onValueChange={(value) => setSelectedRole(value as Role)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ROLE_CONFIG) as Role[]).map((role) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center gap-2">
                              {ROLE_CONFIG[role].icon}
                              <span>{ROLE_CONFIG[role].label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <motion.div layout>
                <Card className="p-8 space-y-6">
                  <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold">Let's name your space</h2>
                    <p className="text-muted-foreground">What brings you here?</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workspaceName">Workspace name</Label>
                    <div className="relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={placeholderKey}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Input
                            ref={inputRef}
                            id="workspaceName"
                            placeholder={currentPlaceholder}
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            className="text-lg h-12 pr-12"
                          />
                        </motion.div>
                      </AnimatePresence>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                        onClick={handleSmartFill}
                        disabled={!selectedRole}
                      >
                        <Wand2 className="w-4 h-4" />
                      </Button>
                    </div>
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
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
