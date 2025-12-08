import { motion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
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

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center space-y-8"
      >
        {/* Success Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-3xl bg-primary/20" />
            <div className="relative rounded-full p-6 bg-gradient-to-br from-primary to-orange-500">
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl hero-gradient">
            you're on the list!
          </h1>
          
          {/* Queue Position Badge */}
          <div className="inline-flex items-center gap-3 border-2 rounded-full px-8 py-4 bg-primary/10 border-primary/30">
            <Sparkles className="w-6 h-6 text-primary" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground font-medium">queue position</p>
              <p className="text-3xl font-display font-bold text-primary">
                #{queuePosition}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Golden Ticket */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="py-8"
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
          className="rounded-3xl p-8 md:p-12 border-2 bg-gradient-to-br from-primary/5 via-primary/10 to-orange-500/5 border-primary/20"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            skip the line now
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            share your unique link — refer 3 friends and unlock instant access + 1 month Pro free!
          </p>

          <div className="space-y-6">
            <ShareReferralModal referralCode={referralCode} userName={userName} />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to={`/waitlist-status?email=${encodeURIComponent(email)}`}>
                <Button variant="outline" size="lg" className="group">
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
          className="text-center text-sm text-muted-foreground"
        >
          <p>
            we'll email you when your position changes or when early access opens.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
