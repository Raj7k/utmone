import { useState } from "react";
import { CheckCircle2, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OnboardingData {
  hasLinks: boolean;
  hasQrCodes?: boolean;
  hasViewedAnalytics?: boolean;
  hasInvitedTeam?: boolean;
  hasCustomDomain?: boolean;
  hasInstalledPixel?: boolean;
}

interface CompactOnboardingProgressProps {
  onboarding?: OnboardingData;
  isLoading?: boolean;
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  href: string;
}

export const CompactOnboardingProgress = ({ onboarding, isLoading = false }: CompactOnboardingProgressProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasLinks = onboarding?.hasLinks ?? false;
  const hasQrCodes = onboarding?.hasQrCodes ?? false;
  const hasViewedAnalytics = onboarding?.hasViewedAnalytics ?? false;

  const items: ChecklistItem[] = [
    { id: 'link', label: 'create link', completed: hasLinks, href: '/dashboard/links' },
    { id: 'qr', label: 'generate QR', completed: hasQrCodes, href: '/dashboard/qr-codes' },
    { id: 'analytics', label: 'view analytics', completed: hasViewedAnalytics, href: '/dashboard/intelligence' },
  ];

  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const isComplete = completedCount === totalCount;
  const remainingItems = items.filter(i => !i.completed);
  const nextItem = remainingItems[0];

  // Hide completely when done
  if (isComplete) return null;

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Compact strip - always visible */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">getting started</span>
            
            {/* Progress dots */}
            <div className="flex gap-1.5 ml-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    item.completed ? "bg-green-500" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
            
            {/* Quick action for next item */}
            {nextItem && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(nextItem.href)}
                className="text-primary hover:text-primary/80"
              >
                {nextItem.label}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                {isExpanded ? "hide" : "details"}
                <ChevronDown className={cn(
                  "h-4 w-4 ml-1 transition-transform",
                  isExpanded && "rotate-180"
                )} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        {/* Expanded details */}
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-2 border-t border-border space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.completed && navigate(item.href)}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  !item.completed && "hover:bg-muted/50 cursor-pointer"
                )}
              >
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                )}
                <span className={cn(
                  "text-sm",
                  item.completed ? "text-muted-foreground line-through" : "text-foreground"
                )}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
