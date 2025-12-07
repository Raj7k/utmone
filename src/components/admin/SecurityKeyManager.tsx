import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Shield, Key, Trash2, Plus, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { startRegistration } from '@simplewebauthn/browser';

export const SecurityKeyManager = () => {
  const [deviceName, setDeviceName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const [reregisterKeyName, setReregisterKeyName] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const currentDomain = window.location.hostname;

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

  // Check if any keys have domain mismatch
  const hasMismatchedKeys = authenticators?.some(
    auth => auth.registered_domain && auth.registered_domain !== currentDomain
  );

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
      setReregisterKeyName(null);
      toast({
        title: "security key registered",
        description: `key registered for domain: ${currentDomain}`,
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
      
      // If we were re-registering, start the registration flow
      if (reregisterKeyName) {
        setDeviceName(reregisterKeyName);
        setIsRegistering(true);
        // Small delay to ensure UI updates
        setTimeout(() => {
          registerMutation.mutate(reregisterKeyName);
        }, 100);
      }
    },
    onError: (error: any) => {
      setReregisterKeyName(null);
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

  const handleReregister = (keyId: string, keyName: string) => {
    setReregisterKeyName(keyName);
    setDeleteKeyId(keyId);
  };

  const isDomainMatch = (registeredDomain: string | null) => {
    if (!registeredDomain) return true; // Legacy keys without domain info
    return registeredDomain === currentDomain;
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
        {/* Domain Mismatch Warning */}
        {hasMismatchedKeys && (
          <Alert className="bg-amber-500/10 border-amber-500/30">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-200">
              <strong>Domain mismatch detected.</strong> Some security keys were registered on a different domain 
              and won't work here. Use the "re-register" button to fix them for{" "}
              <code className="px-1 py-0.5 rounded bg-amber-500/20 text-amber-100 text-xs">{currentDomain}</code>
            </AlertDescription>
          </Alert>
        )}

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
                keys will be bound to: <code className="px-1 py-0.5 rounded bg-white/10 text-xs">{currentDomain}</code>
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
              {authenticators.map((auth) => {
                const domainMatch = isDomainMatch(auth.registered_domain);
                
                return (
                  <div
                    key={auth.id}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ 
                      background: domainMatch ? 'rgba(24,24,27,0.6)' : 'rgba(245,158,11,0.1)',
                      border: `1px solid ${domainMatch ? 'rgba(255,255,255,0.1)' : 'rgba(245,158,11,0.3)'}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {domainMatch ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            {auth.device_name}
                          </span>
                          {auth.registered_domain && (
                            <Badge 
                              variant={domainMatch ? "outline" : "destructive"}
                              className={domainMatch 
                                ? "text-xs bg-transparent border-white/20 text-white/60" 
                                : "text-xs bg-amber-500/20 border-amber-500/40 text-amber-200"
                              }
                            >
                              {auth.registered_domain}
                            </Badge>
                          )}
                          {!auth.registered_domain && (
                            <Badge variant="outline" className="text-xs bg-transparent border-white/20 text-white/40">
                              legacy
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          registered {format(new Date(auth.created_at), "MMM d, yyyy")}
                          {auth.last_used_at && (
                            <> • last used {format(new Date(auth.last_used_at), "MMM d, yyyy")}</>
                          )}
                        </div>
                        {!domainMatch && (
                          <div className="text-xs text-amber-300 mt-1">
                            won't work on current domain
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!domainMatch && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReregister(auth.id, auth.device_name)}
                          className="bg-amber-500/10 border-amber-500/30 text-amber-200 hover:bg-amber-500/20 hover:text-amber-100"
                        >
                          <RefreshCw className="h-3 w-3 mr-1.5" />
                          re-register
                        </Button>
                      )}
                      <Button
                        variant="glass-ghost"
                        size="sm"
                        onClick={() => setDeleteKeyId(auth.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
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
            <li>• <strong>domain-bound</strong>: keys are locked to specific domains for security</li>
          </ul>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteKeyId} onOpenChange={(open) => {
          if (!open) {
            setDeleteKeyId(null);
            setReregisterKeyName(null);
          }
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {reregisterKeyName ? "re-register security key?" : "remove security key?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {reregisterKeyName ? (
                  <>
                    This will remove the existing key and immediately prompt you to register 
                    "{reregisterKeyName}" on the current domain ({currentDomain}).
                    <br /><br />
                    <strong>Have your security key ready.</strong>
                  </>
                ) : (
                  <>
                    This hardware key will no longer work for admin authentication.
                    You can re-register it anytime.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteKeyId && deleteMutation.mutate(deleteKeyId)}
                className={reregisterKeyName 
                  ? "bg-primary hover:bg-primary/90" 
                  : "bg-destructive hover:bg-destructive/90"
                }
              >
                {reregisterKeyName ? "continue" : "remove key"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
