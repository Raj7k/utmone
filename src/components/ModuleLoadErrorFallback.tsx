import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ModuleLoadErrorFallback() {
  const handleRefresh = () => {
    // Clear the reload flag and do a hard refresh with cache bust
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
          <Button onClick={handleRefresh} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
