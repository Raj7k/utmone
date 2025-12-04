import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon, Lock, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const claimAccessSchema = z.object({
  email: z.string().email("please enter a valid email"),
  password: z.string().min(8, "password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "passwords don't match",
  path: ["confirmPassword"],
});

type ClaimAccessForm = z.infer<typeof claimAccessSchema>;

const ClaimAccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [inviteData, setInviteData] = useState<any>(null);
  const [claimed, setClaimed] = useState(false);

  const token = searchParams.get("token");

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ClaimAccessForm>({
    resolver: zodResolver(claimAccessSchema),
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast({
          title: "Invalid invite",
          description: "No invite token provided",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("early_access_invites")
          .select("*")
          .eq("invite_token", token)
          .is("claimed_at", null)
          .single();

        if (error || !data) {
          toast({
            title: "Invalid or expired invite",
            description: "This invite link is no longer valid",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        if (new Date(data.expires_at) < new Date()) {
          toast({
            title: "Invite expired",
            description: "This invite link has expired",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setInviteData(data);
        setValue("email", data.email);
      } catch (error) {
        console.error("Error validating token:", error);
        navigate("/");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, navigate, toast, setValue]);

  const onSubmit = async (formData: ClaimAccessForm) => {
    setIsLoading(true);

    try {
      // Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Failed to create account");

      // Update invite as claimed
      const { error: claimError } = await supabase
        .from("early_access_invites")
        .update({ claimed_at: new Date().toISOString() })
        .eq("invite_token", token);

      if (claimError) throw claimError;

      // Update user profile with access level
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          access_level: inviteData.access_level,
          onboarding_completed: false,
        })
        .eq("id", authData.user.id);

      if (profileError) throw profileError;

      setClaimed(true);
      
      toast({
        title: "Access claimed!",
        description: "Your account has been created successfully",
      });

      // Redirect to onboarding after a short delay
      setTimeout(() => {
        navigate("/onboarding");
      }, 2000);
    } catch (error: any) {
      console.error("Error claiming access:", error);
      toast({
        title: "Error claiming access",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050505' }}>
        <div className="animate-pulse text-white/60">validating invite...</div>
      </div>
    );
  }

  if (claimed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050505' }}>
        <div className="w-full max-w-md rounded-2xl p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/10">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <CheckCircle2 className="h-6 w-6" style={{ color: 'rgba(34,197,94,0.8)' }} />
            </div>
            <h2 className="text-xl font-display font-bold text-white">welcome to utm.one</h2>
            <p className="text-white/60 mt-2">redirecting to onboarding...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#050505' }}>
      <div className="w-full max-w-md rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10">
        <div className="text-center p-6 pb-4">
          <div className="mx-auto mb-4 flex items-center gap-2 justify-center">
            <img 
              src="/src/assets/utm-one-logo.svg" 
              alt="utm.one" 
              className="h-8 w-auto"
            />
          </div>
          <h2 className="text-xl font-display font-bold text-white">claim your early access</h2>
          <p className="text-white/60 mt-2">create your password to get started</p>
        </div>
        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">email</Label>
              <Input
                id="email"
                type="email"
                disabled
                className="bg-white/5 border-white/10 text-white"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm" style={{ color: 'rgba(239,68,68,0.8)' }}>{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">password</Label>
              <Input
                id="password"
                type="password"
                placeholder="at least 8 characters"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm" style={{ color: 'rgba(239,68,68,0.8)' }}>{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/80">confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="re-enter your password"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm" style={{ color: 'rgba(239,68,68,0.8)' }}>{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-white/90"
              disabled={isLoading}
            >
              <Lock className="h-4 w-4 mr-2" />
              {isLoading ? "creating account..." : "claim access"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClaimAccess;
