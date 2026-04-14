import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useToast } from "@/hooks/use-toast";
import { Shield, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLoadingScreen } from "@/components/loading/AuthLoadingScreen";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { ObsidianMarketingLayout } from "@/components/layout/ObsidianMarketingLayout";

/**
 * Dedicated Super Admin Login Page
 * Security-focused, minimal design for admin-only access
 * Route: /mc (Mission Control)
 */
const AdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const hasNavigated = useRef(false);

  useEffect(() => {
    // Check if already logged in as admin
    const checkAdminSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Verify admin role
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .maybeSingle();

          if (roles) {
            hasNavigated.current = true;
            navigate("/admin");
          } else {
            // Not an admin - redirect to regular auth
            toast({
              title: "Access Denied",
              description: "Admin credentials required",
              variant: "destructive",
            });
            navigate("/auth");
          }
        }
      } catch (error) {
        console.error("Admin session check failed:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkAdminSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (hasNavigated.current) return;
      
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticating(true);
        hasNavigated.current = true;
        
        try {
          // Verify admin role
          const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .maybeSingle();

          if (rolesError || !roles) {
            // Not an admin
            await supabase.auth.signOut();
            hasNavigated.current = false;
            toast({
              title: "Access Denied",
              description: "Admin credentials required for Mission Control",
              variant: "destructive",
            });
            setIsAuthenticating(false);
            return;
          }

      // Check for MFA requirement (TOTP or WebAuthn)
      const { data: mfaSettings } = await supabaseFrom('mfa_settings')
        .select('is_enabled')
        .eq('user_id', session.user.id)
        .maybeSingle();

      const { data: webauthnKeys } = await supabaseFrom('user_authenticators')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      const hasTOTP = mfaSettings?.is_enabled || false;
      const hasWebAuthn = (webauthnKeys?.length || 0) > 0;

      if (hasTOTP || hasWebAuthn) {
        // Redirect to 2FA verification with method preference
        const method = hasWebAuthn ? 'webauthn' : 'totp';
        navigate(`/auth/verify-2fa?returnTo=${encodeURIComponent('/admin')}&method=${method}`);
        return;
      }

          toast({
            title: "Access granted",
            description: "Welcome to Mission Control",
          });
          
          navigate("/admin");
        } catch (err) {
          console.error("Admin auth error:", err);
          hasNavigated.current = false;
          toast({
            title: "Authentication failed",
            description: "Please try again",
            variant: "destructive",
          });
          setIsAuthenticating(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Authentication failed",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Verify admin role immediately
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (rolesError || !roles) {
        // Not an admin - sign out immediately
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "Admin credentials required",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check for MFA requirement (TOTP or WebAuthn)
      const { data: mfaSettings } = await supabaseFrom('mfa_settings')
        .select('is_enabled')
        .eq('user_id', data.user.id)
        .maybeSingle();

      const { data: webauthnKeys } = await supabaseFrom('user_authenticators')
        .select('id')
        .eq('user_id', data.user.id)
        .limit(1);

      const hasTOTP = mfaSettings?.is_enabled || false;
      const hasWebAuthn = (webauthnKeys?.length || 0) > 0;

      if (hasTOTP || hasWebAuthn) {
        // Redirect to 2FA verification with method preference
        const method = hasWebAuthn ? 'webauthn' : 'totp';
        navigate(`/auth/verify-2fa?returnTo=${encodeURIComponent('/admin')}&method=${method}`);
        return;
      }

      // Success
      toast({
        title: "Access granted",
        description: "Entering Mission Control...",
      });
      // onAuthStateChange will handle navigation
    } catch (error) {
      console.error("Admin sign in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticating) {
    return <AuthLoadingScreen />;
  }

  return (
    <ObsidianMarketingLayout showFloatingNav={false}>
      <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          {/* Security warning banner */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3"
          >
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-amber-200">
                Secure Admin Access
              </p>
              <p className="text-xs text-amber-300/70">
                All login attempts are monitored and logged. Unauthorized access is prohibited.
              </p>
            </div>
          </motion.div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted border border-border mb-2">
              <Shield className="h-8 w-8 text-foreground" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">Mission Control</h1>
            <p className="text-muted-foreground text-lg">Administrative portal access</p>
          </div>

          <Card className="border-border bg-card shadow-2xl rounded-2xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-display font-bold text-foreground">Admin Sign In</CardTitle>
              <CardDescription className="text-muted-foreground">Email and password required</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-6 space-y-6">
              <form onSubmit={handleAdminSignIn} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="admin-email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@utm.one"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 rounded-xl border-border bg-muted/30 text-foreground placeholder:text-muted-foreground text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <PasswordInput
                    id="admin-password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-border bg-muted/30 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-xl text-base font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating…" : "Enter Mission Control"}
                </Button>
              </form>

              <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
                Admin accounts are granted, not created
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            All administrative actions are logged and audited
          </p>
        </motion.div>
      </div>
    </ObsidianMarketingLayout>
  );
};

export default AdminAuth;
