import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    preview: {
      title: "create smart link",
      url: "utm.one/dashboard/links",
      content: (
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">destination url</label>
            <div className="bg-muted/50 rounded-lg px-2 py-1.5 text-xs font-mono text-foreground border border-border truncate">
              https://nike.com/product/air-max
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">short link</label>
            <div className="bg-primary/10 rounded-lg px-2 py-1.5 text-xs font-mono text-primary border border-primary/20 flex items-center gap-1.5">
              <LinkIcon className="w-3 h-3" />
              utm.one/nike-launch
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3 h-3 text-primary" />
            branded, tracked, forever
          </div>
        </div>
      )
    }
  },
  {
    id: "utm-builder",
    icon: BarChart3,
    label: "utm builder",
    preview: {
      title: "utm parameters",
      url: "utm.one/dashboard/utm-builder",
      content: (
        <div className="space-y-1.5">
          {[
            { param: "utm_source", value: "linkedin", color: "bg-primary" },
            { param: "utm_medium", value: "social", color: "bg-primary/80" },
            { param: "utm_campaign", value: "tesla_q4_launch", color: "bg-primary/60" },
            { param: "utm_term", value: "enterprise", color: "bg-primary/40" },
            { param: "utm_content", value: "elon_post", color: "bg-primary/20" },
          ].map((item, i) => (
            <motion.div 
              key={item.param}
              className="flex items-center gap-1.5 p-1.5 bg-muted/30 rounded"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
              <span className="text-[10px] text-muted-foreground font-mono">{item.param}=</span>
              <span className="text-[10px] text-foreground font-mono">{item.value}</span>
            </motion.div>
          ))}
        </div>
      )
    }
  },
  {
    id: "qr-generator",
    icon: QrCode,
    label: "qr codes",
    preview: {
      title: "branded qr code",
      url: "utm.one/dashboard/qr",
      content: (
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-foreground rounded-lg flex items-center justify-center">
            <QrCode className="w-14 h-14 text-background" />
          </div>
          <div className="space-y-2">
            <div className="space-y-0.5">
              <div className="text-[10px] text-muted-foreground">brand color</div>
              <div className="flex gap-1.5">
                <div className="w-4 h-4 rounded-full bg-primary border border-primary-foreground" />
                <div className="w-4 h-4 rounded-full bg-foreground" />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-muted-foreground">logo</div>
              <div className="text-xs text-foreground">apple-logo.svg</div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-primary">
              <CheckCircle2 className="w-2.5 h-2.5" />
              tracked attribution
            </div>
          </div>
        </div>
      )
    }
  },
  {
    id: "analytics",
    icon: TrendingUp,
    label: "analytics",
    preview: {
      title: "link performance",
      url: "utm.one/dashboard/analytics",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "clicks", value: "24,847" },
              { label: "unique", value: "18,234" },
              { label: "conversion", value: "4.8%" },
            ].map((stat) => (
              <div key={stat.label} className="p-2 bg-muted/30 rounded text-center">
                <div className="text-sm font-bold text-primary">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="h-10 flex items-end gap-0.5">
            {[40, 55, 45, 60, 75, 65, 80, 70, 85, 90, 75, 95].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-primary/60 rounded-t"
                style={{ height: `${h}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
              />
            ))}
          </div>
        </div>
      )
    }
  },
  {
    id: "clean-track",
    icon: CheckCircle2,
    label: "clean-track",
    preview: {
      title: "validation rules",
      url: "utm.one/dashboard/clean-track",
      content: (
        <div className="space-y-1.5">
          {[
            { rule: "utm_source format", status: "pass", desc: "lowercase, no spaces" },
            { rule: "campaign naming", status: "pass", desc: "follows Q4-PRODUCT-REGION" },
            { rule: "required params", status: "pass", desc: "all 5 UTMs present" },
            { rule: "domain whitelist", status: "pass", desc: "tesla.com verified" },
          ].map((item, i) => (
            <motion.div
              key={item.rule}
              className="flex items-center gap-2 p-1.5 bg-muted/30 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-foreground lowercase truncate">{item.rule}</div>
                <div className="text-[10px] text-muted-foreground truncate">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )
    }
  },
  {
    id: "governance",
    icon: Shield,
    label: "enterprise control",
    preview: {
      title: "team permissions",
      url: "utm.one/dashboard/settings/team",
      content: (
        <div className="space-y-1.5">
          {[
            { name: "Elon Musk", role: "Admin", access: "Full access" },
            { name: "Tim Cook", role: "Editor", access: "Create & edit" },
            { name: "Jeff Bezos", role: "Viewer", access: "View only" },
          ].map((user, i) => (
            <motion.div
              key={user.name}
              className="flex items-center gap-2 p-1.5 bg-muted/30 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-semibold text-primary">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-foreground truncate">{user.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{user.role} · {user.access}</div>
              </div>
            </motion.div>
          ))}
          <div className="pt-1 border-t border-border">
            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" />
              3 pending approvals
            </div>
          </div>
        </div>
      )
    }
  }
];

export const GTMToolsShowcase = () => {
  const [activeTool, setActiveTool] = useState("short-links");
  const active = TOOLS.find(t => t.id === activeTool) || TOOLS[0];

  return (
    <AnimatedSection className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h1 className="hero-gradient text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold lowercase px-2">
            everything your gtm team needs, in one place
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Six tools. One platform. Zero data chaos.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          {/* Left: Interactive Product Mockup - Compact */}
          <div className="relative h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-card rounded-xl border border-border shadow-xl overflow-hidden h-full flex flex-col"
              >
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border shrink-0">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  </div>
                  <div className="flex-1 mx-2">
                    <div className="bg-background rounded px-2 py-1 text-[10px] text-muted-foreground font-mono">
                      {active.preview.url}
                    </div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-4 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground lowercase text-sm">{active.preview.title}</h4>
                  </div>
                  {active.preview.content}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Right: Feature List - Compact */}
          <div className="space-y-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              
              return (
                <motion.button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  onMouseEnter={() => setActiveTool(tool.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full text-left p-3 rounded-lg transition-all duration-200 group min-h-[60px]
                    ${isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "bg-card border border-border hover:border-primary/30 hover:bg-muted/50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-9 h-9 rounded-lg flex items-center justify-center transition-colors
                      ${isActive 
                        ? "bg-primary-foreground/20" 
                        : "bg-primary/10 text-primary group-hover:bg-primary/20"
                      }
                    `}>
                      <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : ""}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold lowercase text-sm ${isActive ? "" : "text-foreground"}`}>
                        {tool.label}
                      </div>
                    </div>
                    <ArrowRight className={`
                      w-4 h-4 transition-all
                      ${isActive 
                        ? "text-primary-foreground translate-x-0" 
                        : "text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      }
                    `} />
                  </div>
                </motion.button>
              );
            })}
            
            <div className="pt-3">
              <Link 
                to="/how-it-works"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase text-sm"
              >
                see how it all works together
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
