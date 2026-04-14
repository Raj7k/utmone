import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { notify } from "@/lib/notify";
import { Shield, Key, AlertTriangle, RefreshCw } from "lucide-react";
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function MFAVerify() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isReregistering, setIsReregistering] = useState(false);
  const [domainMismatch, setDomainMismatch] = useState<{
    currentDomain: string;
    registeredDomains: string[];
  } | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const currentDomain = window.location.hostname;

  // Fetch user's security keys to check for domain mismatches
  const { data: authenticators } = useQuery({
    queryKey: ['user-authenticators-mfa'],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('user_authenticators')
        .select('id, device_name, registered_domain')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Check for domain mismatches when authenticators load
  useEffect(() => {
    if (authenticators && authenticators.length > 0) {
      const mismatchedKeys = authenticators.filter(
        auth => auth.registered_domain && auth.registered_domain !== currentDomain
      );
      
      const legacyKeys = authenticators.filter(
        auth => !auth.registered_domain
      );
      
      // If ALL keys are mismatched (no matching or legacy keys), show warning
      const hasMatchingKey = authenticators.some(
        auth => !auth.registered_domain || auth.registered_domain === currentDomain
      );
      
      if (!hasMatchingKey && mismatchedKeys.length > 0) {
        const uniqueDomains = [...new Set(mismatchedKeys.map(k => k.registered_domain))];
        setDomainMismatch({
          currentDomain,
          registeredDomains: uniqueDomains.filter(Boolean) as string[],
        });
      } else {
        setDomainMismatch(null);
      }
    }
  }, [authenticators, currentDomain]);

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth', { replace: true });
        return;
      }

      const { data: adminRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!adminRole) {
        navigate('/dashboard', { replace: true });
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleVerify = async () => {
    setIsVerifying(true);

    try {
      // Step 1: Get authentication options from server
      const { data: options, error: optionsError } = await supabase.functions.invoke(
        'generate-webauthn-authentication',
        { body: {} }
      );

      if (optionsError) throw optionsError;
      if (options?.error) throw new Error(options.error);

      // Step 2: Prompt user to use their security key
      const credential = await startAuthentication({ optionsJSON: options });

      // Step 3: Verify the authentication with server
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
        'verify-webauthn-authentication',
        {
          body: { credential }
        }
      );

      if (verifyError) throw verifyError;
      if (verifyData?.error) throw new Error(verifyData.error);

      // Store session-based MFA verification
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        sessionStorage.setItem('admin_mfa_verified', new Date().toISOString());
        sessionStorage.setItem('admin_mfa_user_id', user.id);
      }

      notify.success("authentication successful", { description: "accessing mission control..." });

      // Redirect to admin dashboard
      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 500);

    } catch (error: any) {
      console.error('MFA verification error:', error);
      
      let description = "could not verify security key";
      if (error.name === 'NotAllowedError') {
        description = "verification cancelled or timed out";
      } else if (error.name === 'InvalidStateError') {
        description = "this security key is not registered";
      } else if (error.message?.includes('RP ID') || error.message?.includes('relying party')) {
        // Domain mismatch error from WebAuthn
        setDomainMismatch({
          currentDomain,
          registeredDomains: ['(unknown - check security settings)'],
        });
        description = "security key was registered on a different domain";
      }

      notify.error("verification failed", { description });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReregister = async () => {
    setIsReregistering(true);

    try {
      // First, delete all existing keys
      const { error: deleteError } = await supabaseFrom('user_authenticators')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all for this user

      if (deleteError) throw deleteError;

      // Get registration options
      const { data: options, error: optionsError } = await supabase.functions.invoke(
        'generate-webauthn-registration',
        { body: {} }
      );

      if (optionsError) throw optionsError;
      if (options?.error) throw new Error(options.error);

      // Register new key
      const credential = await startRegistration({ optionsJSON: options });

      // Verify registration
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
        'verify-webauthn-registration',
        {
          body: {
            credential,
            deviceName: `YubiKey (${currentDomain})`,
          }
        }
      );

      if (verifyError) throw verifyError;
      if (verifyData?.error) throw new Error(verifyData.error);

      notify.success("key registered", { description: `security key registered for ${currentDomain}` });

      // Clear mismatch state and refresh
      setDomainMismatch(null);
      queryClient.invalidateQueries({ queryKey: ['user-authenticators-mfa'] });

      // Try verifying again
      setTimeout(() => handleVerify(), 500);

    } catch (error: any) {
      console.error('Re-registration error:', error);
      notify.error("re-registration failed", { description: error.message || "could not register security key" });
    } finally {
      setIsReregistering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-xl flex items-center justify-center bg-primary/10">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">mission control access</CardTitle>
            <CardDescription className="mt-2">
              insert your security key to access god mode
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Domain Mismatch Warning */}
          {domainMismatch && (
            <Alert className="bg-amber-500/10 border-amber-500/30">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-200">
                <strong>domain mismatch detected.</strong>
                <p className="mt-2 text-sm">
                  your security key was registered on{" "}
                  <code className="px-1 py-0.5 rounded bg-amber-500/20 text-amber-100 text-xs">
                    {domainMismatch.registeredDomains.join(', ')}
                  </code>
                  {" "}but you're accessing from{" "}
                  <code className="px-1 py-0.5 rounded bg-amber-500/20 text-amber-100 text-xs">
                    {domainMismatch.currentDomain}
                  </code>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReregister}
                  disabled={isReregistering}
                  className="mt-3 bg-amber-500/10 border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
                >
                  {isReregistering ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                      registering...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2" />
                      re-register key on {domainMismatch.currentDomain}
                    </>
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="p-4 border rounded-lg text-center bg-primary/5 border-primary/20">
            <Key className="h-12 w-12 mx-auto mb-3 opacity-50 text-primary" />
            <p className="text-sm text-muted-foreground">
              tap your yubikey or use touchid to authenticate
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              domain: <code className="px-1 py-0.5 rounded bg-muted text-xs">{currentDomain}</code>
            </p>
          </div>

          <Button
            onClick={handleVerify}
            disabled={isVerifying || isReregistering}
            className="w-full"
            size="lg"
          >
            {isVerifying ? "waiting for key..." : "verify security key"}
          </Button>

          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              don't have a security key registered?
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
            >
              go to security settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}