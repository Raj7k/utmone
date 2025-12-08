import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Link as LinkIcon, 
  BarChart3, 
  QrCode, 
  TrendingUp, 
  CheckCircle2, 
  Shield,
  ArrowRight
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const TOOLS = [
  {
    id: "short-links",
    icon: LinkIcon,
    label: "short links",
    description: "branded, tracked, forever",
    href: "/features/short-links",
    featured: true,
    preview: (
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs text-white-50">destination url</label>
          <div 
            className="rounded-lg px-3 py-2 text-sm font-mono truncate bg-white/5 border border-white-10 text-white-80"
          >
            https://nike.com/product/air-max-2025
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-white-50">short link</label>
          <div 
            className="rounded-lg px-3 py-2 text-sm font-mono flex items-center gap-2 bg-white/10 border border-white-15 text-white-90"
          >
            <LinkIcon className="w-4 h-4" />
            utm.one/nike-launch
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm pt-1 text-white-60">
          <CheckCircle2 className="w-4 h-4 text-white-70" />
          auto-tracked with clean-track
        </div>
      </div>
    )
  },
  {
    id: "utm-builder",
    icon: BarChart3,
    label: "utm builder",
    description: "validated parameters",
    href: "/features/utm-builder",
    preview: (
      <div className="space-y-1">
        {[
          { param: "source", value: "linkedin" },
          { param: "medium", value: "social" },
          { param: "campaign", value: "q4_launch" },
        ].map((item, i) => (
          <motion.div 
            key={item.param}
            className="flex items-center gap-1.5 text-xs font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="text-white-40">{item.param}=</span>
            <span className="text-white-80">{item.value}</span>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: "qr-generator",
    icon: QrCode,
    label: "qr codes",
    description: "branded & tracked",
    href: "/features/qr-generator",
    preview: (
      <div className="flex items-center justify-center">
        <div 
          className="w-16 h-16 rounded-lg flex items-center justify-center bg-white-90"
        >
          <QrCode className="w-10 h-10 text-obsidian" />
        </div>
      </div>
    )
  },
  {
    id: "analytics",
    icon: TrendingUp,
    label: "analytics",
    description: "real-time insights",
    href: "/features/analytics",
    preview: (
      <div className="space-y-2">
        <div className="text-xl font-bold text-white-90">24,847</div>
        <div className="h-8 flex items-end gap-0.5">
          {[40, 55, 60, 75, 65, 80, 90].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t bg-white/30"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    )
  },
  {
    id: "clean-track",
    icon: CheckCircle2,
    label: "clean-track",
    description: "validation rules",
    href: "/features/clean-track",
    preview: (
      <div className="space-y-1">
        {["format ✓", "naming ✓", "params ✓"].map((rule, i) => (
          <motion.div
            key={rule}
            className="text-xs text-white-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {rule}
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: "governance",
    icon: Shield,
    label: "governance",
    description: "team permissions",
    href: "/solutions/enterprise",
    preview: (
      <div className="space-y-1.5">
        {[
          { initials: "EM", role: "Admin" },
          { initials: "TC", role: "Editor" },
          { initials: "JB", role: "Viewer" },
        ].map((user, i) => (
          <motion.div
            key={user.initials}
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold bg-white-15 text-white-80"
            >
              {user.initials}
            </div>
            <span className="text-[10px] text-white-50">{user.role}</span>
          </motion.div>
        ))}
      </div>
    )
  }
];

export const GTMToolsShowcase = () => {
  const featured = TOOLS[0];
  const smallCards = TOOLS.slice(1);

  return (
    <AnimatedSection className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 space-y-3">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold lowercase px-2 hero-gradient"
          >
            everything your gtm team needs, in one place
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-white-50">
            Six tools. One platform. Zero data chaos.
          </p>
        </div>
        
        {/* Bento Box Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {/* Featured Card - Short Links (spans 2 columns, 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="col-span-2 row-span-2 group"
          >
            <Link 
              to={featured.href}
              className="block h-full rounded-2xl p-5 md:p-6 transition-all duration-300 hover:scale-[1.01] obsidian-glass-80 border border-white-10 shadow-obsidian"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10"
                  >
                    <LinkIcon className="w-5 h-5 text-white-90" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold lowercase text-white-95">
                      {featured.label}
                    </h3>
                    <p className="text-sm text-white-50">
                      {featured.description}
                    </p>
                  </div>
                </div>
                <ArrowRight 
                  className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-white-60" 
                />
              </div>
              
              {/* Preview Content */}
              <div 
                className="rounded-xl p-4 md:p-5 bg-black/30 border border-white/[0.06]"
              >
                {featured.preview}
              </div>
              
              {/* CTA */}
              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-white-70">
                <span>start free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
          
          {/* Small Cards */}
          {smallCards.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                className="group"
              >
                <Link 
                  to={tool.href}
                  className="block h-full rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] bg-zinc-900/50 backdrop-blur-xl border border-white-08"
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors group-hover:bg-white/15 bg-white/[0.08]"
                    >
                      <Icon className="w-4 h-4 text-white-70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold lowercase truncate text-white-90">
                        {tool.label}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Mini Preview */}
                  <div 
                    className="rounded-lg p-3 min-h-[80px] bg-black/25 border border-white/[0.04]"
                  >
                    {tool.preview}
                  </div>
                  
                  {/* Description */}
                  <p className="mt-2 text-xs text-white-40">
                    {tool.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
};