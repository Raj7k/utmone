import { motion } from "framer-motion";
import { Gift, Heart } from "lucide-react";

export function DoubleSidedReward() {
  return (
    <section className="py-24 md:py-32 px-6 bg-muted/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-foreground">
            referrals only work when both sides win.
          </h2>
          <p className="text-2xl text-muted-foreground">so we built a double reward.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* What Your Friend Gets */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8 bg-card backdrop-blur-xl border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/10">
                <Heart className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">what your friend gets</h3>
            </div>
            <ul className="space-y-4">
              {[
                'instant "invited by [your name]" message',
                "1 free month of pro when they join",
                "trusted social proof (your avatar + your name)",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-emerald-400" />
                  <p className="text-muted-foreground">{item}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* What You Get */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8 bg-card backdrop-blur-xl border border-primary/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">what you get</h3>
            </div>
            <ul className="space-y-4">
              {[
                "1 referral added",
                "priority access",
                "free month of pro",
                "the satisfaction of beating everyone else on the leaderboard 😄",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-primary" />
                  <p className="text-muted-foreground">{item}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
