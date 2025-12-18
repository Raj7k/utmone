import { useState } from "react";
import { 
  Target, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Share2,
  PartyPopper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { shareOnLinkedIn } from "@/lib/utils/linkedinShare";
import { toast } from "sonner";
import { triggerConfetti } from "@/components/lazy/LazyConfetti";
import { CSSAnimatePresence } from "./motion";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgress = ({ currentStep, totalSteps }: StepProgressProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              index < currentStep
                ? "bg-primary text-primary-foreground"
                : index === currentStep
                ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index < currentStep ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`w-12 h-1 mx-1 rounded-full transition-all duration-300 ${
                index < currentStep ? "bg-primary scale-x-100" : "bg-muted scale-x-30"
              }`}
              style={{ transformOrigin: 'left' }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export const FirstPrinciplesWizard = () => {
  const [step, setStep] = useState(0);
  const [problem, setProblem] = useState("");
  const [whys, setWhys] = useState(["", "", "", "", ""]);
  const [fundamentals, setFundamentals] = useState<string[]>([]);

  const updateWhy = (index: number, value: string) => {
    const newWhys = [...whys];
    newWhys[index] = value;
    setWhys(newWhys);
  };

  const generateFundamentals = () => {
    const filled = whys.filter(w => w.trim() !== "");
    if (filled.length >= 3) {
      setFundamentals([
        "Core assumption identified: " + (whys[4] || whys[3] || whys[2]),
        "This can be validated by testing smaller hypotheses",
        "Action: Start with the smallest possible experiment"
      ]);
      setStep(2);
      
      triggerConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#FF6B35', '#10B981']
      });
    } else {
      toast.error("please fill at least 3 'why' answers");
    }
  };

  const handleShare = () => {
    const text = `🎯 Just broke down a complex decision using First Principles from utm.one\n\nProblem: ${problem}\n\nKey insight: ${fundamentals[0] || "Breaking down complex decisions into fundamental truths"}\n\nTry it free:`;
    shareOnLinkedIn(text, "https://utm.one/tools/decision-frameworks?tab=first-principles");
  };

  const nextStep = () => {
    if (step === 0 && !problem.trim()) {
      toast.error("please describe your problem first");
      return;
    }
    if (step === 1) {
      generateFundamentals();
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(Math.max(0, step - 1));

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-6 md:p-8">
        <StepProgress currentStep={step} totalSteps={3} />
        
        <div className="relative min-h-[400px]">
          <CSSAnimatePresence show={step === 0} animation="slide-up">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground">
                  define your problem
                </h3>
                <p className="text-sm mt-1 text-muted-foreground">
                  What decision are you trying to make?
                </p>
              </div>
              
              <Textarea 
                placeholder="e.g., Our marketing campaigns aren't generating enough leads and we're not sure where to focus our budget..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="min-h-[120px] text-sm"
              />
              
              <Button onClick={nextStep} className="w-full" size="lg">
                start breakdown
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CSSAnimatePresence>

          <CSSAnimatePresence show={step === 1} animation="slide-up">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-system-orange to-system-orange/60 flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground">
                  ask "why" 5 times
                </h3>
                <p className="text-sm mt-1 text-muted-foreground">
                  Dig deeper with each answer
                </p>
              </div>
              
              <div className="rounded-lg p-3 mb-4 bg-muted">
                <p className="text-xs text-muted-foreground">your problem:</p>
                <p className="text-sm font-medium text-foreground">{problem}</p>
              </div>
              
              <div className="space-y-3">
                {whys.map((why, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all ${
                        why.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <Input 
                      placeholder={index === 0 ? "Why is this happening?" : `Why? (dig deeper)`}
                      value={why}
                      onChange={(e) => updateWhy(index, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={prevStep} 
                  variant="outline" 
                  className=""
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  back
                </Button>
                <Button onClick={nextStep} className="flex-1" size="lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  reveal insights
                </Button>
              </div>
            </div>
          </CSSAnimatePresence>

          <CSSAnimatePresence show={step === 2} animation="slide-up">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-system-green to-system-green/80 flex items-center justify-center mx-auto mb-4 animate-bounce-in"
                >
                  <PartyPopper className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground">
                  fundamental insights revealed
                </h3>
                <p className="text-sm mt-1 text-muted-foreground">
                  Here's what we discovered
                </p>
              </div>
              
              <div className="space-y-3">
                {fundamentals.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 animate-fade-in"
                    style={{ animationDelay: `${300 + i * 150}ms` }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => setStep(0)} 
                  variant="outline" 
                  className=""
                >
                  start over
                </Button>
                <Button onClick={handleShare} className="flex-1" size="lg">
                  <Share2 className="w-4 h-4 mr-2" />
                  share on linkedin
                </Button>
              </div>
            </div>
          </CSSAnimatePresence>
        </div>
      </div>
    </div>
  );
};
