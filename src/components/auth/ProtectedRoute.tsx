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
  const location = useLocation();
  const hasChecked = useRef(false);

  useEffect(() => {
    let isMounted = true;
    
    console.log("[ProtectedRoute] Component mounted");

    // Safety timeout - force end loading after 3 seconds
    const timeout = setTimeout(() => {
      console.warn("[ProtectedRoute] Timeout reached - forcing loading to end");
      if (isMounted && isLoading) {
        setIsLoading(false);
      }
    }, 3000);

    const checkAuth = async () => {
      // Prevent duplicate checks
      if (hasChecked.current) {
        console.log("[ProtectedRoute] Already checked, skipping");
        return;
      }
      hasChecked.current = true;
      
      console.log("[ProtectedRoute] Checking session...");
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log("[ProtectedRoute] Session result:", !!session, error ? `Error: ${error.message}` : "");
        
        if (!isMounted) {
          console.log("[ProtectedRoute] Component unmounted, skipping state update");
          return;
        }
        
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("[ProtectedRoute] Auth check failed:", error);
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          console.log("[ProtectedRoute] Setting isLoading to false");
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    // Listen for auth changes - defer async work to prevent deadlock
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("[ProtectedRoute] Auth state changed:", _event, !!session);
      setTimeout(() => {
        if (isMounted) {
          setIsAuthenticated(!!session);
        }
      }, 0);
    });

    return () => {
      console.log("[ProtectedRoute] Component unmounting");
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  console.log("[ProtectedRoute] Render - isLoading:", isLoading, "isAuthenticated:", isAuthenticated);

  // Show full-screen loading skeleton while verifying
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground font-medium">
            verifying security...
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
