import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chrome, X, Zap, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DISMISSED_KEY = "chrome-extension-promo-dismissed";

export const ChromeExtensionPromoTile = () => {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    setIsDismissed(dismissed === "true");
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <Card className="relative overflow-hidden border-white/20 bg-gradient-to-r from-white/5 via-background to-white/10">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10 flex-shrink-0">
            <Chrome className="h-6 w-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground">create links faster</h3>
              <div className="flex items-center gap-1 text-xs text-white bg-white/10 px-2 py-0.5 rounded-full">
                <Zap className="h-3 w-3" />
                new
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              get the chrome extension to create links in under 5 seconds without leaving your tab
            </p>
          </div>

          <Button 
            onClick={() => navigate("/settings?tab=extension")} 
            size="sm" 
            className="flex-shrink-0 gap-1"
          >
            get extension
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
