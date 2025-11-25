import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TransparencyCard = () => {
  const navigate = useNavigate();

  return (
    <Card variant="grouped" className="hover:shadow-lg transition-apple">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-system-green" />
          <CardTitle>What We Track</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-system-green mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-label">Click counts</span>
              <span className="text-secondary-label"> (anonymous)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-system-green mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-label">Device type</span>
              <span className="text-secondary-label"> (mobile/desktop)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-system-green mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-label">Country-level location</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-system-green mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-label">Referrer source</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-separator space-y-2">
          <p className="text-sm font-medium text-label">We never track:</p>
          <div className="flex items-start gap-2">
            <X className="h-5 w-5 text-system-red mt-0.5 flex-shrink-0" />
            <span className="text-sm text-secondary-label">Personal identities</span>
          </div>
          <div className="flex items-start gap-2">
            <X className="h-5 w-5 text-system-red mt-0.5 flex-shrink-0" />
            <span className="text-sm text-secondary-label">Browsing history</span>
          </div>
          <div className="flex items-start gap-2">
            <X className="h-5 w-5 text-system-red mt-0.5 flex-shrink-0" />
            <span className="text-sm text-secondary-label">Keystrokes or personal data</span>
          </div>
        </div>

        <Button 
          variant="system-secondary" 
          size="sm" 
          className="w-full"
          onClick={() => navigate("/settings?tab=privacy")}
        >
          Manage Tracking Preferences
        </Button>
      </CardContent>
    </Card>
  );
};
