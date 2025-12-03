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
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">destination url</label>
            <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm font-mono text-foreground border border-border">
              https://acme.com/product/demo
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">short link</label>
            <div className="bg-primary/10 rounded-lg px-3 py-2 text-sm font-mono text-primary border border-primary/20 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              utm.one/acme-demo
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary" />
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
        <div className="space-y-2">
          {[
            { param: "utm_source", value: "linkedin", color: "bg-primary" },
            { param: "utm_medium", value: "social", color: "bg-primary/80" },
            { param: "utm_campaign", value: "q4_product_launch", color: "bg-primary/60" },
            { param: "utm_term", value: "enterprise", color: "bg-primary/40" },
            { param: "utm_content", value: "cta_demo", color: "bg-primary/20" },
          ].map((item, i) => (
            <motion.div 
              key={item.param}
              className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-xs text-muted-foreground font-mono">{item.param}=</span>
              <span className="text-xs text-foreground font-mono">{item.value}</span>
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
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 bg-foreground rounded-xl flex items-center justify-center">
            <QrCode className="w-24 h-24 text-background" />
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">brand color</div>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary border-2 border-primary-foreground" />
                <div className="w-6 h-6 rounded-full bg-foreground" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">logo</div>
              <div className="text-sm text-foreground">acme-logo.svg</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-primary">
              <CheckCircle2 className="w-3 h-3" />
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
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "clicks", value: "12,847" },
              { label: "unique", value: "8,234" },
              { label: "conversion", value: "3.2%" },
            ].map((stat) => (
              <div key={stat.label} className="p-3 bg-muted/30 rounded-lg text-center">
                <div className="text-lg font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="h-16 flex items-end gap-1">
            {[40, 55, 45, 60, 75, 65, 80, 70, 85, 90, 75, 95].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-primary/60 rounded-t"
                style={{ height: `${h}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
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
        <div className="space-y-3">
          {[
            { rule: "utm_source format", status: "pass", desc: "lowercase, no spaces" },
            { rule: "campaign naming", status: "pass", desc: "follows Q4-PRODUCT-REGION pattern" },
            { rule: "required params", status: "pass", desc: "all 5 UTMs present" },
            { rule: "domain whitelist", status: "pass", desc: "acme.com verified" },
          ].map((item, i) => (
            <motion.div
              key={item.rule}
              className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-foreground lowercase">{item.rule}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
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
        <div className="space-y-3">
          {[
            { name: "Sarah Chen", role: "Admin", access: "Full access" },
            { name: "Mike Johnson", role: "Editor", access: "Create & edit links" },
            { name: "Lisa Park", role: "Viewer", access: "View analytics only" },
          ].map((user, i) => (
            <motion.div
              key={user.name}
              className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="text-sm text-foreground">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.role} · {user.access}</div>
              </div>
            </motion.div>
          ))}
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Shield className="w-3 h-3" />
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
    <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
          <h2 className="hero-gradient text-2xl sm:text-3xl md:text-4xl font-display font-bold lowercase px-2">
            everything your gtm team needs, in one place
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Six tools. One platform. Zero data chaos.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: Interactive Product Mockup */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl border border-border shadow-2xl shadow-primary/5 overflow-hidden"
              >
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                    <div className="w-3 h-3 rounded-full bg-green-400/60" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-background rounded-md px-3 py-1.5 text-xs text-muted-foreground font-mono">
                      {active.preview.url}
                    </div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground lowercase">{active.preview.title}</h4>
                  </div>
                  {active.preview.content}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Right: Feature List with Hover */}
          <div className="space-y-3">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  onMouseEnter={() => setActiveTool(tool.id)}
                  className={`
                    w-full text-left p-4 rounded-xl transition-all duration-300 group
                    ${isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "bg-card border border-border hover:border-primary/30 hover:bg-muted/50"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                      ${isActive 
                        ? "bg-primary-foreground/20" 
                        : "bg-primary/10 text-primary group-hover:bg-primary/20"
                      }
                    `}>
                      <Icon className={`w-6 h-6 ${isActive ? "text-primary-foreground" : ""}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold lowercase ${isActive ? "" : "text-foreground"}`}>
                        {tool.label}
                      </div>
                    </div>
                    <ArrowRight className={`
                      w-5 h-5 transition-all
                      ${isActive 
                        ? "text-primary-foreground translate-x-0" 
                        : "text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      }
                    `} />
                  </div>
                </button>
              );
            })}
            
            <div className="pt-4">
              <Link 
                to="/how-it-works"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
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
