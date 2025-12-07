import { useState, useEffect } from "react";
import { X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureHintProps {
  id: string;
  title: string;
  description: string;
  className?: string;
}

export const FeatureHint = ({ id, title, description, className }: FeatureHintProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if hint was already dismissed
    const dismissed = localStorage.getItem(`hint-dismissed-${id}`);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`hint-dismissed-${id}`, "true");
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "relative rounded-xl p-4 bg-muted/50 border border-border",
        "animate-in fade-in slide-in-from-top-2 duration-300",
        className
      )}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-muted"
        aria-label="Dismiss hint"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-muted">
          <Info className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1 text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
