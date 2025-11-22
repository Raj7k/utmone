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
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="animate-pulse">validating invite...</div>
      </div>
    );
  }

  if (claimed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <CardTitle>welcome to utm.one</CardTitle>
            <CardDescription>redirecting to onboarding...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center gap-2">
            <LinkIcon className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">utm.one</span>
          </div>
          <CardTitle>claim your early access</CardTitle>
          <CardDescription>
            create your password to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">email</Label>
              <Input
                id="email"
                type="email"
                disabled
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">password</Label>
              <Input
                id="password"
                type="password"
                placeholder="at least 8 characters"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="re-enter your password"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimAccess;
