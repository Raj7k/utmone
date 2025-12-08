import { motion } from "framer-motion";
import { TrendingUp, Users, Gift, Link as LinkIcon } from "lucide-react";

export function ViralDashboardPreview() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-foreground">
            yes, there's a leaderboard. and yes, you're racing.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            we designed a waitlist that rewards momentum. every referral earns you points that push you up the list. hit 3, and you jump straight to the front.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card backdrop-blur-xl border border-border rounded-3xl p-8 md:p-12"
        >
          {/* Preview Blocks */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-muted/10 rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">your position</p>
              </div>
              <p className="text-3xl font-bold text-foreground">#4,502 <span className="text-base text-muted-foreground">in line</span></p>
            </div>

            <div className="bg-muted/10 rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">your progress</p>
              </div>
              <p className="text-3xl font-bold text-foreground">0 / 3 <span className="text-base text-muted-foreground">referrals</span></p>
            </div>

            <div className="bg-muted/10 rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Gift className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">your reward</p>
              </div>
              <p className="text-xl font-semibold text-primary">1 month of pro for free</p>
            </div>

            <div className="bg-muted/10 rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <LinkIcon className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">share link</p>
              </div>
              <p className="text-sm font-mono text-foreground break-all">utm.one/join?ref=SAM-82</p>
            </div>
          </div>

          {/* Golden Ticket Status */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
            <p className="text-sm text-amber-400 mb-2">golden ticket</p>
            <p className="text-xl font-bold text-amber-300">status: <span className="text-amber-400">access pending</span></p>
            <p className="text-sm text-amber-400/70 mt-2">refer 3 friends to unlock</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
