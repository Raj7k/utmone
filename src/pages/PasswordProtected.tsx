import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function PasswordProtected() {
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const linkId = searchParams.get('link');
  const hint = searchParams.get('hint');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      // Verify password via edge function
      const { data, error } = await supabase.functions.invoke('verify-link-password', {
        body: { linkId, password }
      });

      if (error || !data?.valid) {
        toast({
          title: "Incorrect password",
          description: "Please try again",
          variant: "destructive"
        });
      } else {
        // Redirect to final URL
        window.location.href = data.finalUrl;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify password",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grouped-background p-4">
      <Card variant="grouped" className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-system-blue/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-system-blue" />
          </div>
          <CardTitle className="text-title-2">🔒 Password Protected Link</CardTitle>
          <CardDescription className="text-body-apple text-secondary-label">
            This link is password protected. Please enter the password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {hint && (
              <div className="p-3 bg-fill-tertiary rounded-lg">
                <p className="text-footnote text-secondary-label">
                  <span className="font-medium text-label">Hint:</span> {hint}
                </p>
              </div>
            )}
            <Input
              variant="system"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
            <Button variant="system" type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? "verifying..." : "unlock link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
