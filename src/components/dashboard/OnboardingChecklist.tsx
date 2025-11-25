import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";

interface OnboardingChecklistProps {
  hasLinks: boolean;
  hasQrCodes: boolean;
  hasViewedAnalytics: boolean;
  hasInvitedTeam: boolean;
  hasCustomDomain: boolean;
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export const OnboardingChecklist = ({
  hasLinks,
  hasQrCodes,
  hasViewedAnalytics,
  hasInvitedTeam,
  hasCustomDomain,
}: OnboardingChecklistProps) => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  const items: ChecklistItem[] = [
    { id: 'link', label: 'create your first link', completed: hasLinks },
    { id: 'qr', label: 'generate a qr code', completed: hasQrCodes },
    { id: 'analytics', label: 'view analytics', completed: hasViewedAnalytics },
    { id: 'team', label: 'invite team member', completed: hasInvitedTeam },
    { id: 'domain', label: 'set up custom domain', completed: hasCustomDomain },
  ];

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progress = (completedCount / totalCount) * 100;
  const isComplete = completedCount === totalCount;

  useEffect(() => {
    if (isComplete && !hasShownConfetti) {
      setShowConfetti(true);
      setHasShownConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [isComplete, hasShownConfetti]);

  // Auto-hide after completion
  if (isComplete && !showConfetti) {
    return null;
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <Card variant="grouped" className="border-system-blue">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>getting started</span>
            <span className="text-body-apple text-system-blue">
              {completedCount}/{totalCount}
            </span>
          </CardTitle>
          <CardDescription>
            {isComplete 
              ? "🎉 you're all set up! welcome to utm.one" 
              : `${Math.round(progress)}% complete`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          
          <div className="space-y-2">
            {items.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-fill-tertiary transition-apple"
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-system-green flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-tertiary-label flex-shrink-0" />
                )}
                <span className={`text-callout ${
                  item.completed ? 'text-secondary-label line-through' : 'text-label'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
