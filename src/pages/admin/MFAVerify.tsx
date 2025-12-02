import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Key } from "lucide-react";
import { startAuthentication } from '@simplewebauthn/browser';
import type { AuthenticationResponseJSON } from '@simplewebauthn/browser';

export default function MFAVerify() {
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      const credential = await startAuthentication(options);

      // Step 3: Verify the authentication with server
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
        'verify-webauthn-authentication',
        {
          body: { credential }
        }
      );

      if (verifyError) throw verifyError;
      if (verifyData?.error) throw new Error(verifyData.error);

      toast({
        title: "authentication successful",
        description: "accessing mission control...",
      });

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
      }

      toast({
        title: "verification failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
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
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <Key className="h-12 w-12 mx-auto mb-3 text-primary opacity-50" />
            <p className="text-sm text-muted-foreground">
              tap your yubikey or use touchid to authenticate
            </p>
          </div>

          <Button
            onClick={handleVerify}
            disabled={isVerifying}
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
