import { Calendar, Download, TrendingUp, TrendingDown, Users, Target, Zap, Smartphone, Monitor, Tablet } from "lucide-react";
import MiniSparkline from "@/components/intelligence/MiniSparkline";
import { useIntersectionAnimation } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

const metrics = [
  { label: "Total Revenue", value: "$1.24M", change: "+12.4%", trend: "up" },
  { label: "Conversion Rate", value: "3.2%", change: "+0.8%", trend: "up" },
  { label: "Avg Revenue/Click", value: "$4.21", change: "+15%", trend: "up" },
  { label: "Active Campaigns", value: "24", change: "+3", trend: "up" },
];

const channels = [
  { name: "LinkedIn", value: 32, color: "hsl(var(--primary))" },
  { name: "Email", value: 28, color: "hsl(var(--primary) / 0.8)" },
  { name: "Google", value: 22, color: "hsl(var(--primary) / 0.6)" },
  { name: "Direct", value: 18, color: "hsl(var(--primary) / 0.4)" },
];

const journeyData = [
  { device: "Mobile", icon: Smartphone, percent: 45 },
  { device: "Desktop", icon: Monitor, percent: 38 },
  { device: "Tablet", icon: Tablet, percent: 17 },
];

const sparklineData = [42, 55, 48, 62, 58, 71, 68, 82, 76, 89, 95, 102, 98, 112];

export const RevenueIntelligenceDashboard = () => {
  const { ref, isVisible } = useIntersectionAnimation(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        "w-full rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-600 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      )}
    >
      {/* Dashboard Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-foreground">Revenue Intelligence</span>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground hover:bg-white/10 transition-colors">
            <Calendar className="w-3 h-3" />
            Last 30 days
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground hover:bg-white/10 transition-colors">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
        {metrics.map((metric, i) => (
          <div
            key={metric.label}
            className={cn(
              "bg-zinc-900/80 p-4 transition-all duration-500 ease-out",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-semibold text-foreground font-mono">{metric.value}</span>
              <span className={`text-xs flex items-center gap-0.5 ${metric.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                {metric.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-px bg-white/5">
        {/* Attribution Breakdown */}
        <div
          className={cn(
            "bg-zinc-900/80 p-5 transition-all duration-500 ease-out",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          style={{ transitionDelay: '300ms' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Channel Attribution</span>
          </div>
          <div className="space-y-3">
            {channels.map((channel, i) => (
              <div key={channel.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{channel.name}</span>
                  <span className="text-foreground font-mono">{channel.value}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-800 ease-out",
                      isVisible ? "" : "w-0"
                    )}
                    style={{ 
                      backgroundColor: channel.color,
                      width: isVisible ? `${channel.value}%` : '0%',
                      transitionDelay: `${400 + i * 100}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Device Journey */}
        <div
          className={cn(
            "bg-zinc-900/80 p-5 transition-all duration-500 ease-out",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Cross-Device Flow</span>
          </div>
          <div className="flex items-center justify-center gap-4 py-4">
            {journeyData.map((item, i) => (
              <div key={item.device} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-400 ease-out",
                    isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  )}
                  style={{ transitionDelay: `${500 + i * 150}ms` }}
                >
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{item.device}</span>
                <span className="text-sm font-mono text-foreground">{item.percent}%</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            unified identity across 3 devices
          </p>
        </div>

        {/* Revenue Trend */}
        <div
          className={cn(
            "bg-zinc-900/80 p-5 transition-all duration-500 ease-out",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          style={{ transitionDelay: '500ms' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Revenue Trend</span>
          </div>
          <div className="h-24">
            <MiniSparkline data={sparklineData} color="hsl(var(--primary))" strokeWidth={2} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>14 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-zinc-900/40">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Last updated: 2 min ago</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>12,847 events tracked</span>
        </div>
        <span className="text-xs text-primary/80">powered by Clean Track Intelligence™</span>
      </div>
    </div>
  );
};
