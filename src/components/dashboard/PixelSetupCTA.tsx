import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio, X, ChevronRight, AlertTriangle, BarChart3, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export const PixelSetupCTA = () => {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(() => {
    const dismissed = localStorage.getItem('pixel-cta-dismissed');
    if (!dismissed) return false;
    // Check if 24 hours have passed
    const dismissedAt = new Date(dismissed).getTime();
    const now = Date.now();
    const hoursPassed = (now - dismissedAt) / (1000 * 60 * 60);
    return hoursPassed < 24;
  });

  const handleDismiss = () => {
    localStorage.setItem('pixel-cta-dismissed', new Date().toISOString());
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <Card className="relative overflow-hidden border-system-orange/30 bg-gradient-to-br from-system-orange/5 to-transparent">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-fill-tertiary transition-apple text-tertiary-label hover:text-secondary-label"
        aria-label="dismiss for now"
      >
        <X className="h-4 w-4" />
      </button>

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Icon */}
          <div className="flex-shrink-0 p-3 rounded-xl bg-system-orange/10 border border-system-orange/20">
            <Radio className="h-8 w-8 text-system-orange" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-system-orange" />
                <span className="text-caption-1 font-medium text-system-orange uppercase tracking-wide">
                  action required
                </span>
              </div>
              <h3 className="text-title-3 font-semibold text-label">
                install the tracking pixel to unlock full analytics
              </h3>
              <p className="text-body-apple text-secondary-label">
                without the pixel, we can only show you basic click counts. install it once to unlock:
              </p>
            </div>

            {/* Benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-callout text-secondary-label">
                <BarChart3 className="h-4 w-4 text-system-green" />
                <span>click sources & referrers</span>
              </div>
              <div className="flex items-center gap-2 text-callout text-secondary-label">
                <Users className="h-4 w-4 text-system-blue" />
                <span>device & location data</span>
              </div>
              <div className="flex items-center gap-2 text-callout text-secondary-label">
                <DollarSign className="h-4 w-4 text-system-purple" />
                <span>revenue attribution</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => navigate('/settings?tab=pixel')}
                className="bg-system-orange hover:bg-system-orange/90 text-white"
              >
                set up in 2 minutes
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleDismiss}
                className="text-tertiary-label hover:text-secondary-label"
              >
                remind me later
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
