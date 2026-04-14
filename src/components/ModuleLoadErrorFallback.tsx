import { RefreshCw, WifiOff, Wifi } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Fallback UI shown when a lazy-loaded module fails to load after all retries.
 * NEVER auto-reloads — the user must explicitly click to retry.
 */
export function ModuleLoadErrorFallback() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Hide the HTML skeleton so users see this fallback, not a blank screen
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).__hideInstantSkeleton) {
      (window as any).__hideInstantSkeleton();
    }
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full rounded-xl border border-border bg-card p-6 text-center space-y-4">
        {/* Network status indicator */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
            isOnline ? "bg-muted" : "bg-destructive/10"
          }`}
        >
          {isOnline ? (
            <RefreshCw className="h-6 w-6 text-muted-foreground" />
          ) : (
            <WifiOff className="h-6 w-6 text-destructive" />
          )}
        </div>

        <h2 className="text-xl font-semibold text-foreground">
          {isOnline ? "Page failed to load" : "You're offline"}
        </h2>

        <p className="text-muted-foreground text-sm">
          {isOnline
            ? "There was a problem loading this page. Please try refreshing."
            : "Please check your internet connection and try again."}
        </p>

        {/* Network status badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            isOnline
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {isOnline ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          {isOnline ? "Online" : "Offline"}
        </div>

        <button
          onClick={handleRefresh}
          disabled={!isOnline}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          {isOnline ? "Refresh Page" : "Waiting for connection..."}
        </button>
      </div>
    </div>
  );
}
