import { useEffect, useState, useCallback, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
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

// Cache auth in sessionStorage for instant render
const AUTH_CACHE_KEY = 'utm_auth_cached';
const AUTH_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

function getCachedAuth(): boolean | null {
  try {
    const cached = sessionStorage.getItem(AUTH_CACHE_KEY);
    if (!cached) return null;
    const { isAuth, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > AUTH_CACHE_EXPIRY) {
      sessionStorage.removeItem(AUTH_CACHE_KEY);
      return null;
    }
    return isAuth;
  } catch {
    return null;
  }
}

function setCachedAuth(isAuth: boolean) {
  try {
    sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({
      isAuth,
      timestamp: Date.now()
    }));
  } catch {
    // Ignore storage errors
  }
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Use cached auth for instant render
  const cachedAuth = useRef(getCachedAuth());
  
  const [isLoading, setIsLoading] = useState(cachedAuth.current === null);
  const [isAuthenticated, setIsAuthenticated] = useState(cachedAuth.current ?? false);
  const [authCheckCompleted, setAuthCheckCompleted] = useState(cachedAuth.current !== null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const location = useLocation();

  // Rotate loading messages
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);
    
    return () => clearInterval(interval);
  }, [isLoading]);

  const checkAuth = useCallback(async () => {
    // If we have cached auth, trust it and validate in background
    if (cachedAuth.current !== null) {
      setIsAuthenticated(cachedAuth.current);
      setAuthCheckCompleted(true);
      setIsLoading(false);
    }
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("[ProtectedRoute] Session error:", error.message);
      }
      
      const isAuth = !!session;
      setCachedAuth(isAuth);
      setIsAuthenticated(isAuth);
      setAuthCheckCompleted(true);
      setIsLoading(false);
    } catch (error) {
      console.error("[ProtectedRoute] Auth check failed:", error);
      setCachedAuth(false);
      setIsAuthenticated(false);
      setAuthCheckCompleted(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Reduced timeout - 3 seconds instead of 5
    const timeout = setTimeout(() => {
      if (isMounted && isLoading && !authCheckCompleted) {
        console.warn("[ProtectedRoute] Timeout reached - showing retry UI");
        setHasTimedOut(true);
        setIsLoading(false);
      }
    }, 3000);

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        const isAuth = !!session;
        setCachedAuth(isAuth);
        setIsAuthenticated(isAuth);
        setAuthCheckCompleted(true);
        setIsLoading(false);
        setHasTimedOut(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [checkAuth]);

  // Show loading screen while verifying
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

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

        {/* Rotating Messages */}
        <div className="mt-6 h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-muted-foreground text-sm font-medium"
            >
              {loadingMessages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Show retry UI if timeout occurred before auth check completed
  if (hasTimedOut && !authCheckCompleted) {
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
            onClick={checkAuth}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            try again
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            refresh page
          </Button>
        </div>
      </div>
    );
  }

  // Only redirect if auth check completed AND user is not authenticated
  if (authCheckCompleted && !isAuthenticated) {
    return <Navigate to={`/signup?redirect_to=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Render protected content if authenticated
  if (authCheckCompleted && isAuthenticated) {
    return <>{children}</>;
  }

  // Fallback: Show retry UI instead of blank page (handles edge cases during state transitions)
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-4">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <p className="text-muted-foreground text-sm">
        {hasTimedOut ? "taking longer than expected..." : "verifying..."}
      </p>
      
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={checkAuth}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          try again
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.location.reload()}
        >
          refresh page
        </Button>
      </div>
    </div>
  );
};
