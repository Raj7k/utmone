import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ObsidianMarketingLayout } from "@/components/layout/ObsidianMarketingLayout";

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
        notify.error("no invite token provided");
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
          notify.error("this invite link is no longer valid");
          navigate("/");
          return;
        }

        if (new Date(data.expires_at) < new Date()) {
          notify.error("this invite link has expired");
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
  }, [token, navigate, setValue]);

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
      notify.success("your account has been created successfully");

      // Redirect to onboarding after a short delay
      setTimeout(() => {
        navigate("/onboarding");
      }, 2000);
    } catch (error: any) {
      console.error("Error claiming access:", error);
      notify.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <ObsidianMarketingLayout showFloatingNav={false}>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">validating invite...</div>
        </div>
      </ObsidianMarketingLayout>
    );
  }

  if (claimed) {
    return (
      <ObsidianMarketingLayout showFloatingNav={false}>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl p-8 bg-card border border-border">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground">welcome to utm.one</h2>
              <p className="text-muted-foreground mt-2">redirecting to onboarding...</p>
            </div>
          </div>
        </div>
      </ObsidianMarketingLayout>
    );
  }

  return (
    <ObsidianMarketingLayout showFloatingNav={false}>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-card border border-border">
          <div className="text-center p-6 pb-4">
            <div className="mx-auto mb-4 flex items-center gap-2 justify-center">
              <img 
                src="/src/assets/utm-one-logo.svg" 
                alt="utm.one" 
                className="h-8 w-auto"
              />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">claim your early access</h2>
            <p className="text-muted-foreground mt-2">create your password to get started</p>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">email</Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  className="bg-muted/30 border-border text-foreground"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="at least 8 characters"
                  className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="re-enter your password"
                  className="bg-muted/30 border-border text-foreground placeholder:text-muted-foreground"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                <Lock className="h-4 w-4 mr-2" />
                {isLoading ? "creating account..." : "claim access"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ObsidianMarketingLayout>
  );
};

export default ClaimAccess;
