import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { usePlanLimits } from "@/hooks/usePlanLimits";

export const UsageLimitBanner = () => {
  const navigate = useNavigate();
  const { data: limits, isLoading } = usePlanLimits();

  if (isLoading || !limits) return null;

  const linkUsagePercent = 
    limits.limits.monthlyLinks === 'unlimited' 
      ? 0 
      : (limits.currentUsage.linksThisMonth / Number(limits.limits.monthlyLinks)) * 100;

  const showWarning = linkUsagePercent >= 80;

  if (!showWarning) return null;

  return (
    <Alert className="mb-6">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>approaching plan limit</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-small-text">
          you've used {limits.currentUsage.linksThisMonth} of {limits.limits.monthlyLinks} links this month
        </p>
        <Progress value={linkUsagePercent} className="h-2" />
        <Button size="sm" onClick={() => navigate('/pricing')}>
          upgrade plan
        </Button>
      </AlertDescription>
    </Alert>
  );
};
