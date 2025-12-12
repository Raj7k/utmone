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

  // Simplified 3-item checklist focused on the core "aha" moments
  const items: ChecklistItem[] = [
    {
      id: 'link',
      label: 'create your first link',
      description: 'the foundation of everything you do here',
      completed: hasLinks,
      action: () => navigate('/dashboard/links'),
      buttonLabel: 'create',
    },
    {
      id: 'qr',
      label: 'generate a QR code',
      description: 'perfect for print and physical campaigns',
      completed: hasQrCodes,
      action: () => navigate('/dashboard/qr-codes'),
      buttonLabel: 'generate',
    },
    {
      id: 'analytics',
      label: 'view your analytics',
      description: 'see the impact of your links',
      completed: hasViewedAnalytics,
      action: () => navigate('/dashboard/intelligence'),
      buttonLabel: 'view',
    },
  ];

  // Advanced setup items - shown only after core items are done
  const advancedItems: ChecklistItem[] = [
    {
      id: 'pixel',
      label: 'install tracking pixel',
      description: 'unlock revenue attribution',
      completed: hasInstalledPixel,
      action: () => navigate('/settings?tab=pixel'),
      buttonLabel: 'install',
    },
    {
      id: 'domain',
      label: 'add custom domain',
      description: 'use your branded short URLs',
      completed: hasCustomDomain,
      action: () => navigate('/settings/domains'),
      buttonLabel: 'setup',
    },
    {
      id: 'team',
      label: 'invite your team',
      description: 'collaborate together',
      completed: hasInvitedTeam,
      action: () => navigate('/settings?tab=team&action=invite'),
      buttonLabel: 'invite',
    },
  ];

  const coreCompleted = items.filter(item => item.completed).length;
  const showAdvanced = coreCompleted === items.length;

  const allItems = showAdvanced ? [...items, ...advancedItems] : items;
  const completedCount = allItems.filter(item => item.completed).length;
  const totalCount = allItems.length;
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
          
          {/* Core items */}
          <div className="space-y-2">
            {items.map((item, index) => (
              <div 
                key={item.id}
                onClick={item.completed ? undefined : item.action}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-apple",
                  !item.completed && "hover:bg-fill-tertiary cursor-pointer group",
                  index === 0 && !item.completed && "ring-2 ring-primary/20 bg-primary/5"
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
                    variant={index === 0 ? "default" : "ghost"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                    }}
                    className="flex-shrink-0"
                  >
                    {item.buttonLabel}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Advanced items - shown after core completion */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">advanced setup</p>
              <div className="space-y-2">
                {advancedItems.map((item) => (
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
                        className="flex-shrink-0"
                      >
                        {item.buttonLabel}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
