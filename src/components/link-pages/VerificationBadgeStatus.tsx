import { useState } from "react";
import { format } from "date-fns";
import { 
  useVerificationStatus, 
  type VerificationStatus 
} from "@/hooks/useVerificationStatus";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  BadgeCheck, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Sparkles,
  Lock
} from "lucide-react";
import { VerificationRequestModal } from "./VerificationRequestModal";
import { cn } from "@/lib/utils";

interface VerificationBadgeStatusProps {
  workspaceId: string;
  showBadge: boolean;
  onShowBadgeChange: (show: boolean) => void;
}

const statusConfig: Record<VerificationStatus, {
  icon: typeof BadgeCheck;
  color: string;
  bgColor: string;
  label: string;
  description: string;
}> = {
  not_applied: {
    icon: AlertCircle,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    label: "Not Verified",
    description: "Apply for verification to get the verified badge on your Link Page.",
  },
  pending: {
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    label: "Pending Review",
    description: "Your application is in queue. This usually takes 2-5 business days.",
  },
  under_review: {
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: "Under Review",
    description: "Our team is currently reviewing your application.",
  },
  approved: {
    icon: BadgeCheck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    label: "Verified",
    description: "Your account is verified. The badge will appear on your Link Page.",
  },
  rejected: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    label: "Rejected",
    description: "Your application was not approved.",
  },
};

export function VerificationBadgeStatus({
  workspaceId,
  showBadge,
  onShowBadgeChange,
}: VerificationBadgeStatusProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = useVerificationStatus(workspaceId);
  const { allowed: hasFeatureAccess, requiredPlan } = useFeatureAccess('verified_badge');

  const status = data?.status || 'not_applied';
  const request = data?.request;
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  // Check if user can reapply (30 days after rejection)
  const canReapply = status === 'rejected' && request?.reviewed_at
    ? new Date(request.reviewed_at).getTime() + 30 * 24 * 60 * 60 * 1000 < Date.now()
    : false;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-20 bg-muted rounded" />
      </div>
    );
  }

  // Feature gated - show upgrade prompt
  if (!hasFeatureAccess) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Verified Badge</Label>
        </div>
        <div className="p-4 rounded-lg border border-border bg-muted/30">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Upgrade to {requiredPlan} Plan</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                The verified badge feature is available on Growth plans and above.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BadgeCheck className="h-4 w-4 text-primary" />
        <Label className="text-sm font-medium">Verified Badge</Label>
      </div>

      <div className={cn("p-4 rounded-lg border border-border", config.bgColor)}>
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-full", config.bgColor)}>
            <StatusIcon className={cn("h-4 w-4", config.color)} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={cn("text-xs", config.color)}>
                {config.label}
              </Badge>
              {request?.created_at && status !== 'approved' && (
                <span className="text-xs text-muted-foreground">
                  Applied {format(new Date(request.created_at), "MMM d, yyyy")}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>

            {/* Show rejection reason if rejected */}
            {status === 'rejected' && request?.rejection_reason && (
              <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/20">
                <p className="text-xs text-destructive">
                  <strong>Reason:</strong> {request.rejection_reason}
                </p>
              </div>
            )}

            {/* Show badge toggle if approved */}
            {status === 'approved' && (
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <Label className="text-sm cursor-pointer">
                  Show verified badge on page
                </Label>
                <Switch 
                  checked={showBadge} 
                  onCheckedChange={onShowBadgeChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-3">
          {(status === 'not_applied' || canReapply) && (
            <Button 
              size="sm" 
              className="w-full gap-2"
              onClick={() => setModalOpen(true)}
            >
              <Sparkles className="h-4 w-4" />
              Apply for Verification
            </Button>
          )}
          {status === 'rejected' && !canReapply && request?.reviewed_at && (
            <p className="text-xs text-center text-muted-foreground">
              You can reapply after {format(
                new Date(new Date(request.reviewed_at).getTime() + 30 * 24 * 60 * 60 * 1000),
                "MMM d, yyyy"
              )}
            </p>
          )}
        </div>
      </div>

      <VerificationRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}
