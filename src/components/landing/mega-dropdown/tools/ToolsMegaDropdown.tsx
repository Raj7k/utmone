import { Link } from "react-router-dom";
import { 
  Scan, Dices, Network, QrCode, Link2, Tags, 
  HeartPulse, ArrowRight, Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolsMegaDropdownProps {
  variant?: "light" | "dark";
}

const viralTools = [
  {
    icon: Scan,
    title: "Link Hygiene Scanner",
    description: "Grade your URLs S-F with security analysis",
    href: "/tools/scanner",
    color: "text-emerald-400"
  },
  {
    icon: Dices,
    title: "GTM Casino",
    description: "Monte Carlo simulations for campaign decisions",
    href: "/tools/casino",
    color: "text-amber-400"
  },
  {
    icon: Network,
    title: "Attribution Galaxy",
    description: "Visualize your marketing funnel as a constellation",
    href: "/tools/galaxy",
    color: "text-purple-400"
  },
  {
    icon: QrCode,
    title: "QR Crash Test",
    description: "Stress-test your QR designs",
    href: "/tools/qr-test",
    color: "text-rose-400"
  }
];

const utilityTools = [
  {
    icon: QrCode,
    title: "QR Generator",
    description: "Create branded QR codes",
    href: "/tools/qr-generator"
  },
  {
    icon: Link2,
    title: "URL Shortener",
    description: "Shorten any URL instantly",
    href: "/tools/url-shortener"
  },
  {
    icon: Tags,
    title: "UTM Builder",
    description: "Build trackable campaign URLs",
    href: "/tools/utm-builder"
  },
  {
    icon: HeartPulse,
    title: "Link Health Checker",
    description: "Check if your links are alive",
    href: "/tools/link-health-checker"
  }
];

export function ToolsMegaDropdown({ variant = "dark" }: ToolsMegaDropdownProps) {
  const isDark = variant === "dark";
  
  return (
    <div className={cn(
      "w-[580px] p-6 rounded-2xl border shadow-2xl",
      isDark 
        ? "bg-zinc-900/95 border-white/10 backdrop-blur-xl" 
        : "bg-white border-border"
    )}>
      <div className="grid grid-cols-2 gap-6">
        {/* Viral Tools - Left Column */}
        <div>
          <p className={cn(
            "text-xs font-medium uppercase tracking-wider mb-3",
            isDark ? "text-white/40" : "text-muted-foreground"
          )}>
            Viral Tools
          </p>
          <div className="space-y-1">
            {viralTools.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className={cn(
                  "flex items-start gap-3 p-2.5 rounded-lg transition-all duration-200 group",
                  isDark 
                    ? "hover:bg-white/5" 
                    : "hover:bg-muted"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  isDark ? "bg-white/5" : "bg-muted"
                )}>
                  <tool.icon className={cn("h-4 w-4", tool.color)} />
                </div>
                <div className="min-w-0">
                  <p className={cn(
                    "text-sm font-medium",
                    isDark ? "text-white/90" : "text-foreground"
                  )}>
                    {tool.title}
                  </p>
                  <p className={cn(
                    "text-xs line-clamp-1",
                    isDark ? "text-white/50" : "text-muted-foreground"
                  )}>
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Utility Tools - Right Column */}
        <div>
          <p className={cn(
            "text-xs font-medium uppercase tracking-wider mb-3",
            isDark ? "text-white/40" : "text-muted-foreground"
          )}>
            Utility Tools
          </p>
          <div className="space-y-1">
            {utilityTools.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className={cn(
                  "flex items-start gap-3 p-2.5 rounded-lg transition-all duration-200 group",
                  isDark 
                    ? "hover:bg-white/5" 
                    : "hover:bg-muted"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  isDark ? "bg-white/5" : "bg-muted"
                )}>
                  <tool.icon className={cn(
                    "h-4 w-4",
                    isDark ? "text-white/60" : "text-muted-foreground"
                  )} />
                </div>
                <div className="min-w-0">
                  <p className={cn(
                    "text-sm font-medium",
                    isDark ? "text-white/90" : "text-foreground"
                  )}>
                    {tool.title}
                  </p>
                  <p className={cn(
                    "text-xs line-clamp-1",
                    isDark ? "text-white/50" : "text-muted-foreground"
                  )}>
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Browse All Tools Footer */}
      <div className={cn(
        "mt-5 pt-4 border-t",
        isDark ? "border-white/10" : "border-border"
      )}>
        <Link 
          to="/tools" 
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors group",
            isDark 
              ? "text-white/70 hover:text-white" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Wrench className="h-4 w-4" />
          Browse all tools
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
