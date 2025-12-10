import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
  isWarning?: boolean;
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
    hasInstalledPixel,
    isLoading,
  } = useOnboardingProgress();

  const items: ChecklistItem[] = [
    {
      id: 'link',
      label: 'create your first link',
      description: 'start shortening and tracking your URLs',
      completed: hasLinks,
      action: () => navigate('/dashboard/links'),
      buttonLabel: 'create',
    },
    {
      id: 'qr',
      label: 'generate a QR code',
      description: 'add a branded QR code to your link',
      completed: hasQrCodes,
      action: () => navigate('/dashboard/qr-codes'),
      buttonLabel: 'generate',
    },
    {
      id: 'analytics',
      label: 'view analytics',
      description: 'see how your links are performing',
      completed: hasViewedAnalytics,
      action: () => navigate('/dashboard/analytics'),
      buttonLabel: 'view',
    },
    {
      id: 'team',
      label: 'invite team member',
      description: 'collaborate with your team',
      completed: hasInvitedTeam,
      action: () => navigate('/settings?tab=team&action=invite'),
      buttonLabel: 'invite',
    },
    {
      id: 'domain',
      label: 'set up custom domain',
      description: 'use your own branded domain',
      completed: hasCustomDomain,
      action: () => navigate('/settings/domains'),
      buttonLabel: 'setup',
    },
    {
      id: 'pixel',
      label: 'unlock attribution tracking',
      description: 'recommended for revenue insights',
      completed: hasInstalledPixel,
      action: () => navigate('/settings?tab=pixel'),
      buttonLabel: 'enable',
      isWarning: false, // Softened - no longer scary warning
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
    return (
      <Card variant="grouped" className="animate-pulse border-primary/20">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-2 w-full" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
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
            <span className="text-body-apple text-muted-foreground">
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
                  !item.completed && "hover:bg-fill-tertiary cursor-pointer group",
                  item.isWarning && !item.completed && "border-l-4 border-system-orange bg-system-orange/5"
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
                    className="flex-shrink-0 hover:bg-accent text-foreground"
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
