import { motion } from "framer-motion";
import { ArrowDown, Users, TrendingUp, Shield, Target } from "lucide-react";
import { AnimatedCounter } from "@/components/reports/AnimatedCounter";

export const PlaybookHero = () => {
  const words = ["The", "HR", "Katalyst", "Referral", "Playbook"];
  
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden py-20">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          initial={{ 
            x: Math.random() * 400 - 200, 
            y: Math.random() * 400 - 200,
            opacity: 0 
          }}
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5
          }}
          style={{
            left: `${20 + i * 12}%`,
            top: `${30 + (i % 3) * 20}%`
          }}
        />
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Animated headline */}
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6"
        >
          {words.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.1 + i * 0.1,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="inline-block mr-3 md:mr-4"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          How we went from <span className="text-foreground font-semibold">10K</span> to{" "}
          <span className="text-foreground font-semibold">25K</span> registrations in 5 seasons
        </motion.p>

        {/* Key metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto mb-12"
        >
          {[
            { icon: Users, value: 982, suffix: "", label: "Referrers" },
            { icon: Target, value: 6903, suffix: "", label: "Conversions" },
            { icon: TrendingUp, value: 28, suffix: "%", label: "Conv. Rate" },
            { icon: Shield, value: 96.6, suffix: "%", label: "Integrity", decimals: 1 },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4"
            >
              <metric.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-foreground font-mono">
                <AnimatedCounter 
                  to={metric.value} 
                  suffix={metric.suffix}
                  decimals={metric.decimals || 0}
                />
              </div>
              <div className="text-xs text-muted-foreground">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl">
            {/* Window controls */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-xs text-muted-foreground ml-3">Live Leaderboard</span>
            </div>
            
            {/* Mini leaderboard */}
            <div className="space-y-2">
              {[
                { rank: 1, name: "Priya S.", company: "TechCorp", refs: 487, badge: "🏆" },
                { rank: 2, name: "Rahul M.", company: "StartupXYZ", refs: 312, badge: "🥈" },
                { rank: 3, name: "Anita K.", company: "GlobalHR", refs: 289, badge: "🥉" },
              ].map((item, i) => (
                <motion.div
                  key={item.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                  className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.badge}</span>
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.company}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground font-mono">{item.refs}</div>
                    <div className="text-xs text-muted-foreground">referrals</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-10" />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-muted-foreground/50"
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
