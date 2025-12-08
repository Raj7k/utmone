import { motion } from "framer-motion";
import { Trophy, Sparkles, Lock, CheckCircle2 } from "lucide-react";

interface GoldenTicketProps {
  userName: string;
  referralCode: string;
  referralCount: number;
  status: "locked" | "unlocked" | "granted";
}

export function GoldenTicket({ userName, referralCode, referralCount, status }: GoldenTicketProps) {
  const isUnlocked = status === "unlocked" || status === "granted";
  const isGranted = status === "granted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative rounded-2xl p-8 overflow-hidden ${
        isGranted
          ? "bg-gradient-to-br from-green-900/40 to-emerald-900/60 border-4 border-green-500/50"
          : isUnlocked
          ? "bg-gradient-to-br from-amber-900/40 to-yellow-900/60 border-4 border-amber-500/50"
          : "bg-card border-4 border-border"
      }`}
    >
      {/* Sparkle decoration */}
      <div className="absolute top-4 right-4">
        {isGranted ? (
          <CheckCircle2 className="w-8 h-8 text-green-400 animate-pulse" />
        ) : isUnlocked ? (
          <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
        ) : (
          <Lock className="w-8 h-8 text-muted-foreground" />
        )}
      </div>

      <div className="text-center">
        <Trophy className={`w-16 h-16 mx-auto mb-4 ${
          isGranted ? "text-green-400" : isUnlocked ? "text-amber-400" : "text-muted-foreground"
        }`} />
        
        <h3 className={`text-2xl font-display font-bold mb-2 ${
          isGranted ? "text-green-300" : isUnlocked ? "text-amber-300" : "text-muted-foreground"
        }`}>
          {isGranted ? "access granted!" : isUnlocked ? "golden ticket unlocked" : "your golden ticket"}
        </h3>
        
        <p className={`text-sm mb-6 ${
          isGranted ? "text-green-400/80" : isUnlocked ? "text-amber-400/80" : "text-muted-foreground/70"
        }`}>
          {isGranted 
            ? "check your email for login details" 
            : isUnlocked 
            ? "you're next in line for access" 
            : "refer 3 friends to unlock"}
        </p>

        {/* Ticket Details */}
        <div className={`rounded-xl p-6 mb-4 ${
          isGranted ? "bg-muted/20" : isUnlocked ? "bg-muted/20" : "bg-muted/10"
        }`}>
          <div className="space-y-3 text-left">
            <div>
              <p className="text-xs text-muted-foreground/70">ticket holder</p>
              <p className="font-semibold text-foreground">{userName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground/70">referral code</p>
              <p className="font-mono font-semibold text-foreground">{referralCode}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground/70">progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(referralCount / 3) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full ${
                      isGranted ? "bg-green-500" : isUnlocked ? "bg-amber-500" : "bg-muted-foreground/40"
                    }`}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground">{referralCount} / 3</span>
              </div>
            </div>
          </div>
        </div>

        {isGranted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="bg-green-500 text-white py-3 px-6 rounded-full font-bold"
          >
            ✨ access approved ✨
          </motion.div>
        )}
      </div>

      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--foreground)/0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>
    </motion.div>
  );
}
