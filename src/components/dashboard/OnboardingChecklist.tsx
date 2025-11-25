import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useNavigate } from "react-router-dom";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  action: () => void;
  buttonLabel: string;
}

export const OnboardingChecklist = () => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);
  const navigate = useNavigate();
  
  const {
    hasLinks,
    hasQrCodes,
    hasViewedAnalytics,
    hasInvitedTeam,
    hasCustomDomain,
    isLoading,
  } = useOnboardingProgress();

  const items: ChecklistItem[] = [
    {
      id: 'link',
      label: 'create your first link',
      description: 'start shortening and tracking your URLs',
      completed: hasLinks,
      action: () => navigate('/dashboard/links'),
      buttonLabel: 'Create →',
    },
    {
      id: 'qr',
      label: 'generate a QR Code',
      description: 'add a branded QR Code to your link',
      completed: hasQrCodes,
      action: () => navigate('/dashboard/qr-codes'),
      buttonLabel: 'Generate →',
    },
    {
      id: 'analytics',
      label: 'view analytics',
      description: 'see how your links are performing',
      completed: hasViewedAnalytics,
      action: () => navigate('/dashboard/analytics'),
      buttonLabel: 'View →',
    },
    {
      id: 'team',
      label: 'invite team member',
      description: 'collaborate with your team',
      completed: hasInvitedTeam,
      action: () => navigate('/settings?tab=team&action=invite'),
      buttonLabel: 'Invite →',
    },
    {
      id: 'domain',
      label: 'set up custom domain',
      description: 'use your own branded domain',
      completed: hasCustomDomain,
      action: () => navigate('/settings/domains'),
      buttonLabel: 'Setup →',
    },
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

  if (isLoading) {
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
      
      <Card variant="grouped" className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>getting started</span>
            <span className="text-body-apple text-primary">
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
                onClick={item.completed ? undefined : item.action}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-apple",
                  !item.completed && "hover:bg-fill-tertiary cursor-pointer group"
                )}
              >
                <div className="flex-shrink-0">
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-system-green" />
                  ) : (
                    <Circle className="h-5 w-5 text-tertiary-label group-hover:text-secondary-label transition-apple" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "text-callout",
                    item.completed ? "text-secondary-label line-through" : "text-label"
                  )}>
                    {item.label}
                  </div>
                  {!item.completed && (
                    <div className="text-footnote text-tertiary-label mt-0.5">
                      {item.description}
                    </div>
                  )}
                </div>

                {!item.completed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                    }}
                    className="flex-shrink-0 text-primary hover:text-primary hover:bg-primary/10"
                  >
                    {item.buttonLabel}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
