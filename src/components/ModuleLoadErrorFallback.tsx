import { useState, useEffect } from "react";
import { RefreshCw, Trash2, WifiOff, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ModuleLoadErrorFallback() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [countdown, setCountdown] = useState(5);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);

  // Track network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setAutoRetryEnabled(false); // Disable auto-retry when offline
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-retry countdown when online
  useEffect(() => {
    if (!isOnline || !autoRetryEnabled) return;

    if (countdown <= 0) {
      handleRefresh();
      return;
    }

    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, isOnline, autoRetryEnabled]);

  const handleRefresh = () => {
    sessionStorage.removeItem('moduleReloadAttempted');
    const timestamp = Date.now();
    window.location.href = window.location.pathname + '?_t=' + timestamp;
  };

  const handleClearCacheAndRefresh = async () => {
    // Clear all browser caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // Tell service worker to clear its cache
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage('clearCache');
    }
    
    // Clear session flag and reload with cache bust
    sessionStorage.removeItem('moduleReloadAttempted');
    const timestamp = Date.now();
    window.location.href = window.location.pathname + '?_t=' + timestamp;
  };

  const cancelAutoRetry = () => {
    setAutoRetryEnabled(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-4">
          {/* Network status indicator */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
            isOnline ? 'bg-muted' : 'bg-destructive/10'
          }`}>
            {isOnline ? (
              <RefreshCw className="h-6 w-6 text-muted-foreground" />
            ) : (
              <WifiOff className="h-6 w-6 text-destructive" />
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-foreground">
            {isOnline ? 'Page failed to load' : 'You\'re offline'}
          </h2>
          
          <p className="text-muted-foreground text-sm">
            {isOnline 
              ? 'There was a problem loading this page. This usually resolves with a refresh.'
              : 'Please check your internet connection and try again.'
            }
          </p>

          {/* Network status badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            isOnline 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
              : 'bg-destructive/10 text-destructive'
          }`}>
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </div>

          {/* Auto-retry countdown */}
          {isOnline && autoRetryEnabled && countdown > 0 && (
            <p className="text-xs text-muted-foreground">
              Auto-retrying in {countdown}s...{' '}
              <button 
                onClick={cancelAutoRetry}
                className="underline hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Button onClick={handleRefresh} className="w-full" disabled={!isOnline}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {isOnline ? 'Refresh Page' : 'Waiting for connection...'}
            </Button>
            <Button onClick={handleClearCacheAndRefresh} variant="outline" className="w-full" disabled={!isOnline}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cache & Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
