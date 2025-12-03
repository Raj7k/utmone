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
    <div className="dark min-h-screen flex items-center justify-center p-4" style={{ background: '#050505' }}>
      <Card className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-white">🔒 password protected link</CardTitle>
          <CardDescription className="text-white/60">
            this link is password protected. please enter the password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {hint && (
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-white/60">
                  <span className="font-medium text-white">Hint:</span> {hint}
                </p>
              </div>
            )}
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? "verifying..." : "unlock link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
