import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
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
import { Shield, Key, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { startRegistration } from '@simplewebauthn/browser';
import type { RegistrationResponseJSON } from '@simplewebauthn/browser';

export const SecurityKeyManager = () => {
  const [deviceName, setDeviceName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: authenticators, isLoading } = useQuery({
    queryKey: ['user-authenticators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_authenticators')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (name: string) => {
      try {
        // Step 1: Get registration options from server
        const { data: options, error: optionsError } = await supabase.functions.invoke(
          'generate-webauthn-registration',
          { body: {} }
        );

        if (optionsError) throw optionsError;

        // Check for domain mismatch
        if (options?.rp?.id !== window.location.hostname) {
          throw new Error(`Domain mismatch: RP ID "${options?.rp?.id}" !== hostname "${window.location.hostname}"`);
        }

        // Step 2: Prompt user to use their security key
        const credential = await startRegistration({ optionsJSON: options });

        // Step 3: Verify the registration with server
        const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
          'verify-webauthn-registration',
          {
            body: {
              credential,
              deviceName: name,
            }
          }
        );

        if (verifyError) throw verifyError;
        if (verifyData?.error) throw new Error(verifyData.error);

        return verifyData;
      } catch (error: any) {
        // Provide specific error messages based on WebAuthn error types
        if (error.name === 'NotAllowedError') {
          throw new Error('Registration cancelled or timed out. Please try again.');
        } else if (error.name === 'SecurityError') {
          throw new Error('Security error: This feature requires HTTPS or localhost.');
        } else if (error.name === 'InvalidStateError') {
          throw new Error('This security key is already registered.');
        } else if (error.message?.includes('publickey-credentials-create')) {
          throw new Error('WebAuthn not enabled. Try accessing directly (not in iframe).');
        } else if (error.message?.includes('relying party')) {
          throw new Error('Domain mismatch. Please contact support.');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-authenticators'] });
      setDeviceName("");
      setIsRegistering(false);
      toast({
        title: "security key registered",
        description: "your hardware key has been added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "registration failed",
        description: error.message || "could not register security key",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_authenticators')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-authenticators'] });
      setDeleteKeyId(null);
      toast({
        title: "security key removed",
        description: "the hardware key has been deleted",
      });
    },
    onError: (error: any) => {
      toast({
        title: "deletion failed",
        description: error.message || "could not remove security key",
        variant: "destructive",
      });
    },
  });

  const handleRegister = () => {
    if (!deviceName.trim()) {
      toast({
        title: "device name required",
        description: "please enter a name for your security key",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate(deviceName.trim());
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
          <div>
            <CardTitle>hardware security keys</CardTitle>
            <CardDescription className="mt-1">
              add yubikey or passkey for phishing-proof admin access
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Registration Form */}
        <div 
          className="space-y-4 p-4 rounded-lg"
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)' 
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>register new key</h3>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                connect your yubikey or use built-in passkey
              </p>
            </div>
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isRegistering ? "cancel" : "add key"}
            </Button>
          </div>

          {isRegistering && (
            <div className="space-y-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="space-y-2">
                <Label htmlFor="device-name">device name</Label>
                <Input
                  id="device-name"
                  placeholder="e.g., YubiKey 5C, TouchID, Windows Hello"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  disabled={registerMutation.isPending}
                />
              </div>
              <Button
                onClick={handleRegister}
                disabled={registerMutation.isPending || !deviceName.trim()}
                className="w-full"
                variant="halo"
              >
                {registerMutation.isPending ? "touch your key..." : "register security key"}
              </Button>
            </div>
          )}
        </div>

        {/* Registered Keys List */}
        <div className="space-y-3">
          <h3 className="font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>registered keys</h3>
          {isLoading ? (
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>loading keys...</p>
          ) : authenticators && authenticators.length > 0 ? (
            <div className="space-y-2">
              {authenticators.map((auth) => (
                <div
                  key={auth.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ 
                    background: 'rgba(24,24,27,0.6)', 
                    border: '1px solid rgba(255,255,255,0.1)' 
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Key className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
                    <div>
                      <div className="font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>{auth.device_name}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        registered {format(new Date(auth.created_at), "MMM d, yyyy")}
                        {auth.last_used_at && (
                          <> • last used {format(new Date(auth.last_used_at), "MMM d, yyyy")}</>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="glass-ghost"
                    size="sm"
                    onClick={() => setDeleteKeyId(auth.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>no security keys registered</p>
              <p className="text-sm mt-1">add your first hardware key for admin access</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div 
          className="p-4 rounded-lg"
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.15)' 
          }}
        >
          <h4 className="font-medium text-sm mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>why hardware keys?</h4>
          <ul className="text-xs space-y-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <li>• <strong>phishing-proof</strong>: can't be stolen remotely</li>
            <li>• <strong>portable</strong>: works from any location</li>
            <li>• <strong>fast</strong>: just tap your key—no codes to type</li>
          </ul>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteKeyId} onOpenChange={(open) => !open && setDeleteKeyId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>remove security key?</AlertDialogTitle>
              <AlertDialogDescription>
                this hardware key will no longer work for admin authentication.
                you can re-register it anytime.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteKeyId && deleteMutation.mutate(deleteKeyId)}
                className="bg-destructive hover:bg-destructive/90"
              >
                remove key
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
