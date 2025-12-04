import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MFAEnrollment } from "@/components/auth/MFAEnrollment";
import type { Factor } from "@supabase/supabase-js";

export function SecuritySettings() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const { toast } = useToast();

  const loadMFAFactors = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) throw error;
      
      setFactors(data?.totp || []);
    } catch (error: any) {
      toast({
        title: "Error loading 2FA status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMFAFactors();
  }, []);

  const disableMFA = async (factorId: string) => {
    setIsDisabling(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      
      if (error) throw error;

      toast({
        title: "2FA disabled",
        description: "Two-factor authentication has been removed from your account.",
      });
      
      await loadMFAFactors();
    } catch (error: any) {
      toast({
        title: "Failed to disable 2FA",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDisabling(false);
    }
  };

  const handleEnrollmentComplete = () => {
    setShowEnrollment(false);
    loadMFAFactors();
  };

  const hasMFA = factors.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Security</h2>
        <p className="text-muted-foreground">
          Manage your account security and authentication settings
        </p>
      </div>

      {/* 2FA Status Card */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                hasMFA ? "bg-green-500/10" : "bg-yellow-500/10"
              }`}>
                <Shield className={`h-5 w-5 ${hasMFA ? "text-green-600" : "text-yellow-600"}`} />
              </div>
              <div>
                <CardTitle className="text-xl">Two-factor authentication</CardTitle>
                <CardDescription>
                  {hasMFA
                    ? "Your account is protected with 2FA"
                    : "Add an extra layer of security to your account"}
                </CardDescription>
              </div>
            </div>
            {hasMFA ? (
              <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3" />
                Enabled
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 bg-yellow-500/10 text-yellow-700 border-yellow-200">
                <AlertCircle className="h-3 w-3" />
                Disabled
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasMFA && !showEnrollment && (
            <>
              <Alert className="bg-yellow-500/5 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  We strongly recommend enabling 2FA to protect your account from unauthorized access.
                </AlertDescription>
              </Alert>
              <Button onClick={() => setShowEnrollment(true)} className="rounded-full">
                Enable two-factor authentication
              </Button>
            </>
          )}

          {showEnrollment && (
            <MFAEnrollment onComplete={handleEnrollmentComplete} />
          )}

          {hasMFA && !showEnrollment && (
            <div className="space-y-4">
              <Alert className="bg-green-500/5 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Two-factor authentication is active. You'll need to enter a verification code
                  from your authenticator app when signing in.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <p className="text-sm font-medium">Active authenticators:</p>
                {factors.map((factor) => (
                  <div
                    key={factor.id}
                    className="flex items-center justify-between p-4 border rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
                      <div>
                        <p className="font-medium">{factor.friendly_name || "Authenticator App"}</p>
                        <p className="text-sm text-muted-foreground">
                          Added {new Date(factor.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => disableMFA(factor.id)}
                      disabled={isDisabling}
                      className="rounded-full"
                    >
                      {isDisabling ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Disabling…
                        </>
                      ) : (
                        "Disable"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Password</CardTitle>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="rounded-full">
            Change password
          </Button>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Active sessions</CardTitle>
          <CardDescription>Manage devices where you're currently signed in</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This device (current session)
          </p>
          <Button variant="outline" className="rounded-full">
            Sign out all other devices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
