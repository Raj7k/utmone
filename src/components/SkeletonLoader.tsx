import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-64 border-r border-border/50 flex-col p-4 gap-3">
        <div className="h-8 w-32 bg-muted/20 rounded animate-pulse" />
        <div className="h-px bg-border/50 my-2" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 bg-muted/10 rounded animate-pulse" />
        ))}
      </div>
      
      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header skeleton */}
        <div className="h-14 border-b border-border/50 flex items-center px-4 gap-4">
          <div className="h-8 w-8 bg-muted/20 rounded animate-pulse lg:hidden" />
          <div className="h-6 w-48 bg-muted/20 rounded animate-pulse" />
          <div className="flex-1" />
          <div className="h-8 w-8 bg-muted/20 rounded-full animate-pulse" />
        </div>
        
        {/* Content skeleton */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Title */}
            <div className="h-8 w-64 bg-muted/20 rounded animate-pulse" />
            
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted/10 rounded-lg border border-border/50 animate-pulse" />
              ))}
            </div>
            
            {/* Table skeleton */}
            <div className="bg-muted/5 rounded-lg border border-border/50 overflow-hidden">
              <div className="h-12 bg-muted/10 border-b border-border/50" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 border-b border-border/50 last:border-0 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep DashboardSkeleton as alias for backwards compatibility
export const DashboardSkeleton = LightweightDashboardShell;

/**
 * Marketing page skeleton - matches obsidian theme for instant visual match
 */
export const MarketingSkeleton = () => (
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

/**
 * Inline loading indicator
 */
export const InlineLoader = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
  };
  
  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full border-2 border-primary/30 border-t-primary`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

/**
 * Full page loading state with breathing animation
 */
export const PageLoader = ({ message = "loading..." }: { message?: string }) => (
  <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
    {/* Breathing Pulse Bar */}
    <motion.div
      className="w-24 h-1 rounded-full bg-primary"
      animate={{
        opacity: [0.3, 1, 0.3],
        scaleX: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    />
    <p className="mt-6 text-muted-foreground text-sm">{message}</p>
  </div>
);
