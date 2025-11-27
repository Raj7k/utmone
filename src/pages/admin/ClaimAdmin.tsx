import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Shield } from "lucide-react";

export default function ClaimAdmin() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast({
        title: "Code required",
        description: "Please enter the admin claim code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to claim admin access",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      // Call edge function to claim admin
      const { data, error } = await supabase.functions.invoke('claim-admin-access', {
        body: {
          code: code.trim(),
          userId: user.id
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Admin access granted",
          description: "You now have admin access to the platform",
        });
        
        // Redirect to admin dashboard
        navigate('/admin');
      } else {
        throw new Error(data?.error || 'Failed to claim admin access');
      }
    } catch (error: any) {
      console.error('Error claiming admin:', error);
      toast({
        title: "Failed to claim admin",
        description: error.message === 'Invalid code' 
          ? "Invalid code. Please check and try again."
          : "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">Claim admin access</CardTitle>
            <CardDescription className="mt-2">
              Enter the secret code to grant yourself admin privileges
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleClaim} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Secret code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="code"
                  type="password"
                  placeholder="Enter admin claim code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? "Verifying..." : "Claim admin access"}
            </Button>

            <div className="text-center pt-4 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                disabled={isLoading}
              >
                Back to dashboard
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
