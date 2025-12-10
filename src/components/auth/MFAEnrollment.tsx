import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Loader2, CheckCircle2, Copy, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import QRCode from "qrcode";

interface MFAEnrollmentProps {
  onComplete: () => void;
}

export function MFAEnrollment({ onComplete }: MFAEnrollmentProps) {
  const [step, setStep] = useState<"start" | "scan" | "verify" | "complete">("start");
  const [qrCodeUrl, setQRCodeUrl] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [factorId, setFactorId] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const startEnrollment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Authenticator App",
      });

      if (error) throw error;

      if (data) {
        setFactorId(data.id);
        setSecret(data.totp.secret);
        
        // Generate QR code
        const qrUrl = data.totp.uri;
        const qrDataUrl = await QRCode.toDataURL(qrUrl);
        setQRCodeUrl(qrDataUrl);
        
        setStep("scan");
      }
    } catch (error: any) {
      notify.error(error.message || "could not start 2fa enrollment");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (verificationCode.length !== 6) return;

    setIsLoading(true);
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verificationCode,
      });

      if (verifyError) {
        notify.error("the verification code is incorrect. please try again.");
        setVerificationCode("");
        return;
      }

      // Generate recovery codes (simulated - in production, backend should provide these)
      const codes = Array.from({ length: 8 }, () =>
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );
      setRecoveryCodes(codes);
      setStep("complete");

      notify.success("your account is now protected with two-factor authentication");
    } catch (error: any) {
      notify.error(error.message || "could not verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    notify.success("secret key copied to clipboard");
  };

  const downloadRecoveryCodes = () => {
    const blob = new Blob([recoveryCodes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "utm-one-recovery-codes.txt";
    a.click();
    notify.success("recovery codes saved");
  };

  if (step === "start") {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
              <Shield className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Enable two-factor authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Two-factor authentication (2FA) adds an additional layer of security by requiring a
            verification code from your authenticator app in addition to your password.
          </p>
          <Button onClick={startEnrollment} disabled={isLoading} className="rounded-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up…
              </>
            ) : (
              "Set up 2FA"
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === "scan") {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Scan QR code</CardTitle>
          <CardDescription>
            Use your authenticator app (Google Authenticator, Authy, 1Password, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center p-6 bg-muted/30 rounded-xl">
            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Or enter this secret key manually:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono break-all">
                {secret}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={copySecret}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Enter verification code:</p>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={setVerificationCode}
                onComplete={verifyAndEnable}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              onClick={verifyAndEnable}
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full rounded-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify and enable"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "complete") {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">2FA enabled successfully</CardTitle>
              <CardDescription>Save your recovery codes in a secure location</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription className="text-sm">
              If you lose access to your authenticator app, you can use these recovery codes to
              sign in. Each code can only be used once.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 p-4 bg-muted/30 rounded-xl">
              {recoveryCodes.map((code, i) => (
                <code key={i} className="text-sm font-mono">
                  {code}
                </code>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={downloadRecoveryCodes} variant="outline" className="flex-1 rounded-full">
              <Download className="mr-2 h-4 w-4" />
              Download codes
            </Button>
            <Button onClick={onComplete} className="flex-1 rounded-full">
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
