import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { notify } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinimalAuthLayout } from "@/components/layout/MinimalAuthLayout";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";

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
  const [userExists, setUserExists] = useState(false);

  const token = searchParams.get("token");

  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<ClaimAccessForm>({
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
        // Check if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        const { data, error } = await supabaseFrom('early_access_invites')
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

        // If user is authenticated, automatically claim the invite
        if (session?.user) {
          setIsLoading(true);
          
          const { error: claimError } = await supabase.functions.invoke('claim-invite', {
            body: {
              token,
              user_id: session.user.id,
              user_email: session.user.email,
            },
          });

          if (claimError) {
            console.error("Error claiming invite:", claimError);
            notify.error("failed to claim invite");
            setIsLoading(false);
            navigate("/dashboard");
            return;
          }

          // Update profile with access level
          await supabaseFrom('profiles')
            .update({ 
              access_level: data.access_level,
              plan_tier: data.plan_tier || 'growth',
            })
            .eq("id", session.user.id);

          notify.success("invite claimed successfully");
          navigate("/dashboard");
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
    setUserExists(false);

    try {
      // Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      // Check for "user already registered" error
      if (signUpError) {
        if (signUpError.message?.toLowerCase().includes('already registered') ||
            signUpError.message?.toLowerCase().includes('already exists') ||
            signUpError.message?.toLowerCase().includes('user already')) {
          setUserExists(true);
          setIsLoading(false);
          return;
        }
        throw signUpError;
      }
      
      if (!authData.user) throw new Error("Failed to create account");

      // Use edge function to claim invite (bypasses RLS)
      const { error: claimError } = await supabase.functions.invoke('claim-invite', {
        body: {
          token,
          user_id: authData.user.id,
          user_email: formData.email,
        },
      });

      if (claimError) {
        console.error("Error claiming invite via edge function:", claimError);
        // Don't throw - account was created, just log the error
      }

      // Update user profile with access level and plan tier
      const { error: profileError } = await supabaseFrom('profiles')
        .update({ 
          access_level: inviteData.access_level,
          plan_tier: inviteData.plan_tier || 'growth',
          onboarding_completed: false,
        })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        // Don't throw - account was created successfully
      }

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

  const handleSignInRedirect = () => {
    // Redirect to auth page with the claim token preserved
    navigate(`/auth?redirect_to=${encodeURIComponent(`/claim-access?token=${token}`)}`);
  };

  if (isValidating) {
    return (
      <MinimalAuthLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">validating invite...</div>
        </div>
      </MinimalAuthLayout>
    );
  }

  if (claimed) {
    return (
      <MinimalAuthLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-full max-w-md mx-auto rounded-2xl p-8 bg-card border border-border">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground">welcome to utm.one</h2>
              <p className="text-muted-foreground mt-2">redirecting to onboarding...</p>
            </div>
          </div>
        </div>
      </MinimalAuthLayout>
    );
  }

  // Show sign-in option for existing users
  if (userExists) {
    return (
      <MinimalAuthLayout>
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto rounded-2xl bg-card border border-border">
            <div className="text-center p-6 pb-4">
              <UtmOneLogo size="lg" className="justify-center mb-4" />
              <h2 className="text-xl font-display font-bold text-foreground">you already have an account</h2>
              <p className="text-muted-foreground mt-2">
                sign in with your existing account to claim your access
              </p>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  an account with <span className="font-medium text-foreground">{getValues("email")}</span> already exists. 
                  sign in to link this invite to your account.
                </p>
              </div>
              
              <Button
                onClick={handleSignInRedirect}
                className="w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                sign in to claim access
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                your invite will be applied after sign in
              </p>
            </div>
          </div>
        </div>
      </MinimalAuthLayout>
    );
  }

  return (
    <MinimalAuthLayout>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto rounded-2xl bg-card border border-border">
          <div className="text-center p-6 pb-4">
            <UtmOneLogo size="lg" className="justify-center mb-4" />
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
    </MinimalAuthLayout>
  );
};

export default ClaimAccess;
