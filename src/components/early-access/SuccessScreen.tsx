import { motion } from "framer-motion";
import { useEffect } from "react";
import { triggerConfetti } from "@/components/lazy/LazyConfetti";
import { GoldenTicket } from "./GoldenTicket";
import { ShareReferralModal } from "@/components/waitlist/ShareReferralModal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Sparkles, ArrowRight } from "lucide-react";

interface SuccessScreenProps {
  userName: string;
  referralCode: string;
  queuePosition: number;
  email: string;
}

export const SuccessScreen = ({
  userName,
  referralCode,
  queuePosition,
  email,
}: SuccessScreenProps) => {
  // Trigger confetti on mount
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      triggerConfetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      triggerConfetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center space-y-6"
      >
        {/* Success Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-2xl bg-primary/30" />
            <div className="relative rounded-full p-4 bg-gradient-to-br from-primary to-orange-500">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
            you're on the list!
          </h1>
          
          {/* Queue Position Badge */}
          <div className="inline-flex items-center gap-3 border rounded-full px-6 py-3 bg-primary/10 border-primary/30">
            <Sparkles className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="text-xs text-foreground/60 font-medium uppercase tracking-wide">queue position</p>
              <p className="text-2xl font-display font-bold text-foreground">
                #{queuePosition}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Golden Ticket - Scaled down */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="py-4"
        >
          <GoldenTicket
            userName={userName}
            referralCode={referralCode}
            referralCount={0}
            status="locked"
          />
        </motion.div>

        {/* CTA Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl p-6 md:p-8 border bg-card border-border"
        >
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
            skip the line
          </h2>
          <p className="text-base text-foreground/70 mb-6 max-w-md mx-auto leading-relaxed">
            refer 3 friends and unlock instant access + 1 month Pro free!
          </p>

          <div className="space-y-4">
            <ShareReferralModal referralCode={referralCode} userName={userName} />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to={`/waitlist-status?email=${encodeURIComponent(email)}`}>
                <Button variant="outline" size="default" className="group">
                  view full status
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Progress Incentive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-sm text-foreground/60"
        >
          <p>
            we'll email you when your position changes or when early access opens.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
