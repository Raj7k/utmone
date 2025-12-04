import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MFAChallengeProps {
  factorId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MFAChallenge({ factorId, onSuccess, onCancel }: MFAChallengeProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (code.length !== 6) return;

    setIsVerifying(true);
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });

      if (verifyError) {
        toast({
          title: "Invalid code",
          description: "The code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
        setCode("");
      } else {
        toast({
          title: "Authenticated",
          description: "Two-factor authentication successful.",
        });
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl rounded-2xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <Shield className="h-8 w-8" style={{ color: 'rgba(255,255,255,0.8)' }} />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-display font-bold">Two-factor authentication</CardTitle>
            <CardDescription className="text-base">
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              onComplete={handleVerify}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="h-14 w-12 text-lg" />
                <InputOTPSlot index={1} className="h-14 w-12 text-lg" />
                <InputOTPSlot index={2} className="h-14 w-12 text-lg" />
                <InputOTPSlot index={3} className="h-14 w-12 text-lg" />
                <InputOTPSlot index={4} className="h-14 w-12 text-lg" />
                <InputOTPSlot index={5} className="h-14 w-12 text-lg" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleVerify}
              disabled={isVerifying || code.length !== 6}
              className="w-full rounded-full h-12"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify"
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={isVerifying}
              className="w-full rounded-full"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Lost access to your authenticator? Contact support for help.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
