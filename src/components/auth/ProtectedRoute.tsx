import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSession } from "@/contexts/AppSessionContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const loadingMessages = [
  "verifying security...",
  "loading your workspace...",
  "almost there..."
];

/**
 * PHASE 16: Check localStorage directly for instant decision
 * Trust cached auth for immediate render, validate in background
 */
function hasCachedAuth(): boolean {
  try {
    // Check window cache first (set by index.html script)
    if ((window as { __CACHED_USER__?: { id: string } }).__CACHED_USER__?.id) {
      return true;
    }
    
    const sessionCache = localStorage.getItem('utm_session_cache');
    if (!sessionCache) return false;
    
    const { user, timestamp } = JSON.parse(sessionCache);
    // 15 min expiry
    if (Date.now() - timestamp > 15 * 60 * 1000) return false;
    
    return !!user;
  } catch {
    return false;
  }
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isReady, isAuthenticated, error, refresh } = useAppSession();
  const location = useLocation();
  
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // PHASE 16: Check cache synchronously - trust for instant render
  const cachedAuth = hasCachedAuth();

  // ============================================
  // ALL HOOKS MUST BE CALLED BEFORE ANY RETURNS
  // ============================================

  // Rotate loading messages only when actually loading
  useEffect(() => {
    if (cachedAuth || (isReady && isAuthenticated)) return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);
    
    return () => clearInterval(interval);
  }, [cachedAuth, isReady, isAuthenticated]);

  // Timeout - 5 seconds max wait (only if no cache)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isReady && !hasTimedOut && !cachedAuth) {
      timeoutRef.current = setTimeout(() => {
        console.warn("[ProtectedRoute] Timeout - showing retry");
        setHasTimedOut(true);
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isReady, hasTimedOut, cachedAuth]);

  // ============================================
  // CONDITIONAL RETURNS - AFTER ALL HOOKS
  // ============================================

  // PHASE 16: INSTANT RENDER if any cache exists - validate in background
  if (cachedAuth) {
    return <>{children}</>;
  }

  // Also render if context says ready and authenticated
  if (isReady && isAuthenticated) {
    return <>{children}</>;
  }

  // Show loading only if no cache and still initializing - PURE CSS
  if (!isReady && !hasTimedOut && !error) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* PHASE 16: Pure CSS breathing animation */}
        <div className="w-24 h-1 rounded-full bg-primary animate-breathing-pulse" />

        <div className="mt-6 h-5">
          <p
            key={messageIndex}
            className="text-muted-foreground text-sm font-medium animate-fade-in"
          >
            {loadingMessages[messageIndex]}
          </p>
        </div>
      </div>
    );
  }

  // Timeout or error - show retry
  if (hasTimedOut || error) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-4">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        <p className="text-muted-foreground text-sm">taking longer than expected...</p>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refresh()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            try again
          </Button>
        </div>
      </div>
    );
  }

  // Not authenticated after check - redirect to signup
  if (isReady && !isAuthenticated) {
    return <Navigate to={`/signup?redirect_to=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Fallback loading - Pure CSS
  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="w-24 h-1 rounded-full bg-primary animate-breathing-pulse" />
    </div>
  );
};
