import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface DashboardLoadingFallbackProps {
  /** Context-aware loading message */
  context?: string;
  /** Show skeleton layout matching the page */
  variant?: "default" | "sales" | "links" | "events" | "targeting";
  /** Called when loading takes too long and data is not available */
  isLoading?: boolean;
}

const LOADING_MESSAGES = [
  "loading workspace...",
  "fetching your data...",
  "almost there...",
];

export const DashboardLoadingFallback = ({
  context = "data",
  variant = "default",
  isLoading = true,
}: DashboardLoadingFallbackProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showSlowMessage, setShowSlowMessage] = useState(false);
  const [showRefresh, setShowRefresh] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    // Cycle through messages
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    // Show "still loading" after 3 seconds
    const slowTimer = setTimeout(() => setShowSlowMessage(true), 3000);

    // Show refresh button after 5 seconds
    const refreshTimer = setTimeout(() => setShowRefresh(true), 5000);

    return () => {
      clearInterval(messageTimer);
      clearTimeout(slowTimer);
      clearTimeout(refreshTimer);
    };
  }, [isLoading]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      {/* Breathing Pulse Animation - Pure CSS */}
      <div className="relative mb-6 animate-fade-in">
        <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        
        {/* Pulse ring - CSS only */}
        <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping" />
      </div>

      {/* Loading Message */}
      <p
        key={showSlowMessage ? "slow" : messageIndex}
        className="text-sm text-muted-foreground text-center animate-fade-in"
      >
        {showSlowMessage ? `still loading ${context}...` : LOADING_MESSAGES[messageIndex]}
      </p>

      {/* Progress Dots - CSS only */}
      <div className="flex gap-1 mt-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              messageIndex === i 
                ? "bg-primary scale-125" 
                : "bg-primary/40"
            }`}
          />
        ))}
      </div>

      {/* Refresh Button - appears after 5 seconds */}
      {showRefresh && (
        <div className="mt-6 animate-fade-in">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-3 w-3" />
            refresh page
          </Button>
        </div>
      )}

      {/* Optional Skeleton Preview - shows layout user will see */}
      {variant !== "default" && showSlowMessage && (
        <div className="mt-8 w-full max-w-2xl animate-fade-in opacity-30">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
            <Skeleton className="h-40" />
          </div>
        </div>
      )}
    </div>
  );
};
