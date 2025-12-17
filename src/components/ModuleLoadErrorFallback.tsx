import { RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ModuleLoadErrorFallback() {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
            <RefreshCw className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Page failed to load
          </h2>
          <p className="text-muted-foreground text-sm">
            There was a problem loading this page. This usually resolves with a refresh.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleRefresh} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
            <Button onClick={handleClearCacheAndRefresh} variant="outline" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cache & Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
