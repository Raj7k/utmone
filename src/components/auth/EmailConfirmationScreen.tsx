import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, RefreshCw, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { ObsidianMarketingLayout } from "@/components/layout/ObsidianMarketingLayout";

interface EmailConfirmationScreenProps {
  email: string;
  onBack: () => void;
}

export const EmailConfirmationScreen = ({ email, onBack }: EmailConfirmationScreenProps) => {
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        notify.error(error.message || "failed to resend email");
      } else {
        notify.success("confirmation email resent");
        setCooldown(60); // 60 second cooldown
      }
    } catch (err) {
      notify.error("failed to resend email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <ObsidianMarketingLayout showFloatingNav={false}>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            use a different email
          </button>

          <div className="text-center space-y-4">
            <UtmOneLogo size="xl" className="justify-center mb-2" />
          </div>

          <Card className="bg-card border-border shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              {/* Animated envelope */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Mail className="h-12 w-12 text-primary" />
                    </motion.div>
                  </div>
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>

              {/* Message */}
              <div className="text-center space-y-3">
                <h1 className="text-2xl font-display font-bold text-foreground">
                  check your email
                </h1>
                <p className="text-muted-foreground">
                  we sent a confirmation link to
                </p>
                <p className="text-foreground font-medium text-lg break-all">
                  {email}
                </p>
                <p className="text-sm text-muted-foreground pt-2">
                  click the link in your email to complete signup
                </p>
              </div>

              {/* Resend button */}
              <div className="pt-4 space-y-4">
                <Button
                  onClick={handleResend}
                  variant="outline"
                  className="w-full h-12 rounded-xl"
                  disabled={isResending || cooldown > 0}
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      sending...
                    </>
                  ) : cooldown > 0 ? (
                    `resend in ${cooldown}s`
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      resend email
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  didn't receive the email? check your spam folder
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ObsidianMarketingLayout>
  );
};
