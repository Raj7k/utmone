import { motion } from "framer-motion";
import { TrendingUp, Users, Gift, Link as LinkIcon } from "lucide-react";

export function ViralDashboardPreview() {
  return (
    <section className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            yes, there's a leaderboard. and yes, you're racing.
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            we designed a waitlist that rewards momentum. every referral earns you points that push you up the list. hit 3, and you jump straight to the front.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-3xl p-8 md:p-12"
        >
          {/* Preview Blocks */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="text-sm text-tertiary-label">your position</p>
              </div>
              <p className="text-3xl font-bold text-foreground">#4,502 <span className="text-base text-secondary-label">in line</span></p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-sm text-tertiary-label">your progress</p>
              </div>
              <p className="text-3xl font-bold text-foreground">0 / 3 <span className="text-base text-secondary-label">referrals</span></p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <Gift className="w-5 h-5 text-primary" />
                <p className="text-sm text-tertiary-label">your reward</p>
              </div>
              <p className="text-xl font-semibold text-primary">1 month of pro for free</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <LinkIcon className="w-5 h-5 text-primary" />
                <p className="text-sm text-tertiary-label">share link</p>
              </div>
              <p className="text-sm font-mono text-foreground break-all">utm.one/join?ref=SAM-82</p>
            </div>
          </div>

          {/* Golden Ticket Status */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-amber-700 mb-2">golden ticket</p>
            <p className="text-xl font-bold text-amber-900">status: <span className="text-amber-600">access pending</span></p>
            <p className="text-sm text-amber-700 mt-2">refer 3 friends to unlock</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
