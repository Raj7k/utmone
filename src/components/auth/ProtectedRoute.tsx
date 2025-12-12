import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("verifying security...");
  const location = useLocation();
  const hasChecked = useRef(false);
  const retryCount = useRef(0);

  useEffect(() => {
    let isMounted = true;

    // Safety timeout - force end loading after 5 seconds (increased from 3)
    const timeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn("[ProtectedRoute] Timeout reached - forcing loading to end");
        setIsLoading(false);
      }
    }, 5000);

    // Show extended loading message after 2 seconds
    const extendedTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        setLoadingMessage("still connecting...");
      }
    }, 2000);

    const checkAuth = async () => {
      // Prevent duplicate checks
      if (hasChecked.current) return;
      hasChecked.current = true;

      const attemptAuth = async (): Promise<boolean> => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("[ProtectedRoute] Session error:", error.message);
            // Retry once on error
            if (retryCount.current < 1) {
              retryCount.current++;
              await new Promise(r => setTimeout(r, 500));
              return attemptAuth();
            }
            return false;
          }
          
          return !!session;
        } catch (error) {
          console.error("[ProtectedRoute] Auth check failed:", error);
          // Retry once on exception
          if (retryCount.current < 1) {
            retryCount.current++;
            await new Promise(r => setTimeout(r, 500));
            return attemptAuth();
          }
          return false;
        }
      };

      const authenticated = await attemptAuth();
      
      if (isMounted) {
        setIsAuthenticated(authenticated);
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes - defer async work to prevent deadlock
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        if (isMounted) {
          setIsAuthenticated(!!session);
          // Clear loading if still loading when auth state changes
          if (isLoading) {
            setIsLoading(false);
          }
        }
      }, 0);
    });

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      clearTimeout(extendedTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // Show full-screen loading skeleton while verifying
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground font-medium">
            {loadingMessage}
          </p>
        </div>
      </div>
    );
  }

  // Redirect to signup with return path if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={`/signup?redirect_to=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Render protected content
  return <>{children}</>;
};
