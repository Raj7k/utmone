import { motion } from "framer-motion";
import { Gift, Heart, TrendingUp } from "lucide-react";

export function DoubleSidedReward() {
  return (
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            referrals only work when both sides win.
          </h2>
          <p className="text-2xl" style={{ color: 'rgba(255,255,255,0.6)' }}>so we built a double reward.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* What Your Friend Gets */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8"
            style={{ backgroundColor: 'rgba(24,24,27,0.4)', border: '2px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}>
                <Heart className="w-6 h-6" style={{ color: 'rgba(34,197,94,0.8)' }} />
              </div>
              <h3 className="text-2xl font-display font-bold">what your friend gets</h3>
            </div>
            <ul className="space-y-4">
              {[
                'instant "invited by [your name]" message',
                "1 free month of pro when they join",
                "trusted social proof (your avatar + your name)",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: 'rgba(34,197,94,0.8)' }} />
                  <p style={{ color: 'rgba(255,255,255,0.6)' }}>{item}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* What You Get */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8"
            style={{ backgroundColor: 'rgba(24,24,27,0.4)', border: '2px solid rgba(59,130,246,0.3)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.1)' }}>
                <Gift className="w-6 h-6" style={{ color: 'rgba(59,130,246,0.8)' }} />
              </div>
              <h3 className="text-2xl font-display font-bold">what you get</h3>
            </div>
            <ul className="space-y-4">
              {[
                "1 referral added",
                "priority access",
                "free month of pro",
                "the satisfaction of beating everyone else on the leaderboard 😄",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: 'rgba(59,130,246,0.8)' }} />
                  <p style={{ color: 'rgba(255,255,255,0.6)' }}>{item}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}