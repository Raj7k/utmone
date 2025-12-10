import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SecurityKeyDomainWarningProps {
  registeredDomain: string | null;
  currentDomain: string;
  onReRegister: () => void;
}

/**
 * Warning component displayed when WebAuthn security key was registered
 * on a different domain than the current one.
 * 
 * WebAuthn credentials are bound to the Relying Party ID (domain),
 * so a key registered on utm.one cannot be used on lovableproject.com.
 */
export function SecurityKeyDomainWarning({ 
  registeredDomain, 
  currentDomain,
  onReRegister 
}: SecurityKeyDomainWarningProps) {
  if (!registeredDomain || registeredDomain === currentDomain) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Security Key Domain Mismatch</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          Your security key was registered on <strong>{registeredDomain}</strong> but you're 
          currently on <strong>{currentDomain}</strong>.
        </p>
        <p className="text-sm opacity-90">
          WebAuthn credentials are domain-bound for security. To use your YubiKey on this domain, 
          you'll need to re-register it.
        </p>
        <div className="flex gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onReRegister}
            className="bg-background"
          >
            Re-register Security Key
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
