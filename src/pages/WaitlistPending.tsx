import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, Share2, LogOut, Mail } from "lucide-react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";

export default function WaitlistPending() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string>("");
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWaitlistStatus();
  }, []);

  const loadWaitlistStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        navigate("/auth");
        return;
      }

      setUserEmail(user.email);

      // Get waitlist info
      const { data: waitlistData } = await supabase
        .from("early_access_requests")
        .select("referral_code, total_access_score")
        .eq("email", user.email)
        .single();

      if (waitlistData) {
        setReferralCode(waitlistData.referral_code || "");
        
        // Calculate approximate queue position based on score
        const { count } = await supabase
          .from("early_access_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")
          .gt("total_access_score", waitlistData.total_access_score || 0);

        if (count !== null) {
          setQueuePosition(count + 1);
        }
      }
    } catch (error) {
      console.error("Error loading waitlist status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const copyReferralLink = () => {
    if (!referralCode) return;
    
    const referralLink = `${window.location.origin}/invite/${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    
    toast({
      title: "Referral link copied!",
      description: "Share it with others to move up in the queue.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <UtmOneLogo size="xl" className="justify-center mb-8" />
          <p className="text-muted-foreground">Loading your status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-transparent flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl space-y-6"
      >
        {/* Logo */}
        <div className="text-center">
          <UtmOneLogo size="xl" className="justify-center mb-8" />
        </div>

        {/* Main Card */}
        <Card className="p-8 space-y-6 border-border/50 shadow-xl">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
            >
              <Clock className="h-8 w-8 text-primary" />
            </motion.div>

            <h1 className="text-4xl font-display font-bold text-foreground">
              You're on the list!
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              We're rolling out utm.one in waves to ensure the best experience for everyone.
            </p>
          </div>

          {/* Queue Position */}
          {queuePosition && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-primary/5 rounded-2xl p-6 text-center"
            >
              <p className="text-sm text-muted-foreground mb-2">Your position in queue</p>
              <p className="text-5xl font-display font-bold text-primary">#{queuePosition}</p>
            </motion.div>
          )}

          {/* What happens next */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-semibold text-foreground">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">We'll email you when you're in</p>
                  <p className="text-sm text-muted-foreground">Check {userEmail}</p>
                </div>
              </div>
              {referralCode && (
                <div className="flex items-start gap-3">
                  <Share2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Move up faster</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Share your referral link — each signup moves you up the queue
                    </p>
                    <Button
                      onClick={copyReferralLink}
                      variant="outline"
                      size="sm"
                      className="w-full rounded-full"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy referral link
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sign Out */}
          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="w-full rounded-full text-muted-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Questions? Reach us at{" "}
          <a href="mailto:support@utm.one" className="text-primary hover:underline">
            support@utm.one
          </a>
        </p>
      </motion.div>
    </div>
  );
}
