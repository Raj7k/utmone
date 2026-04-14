import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Type declaration for instant skeleton cleanup
declare global {
  interface Window {
    __hideInstantSkeleton?: () => void;
  }
}

export const TableSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);

export const CardSkeleton = () => (
  <Card variant="grouped">
    <CardHeader>
      <Skeleton className="h-6 w-1/3 mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </CardContent>
  </Card>
);

export const MetricSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-32" />
  </div>
);

/**
 * PHASE 15: Ultra-lightweight inline skeleton - ZERO external dependencies
 * Pure CSS animations, no framer-motion import
 */
export const InlineDashboardSkeleton = () => (
  <div className="min-h-screen bg-background flex">
    {/* Sidebar - minimal outline only */}
    <div className="hidden lg:flex w-64 border-r border-border/30 flex-col p-4">
      <div className="h-8 w-32 bg-muted/10 rounded" />
    </div>
    
    {/* Main */}
    <div className="flex-1 flex flex-col">
      {/* Header - minimal */}
      <div className="h-14 border-b border-border/30" />
      
      {/* Content - breathing pulse */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-1 rounded-full bg-primary animate-breathing-pulse" />
        <p className="mt-6 text-muted-foreground text-sm font-mono tracking-wide animate-fade-in">
          loading...
        </p>
        <div className="mt-4 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 animate-dot-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * Lightweight Dashboard Shell - minimal React skeleton for fast Suspense fallback.
 * Hides the instant HTML skeleton when mounted.
 */
export const LightweightDashboardShell = () => {
  // Hide the instant HTML skeleton when this React component mounts
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.__hideInstantSkeleton) {
      window.__hideInstantSkeleton();
    }
  }, []);

  return <InlineDashboardSkeleton />;
};

// Keep DashboardSkeleton as alias for backwards compatibility
export const DashboardSkeleton = LightweightDashboardShell;

/**
 * Marketing page skeleton - matches obsidian theme for instant visual match
 * PHASE 15: Pure CSS, no framer-motion
 */
export const MarketingSkeleton = () => {
  // Hide the instant HTML skeleton when this React fallback mounts
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.__hideInstantSkeleton) {
      window.__hideInstantSkeleton();
    }
  }, []);

  return (
  <div className="dark min-h-screen bg-[#050505]">
    {/* Nav placeholder - matches obsidian glass nav */}
    <div className="sticky top-0 z-50 py-4 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto h-14 rounded-full bg-white/5 animate-pulse" />
    </div>
    {/* Hero placeholder */}
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center space-y-6">
        <div className="h-14 w-[28rem] max-w-full mx-auto bg-white/10 rounded animate-pulse" />
        <div className="h-6 w-72 mx-auto bg-white/5 rounded animate-pulse" />
        <div className="h-12 w-40 mx-auto bg-white/10 rounded-full animate-pulse mt-8" />
      </div>
    </div>
  </div>
  );
};

/**
 * Inline loading indicator - PHASE 15: Pure CSS rotation
 */
export const InlineLoader = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
  };
  
  return (
    <div 
      className={`${sizeClasses[size]} rounded-full border-2 border-primary/30 border-t-primary animate-spin`}
    />
  );
};

/**
 * Full page loading state - PHASE 15: Pure CSS breathing animation
 */
export const PageLoader = ({ message = "loading..." }: { message?: string }) => (
  <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
    {/* Breathing Pulse Bar - Pure CSS */}
    <div className="w-24 h-1 rounded-full bg-primary animate-breathing-pulse" />
    <p className="mt-6 text-muted-foreground text-sm">{message}</p>
  </div>
);
