import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const loadingMessages = [
  "verifying security...",
  "loading your workspace...",
  "almost there..."
];

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const location = useLocation();
  const hasChecked = useRef(false);
  const retryCount = useRef(0);

  // Rotate loading messages
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);
    
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    let isMounted = true;

    // Safety timeout - force end loading after 5 seconds
    const timeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn("[ProtectedRoute] Timeout reached - forcing loading to end");
        setIsLoading(false);
      }
    }, 5000);

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
      subscription.unsubscribe();
    };
  }, []);

  // Show beautiful loading screen while verifying
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

  // Redirect to signup with return path if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={`/signup?redirect_to=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Render protected content
  return <>{children}</>;
};
