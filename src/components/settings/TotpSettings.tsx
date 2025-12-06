import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMfaStatus } from "@/hooks/useMfaStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Smartphone, Key, CheckCircle2, AlertTriangle } from "lucide-react";
import { TotpSetupModal } from "@/components/auth/TotpSetupModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function TotpSettings() {
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const { data: mfaStatus, isLoading } = useMfaStatus();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const disableMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('mfa_settings')
        .update({ is_enabled: false })
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mfa-status'] });
      toast({
        title: "2fa disabled",
        description: "two-factor authentication has been turned off",
      });
      setDisableDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "failed to disable 2fa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>two-factor authentication</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>two-factor authentication (2fa)</CardTitle>
                <CardDescription className="mt-1">
                  protect your account with totp-based verification
                </CardDescription>
              </div>
            </div>
            {mfaStatus?.isEnabled && (
              <Badge variant="default" className="ml-auto">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                enabled
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!mfaStatus?.isEnabled ? (
            <>
              <Alert>
                <AlertDescription>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <div>
                      <strong>recommended for all users</strong>
                      <p className="text-sm mt-1">
                        2fa adds an extra layer of security beyond passwords. 
                        even if someone gets your password, they can't access your account.
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
                  <Smartphone className="h-5 w-5 mt-0.5 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium">authenticator app required</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      works with google authenticator, authy, 1password, or any totp app
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
                  <Key className="h-5 w-5 mt-0.5 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium">recovery codes</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      you'll get 10 backup codes to access your account if you lose your device
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setSetupModalOpen(true)}
                  className="w-full"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  enable 2fa
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">status</h4>
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  two-factor authentication is protecting your account
                </p>
                {mfaStatus.lastVerifiedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    last verified: {new Date(mfaStatus.lastVerifiedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">recovery codes</h4>
                  <Badge variant={mfaStatus.hasBackupCodes ? "secondary" : "destructive"}>
                    {mfaStatus.hasBackupCodes ? 
                      `${(mfaStatus as any).codesRemaining || 10} remaining` : 
                      'none'
                    }
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  use these if you lose access to your authenticator app
                </p>
              </div>

              <Alert variant="destructive">
                <AlertDescription>
                  <strong>warning:</strong> disabling 2fa will make your account less secure
                </AlertDescription>
              </Alert>

              <Button
                variant="destructive"
                onClick={() => setDisableDialogOpen(true)}
                className="w-full"
              >
                disable 2fa
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <TotpSetupModal open={setupModalOpen} onOpenChange={setSetupModalOpen} />

      <AlertDialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>disable two-factor authentication?</AlertDialogTitle>
            <AlertDialogDescription>
              your account will be less secure without 2fa. anyone with your password 
              will be able to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => disableMutation.mutate()}
              className="bg-destructive hover:bg-destructive/90"
            >
              {disableMutation.isPending ? 'disabling...' : 'disable 2fa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
