import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Download, Copy, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TotpSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TotpSetupModal({ open, onOpenChange }: TotpSetupModalProps) {
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const setupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('setup-totp');
      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      setSecret(data.secret);
      const qrUrl = await QRCode.toDataURL(data.qrCodeData);
      setQrCodeUrl(qrUrl);
      setStep('verify');
    },
    onError: (error: any) => {
      toast({
        title: "setup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase.functions.invoke('verify-totp', {
        body: { code }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setRecoveryCodes(data.recoveryCodes);
      setStep('backup');
      queryClient.invalidateQueries({ queryKey: ['mfa-status'] });
      toast({
        title: "2fa enabled",
        description: "save your recovery codes now",
      });
    },
    onError: (error: any) => {
      toast({
        title: "invalid code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (open && step === 'setup') {
      setupMutation.mutate();
    }
  }, [open]);

  useEffect(() => {
    // Auto-submit when 6 digits entered
    if (verificationCode.replace(/\D/g, '').length === 6) {
      const cleanCode = verificationCode.replace(/\D/g, '');
      verifyMutation.mutate(cleanCode);
    }
  }, [verificationCode]);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "copied", description: "secret copied to clipboard" });
  };

  const handleDownloadCodes = () => {
    const text = recoveryCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utm-one-recovery-codes.txt';
    a.click();
    toast({ title: "downloaded", description: "recovery codes saved" });
  };

  const handleComplete = () => {
    onOpenChange(false);
    setStep('setup');
    setVerificationCode('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
            <DialogTitle>enable two-factor authentication</DialogTitle>
          </div>
          <DialogDescription>
            {step === 'setup' && 'scan the qr code with your authenticator app'}
            {step === 'verify' && 'enter the 6-digit code to verify'}
            {step === 'backup' && 'save these recovery codes in a safe place'}
          </DialogDescription>
        </DialogHeader>

        {step === 'setup' && (
          <div className="space-y-4">
            {setupMutation.isPending && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">generating qr code...</p>
              </div>
            )}
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-6">
            {qrCodeUrl && (
              <div className="flex flex-col items-center gap-4">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 border border-border rounded-lg" />
                
                <div className="w-full space-y-2">
                  <Label className="text-xs text-muted-foreground">or enter manually</Label>
                  <div className="flex gap-2">
                    <Input
                      value={secret}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopySecret}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="code">verification code</Label>
              <Input
                id="code"
                placeholder="123-456"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setVerificationCode(value);
                }}
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
                autoComplete="off"
                disabled={verifyMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                paste or type the 6-digit code from your authenticator app
              </p>
            </div>

            {verifyMutation.isPending && (
              <div className="text-center text-sm text-muted-foreground">
                verifying...
              </div>
            )}
          </div>
        )}

        {step === 'backup' && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>critical:</strong> save these codes now. you won't see them again. 
                each code works only once.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
              {recoveryCodes.map((code, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-muted-foreground">{i + 1}.</span>
                  <span>{code}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDownloadCodes}
              >
                <Download className="h-4 w-4 mr-2" />
                download
              </Button>
              <Button
                className="flex-1"
                onClick={handleComplete}
              >
                i've saved them
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
