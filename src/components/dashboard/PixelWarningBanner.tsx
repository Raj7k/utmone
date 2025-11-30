import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PixelWarningBanner = () => {
  const navigate = useNavigate();

  return (
    <Alert className="bg-system-orange/10 border-system-orange/20">
      <AlertCircle className="h-4 w-4 text-system-orange" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <div>
          <p className="text-body-apple text-label font-medium">
            tracking pixel not installed
          </p>
          <p className="text-caption-1 text-secondary-label mt-1">
            you won't be able to track conversions until you install the tracking pixel on your website
          </p>
        </div>
        <Button
          variant="system"
          size="sm"
          onClick={() => navigate('/settings?tab=pixel')}
          className="flex-shrink-0"
        >
          set up now →
        </Button>
      </AlertDescription>
    </Alert>
  );
};
