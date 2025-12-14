import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CleanAuthLayout } from "@/components/layout/CleanAuthLayout";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if we have a valid session (user clicked the reset link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          title: "Invalid reset link",
          description: "Please request a new password reset link.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password updated",
      description: "Your password has been reset successfully.",
    });

    navigate("/dashboard");
  };

  return (
    <CleanAuthLayout>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <UtmOneLogo size="xl" className="justify-center" />
          <h1 className="text-3xl font-display font-bold text-white">reset password</h1>
          <p className="text-zinc-400">enter your new password below</p>
        </div>

        <Card className="bg-zinc-900/50 border-white/10 shadow-xl rounded-2xl backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-white">new password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="minimum 6 characters"
                  required
                  className="h-14 rounded-xl border text-base bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-white">confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="re-enter password"
                  required
                  className="h-14 rounded-xl border text-base bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500"
                />
              </div>

              <Button type="submit" className="w-full h-14 rounded-xl text-base font-semibold bg-white text-black hover:bg-zinc-200" disabled={loading}>
                {loading ? "updating..." : "reset password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </CleanAuthLayout>
  );
}