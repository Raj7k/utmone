import { useState } from "react";
import { RevenueStreamLoader } from "@/components/ui/RevenueStreamLoader";
import { Button } from "@/components/ui/button";

/**
 * Demo page to test the Revenue Stream Loader
 * Access this at /loader-demo
 */
const LoaderDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  const triggerLoader = (duration: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, duration);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-4">
        <h1 className="font-serif text-4xl text-foreground">Revenue Stream Loader Demo</h1>
        <p className="text-muted-foreground max-w-md">
          Test the cinematic loading screen. Click any button to trigger the loader with different durations.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={() => triggerLoader(3000)}
          variant="outline"
          className="min-w-32"
        >
          3 seconds
        </Button>
        <Button 
          onClick={() => triggerLoader(5000)}
          variant="outline"
          className="min-w-32"
        >
          5 seconds
        </Button>
        <Button 
          onClick={() => triggerLoader(8000)}
          variant="outline"
          className="min-w-32"
        >
          8 seconds
        </Button>
        <Button 
          onClick={() => triggerLoader(15000)}
          variant="outline"
          className="min-w-32"
        >
          15 seconds
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Times loaded: {loadCount}
      </p>

      <RevenueStreamLoader 
        isLoading={isLoading}
        onComplete={() => setLoadCount(prev => prev + 1)}
        minDisplayTime={3000}
      />
    </div>
  );
};

export default LoaderDemo;
