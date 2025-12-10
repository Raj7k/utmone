import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, BarChart3, Orbit, QrCode, ArrowRight, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";

const TOOLS = [
  {
    id: "scanner",
    title: "Link Hygiene Scanner",
    tagline: "Is your data leaking?",
    description: "Grade your URLs for security vulnerabilities and optimization penalties.",
    icon: Shield,
    href: "/tools/scanner",
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-500/30 hover:border-green-500/60",
  },
  {
    id: "casino",
    title: "GTM Casino",
    tagline: "Beat the odds.",
    description: "Monte Carlo simulation to predict your marketing ROI probability.",
    icon: BarChart3,
    href: "/tools/casino",
    gradient: "from-purple-500 to-cyan-500",
    bgGradient: "from-purple-500/10 to-cyan-500/10",
    borderColor: "border-purple-500/30 hover:border-purple-500/60",
  },
  {
    id: "galaxy",
    title: "Attribution Galaxy",
    tagline: "Map your empire.",
    description: "Build a 3D constellation of your marketing funnel and find the golden path.",
    icon: Orbit,
    href: "/tools/galaxy",
    gradient: "from-pink-500 to-violet-500",
    bgGradient: "from-pink-500/10 to-violet-500/10",
    borderColor: "border-pink-500/30 hover:border-pink-500/60",
  },
  {
    id: "qr-test",
    title: "QR Crash Test",
    tagline: "Will it scan?",
    description: "Stress-test your QR codes against real-world conditions.",
    icon: QrCode,
    href: "/tools/qr-test",
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-500/10 to-orange-500/10",
    borderColor: "border-yellow-500/30 hover:border-yellow-500/60",
  },
];

export default function ToolsHub() {
  return (
    <div className="dark min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]">
      <AppHeader />
      
      {/* Animated grid background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[150px]" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blazeOrange/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 mb-6" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <Sparkles className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span className="text-sm font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.9)' }}>product-led growth</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            <span className="hero-gradient">
              Marketing Tools for the 1%
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            four viral tools powered by mathematical optimization algorithms. test, analyze, and build your marketing infrastructure.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Link to={tool.href}>
                  <div className={`
                    relative overflow-hidden rounded-3xl border-2 ${tool.borderColor}
                    bg-gradient-to-br ${tool.bgGradient} backdrop-blur-xl
                    p-8 h-full transition-all duration-300
                    hover:shadow-2xl hover:shadow-primary/10
                  `}>
                    {/* Glow effect */}
                    <div className={`
                      absolute -top-24 -right-24 w-48 h-48 
                      bg-gradient-to-br ${tool.gradient} opacity-20 blur-3xl
                      group-hover:opacity-40 transition-opacity duration-500
                    `} />
                    
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`
                        w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient}
                        flex items-center justify-center mb-6
                        group-hover:scale-110 transition-transform duration-300
                      `}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      {/* Content */}
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {tool.title}
                      </h2>
                      <p className={`
                        text-lg font-semibold mb-3
                        bg-gradient-to-r ${tool.gradient} bg-clip-text text-transparent
                      `}>
                        {tool.tagline}
                      </p>
                      <p className="text-muted-foreground mb-6">
                        {tool.description}
                      </p>
                      
                      {/* CTA */}
                      <div className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        <span>Try it free</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6">
            want the full suite? get access to all tools plus production-grade link infrastructure.
          </p>
          <Link to="/early-access">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg bg-gradient-to-r from-primary to-blaze-orange"
            >
              Get Early Access
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
