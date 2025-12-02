import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Key } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";

export default function TotpVerification() {
  const [code, setCode] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Auto-submit when 6 digits (TOTP) or 8 chars (recovery) entered
    const cleanCode = code.replace(/\D/g, '');
    if (!isRecoveryMode && cleanCode.length === 6) {
      handleVerify();
    } else if (isRecoveryMode && code.length === 8) {
      handleVerify();
    }
  }, [code, isRecoveryMode]);

  const handleVerify = async () => {
    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-totp-login', {
        body: {
          code: isRecoveryMode ? code : code.replace(/\D/g, ''),
          isRecoveryCode: isRecoveryMode
        }
      });

      if (error) throw error;

      if (data.usedRecoveryCode) {
        toast({
          title: "recovery code used",
          description: "you have " + (9 - (data.codesRemaining || 0)) + " codes remaining",
          variant: "default",
        });
      }

      // Redirect to intended destination or dashboard
      const returnTo = searchParams.get('returnTo') || '/dashboard';
      navigate(returnTo);

      toast({
        title: "verification successful",
        description: "you're now logged in",
      });
    } catch (error: any) {
      toast({
        title: "verification failed",
        description: error.message || "invalid code",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>two-factor authentication</CardTitle>
            <CardDescription>
              {isRecoveryMode 
                ? 'enter one of your recovery codes'
                : 'enter the code from your authenticator app'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code">
                {isRecoveryMode ? 'recovery code' : 'verification code'}
              </Label>
              <Input
                id="code"
                placeholder={isRecoveryMode ? "XXXXXXXX" : "123-456"}
                value={code}
                onChange={(e) => {
                  if (isRecoveryMode) {
                    setCode(e.target.value.toUpperCase());
                  } else {
                    const value = e.target.value.replace(/\D/g, '');
                    setCode(value);
                  }
                }}
                maxLength={isRecoveryMode ? 8 : 6}
                className="text-center text-2xl tracking-widest font-mono"
                autoComplete="off"
                autoFocus
                disabled={isVerifying}
              />
              <p className="text-xs text-center text-muted-foreground">
                {isRecoveryMode 
                  ? 'use one of your backup codes'
                  : 'code will be submitted automatically'
                }
              </p>
            </div>

            {isVerifying && (
              <div className="text-center text-sm text-muted-foreground">
                verifying...
              </div>
            )}

            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setIsRecoveryMode(!isRecoveryMode);
                  setCode('');
                }}
              >
                <Key className="h-4 w-4 mr-2" />
                {isRecoveryMode ? 'use authenticator app' : 'use recovery code'}
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => navigate('/settings?tab=security')}
              >
                manage security settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
