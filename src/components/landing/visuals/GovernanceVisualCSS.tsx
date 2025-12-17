/**
 * GovernanceVisual - CSS-Only Version
 * Terminal-style audit log with CSS animations instead of framer-motion
 */
import { User, CheckCircle2 } from "lucide-react";

const logs = [
  { user: "sarah.k", action: "created", target: "nike-q4-campaign", status: "approved", delay: 200 },
  { user: "mike.r", action: "edited", target: "tesla-launch-2024", status: "pending", delay: 500 },
  { user: "admin", action: "approved", target: "apple-wwdc-link", status: "approved", delay: 800 },
  { user: "lisa.m", action: "archived", target: "old-campaign-123", status: "approved", delay: 1100 },
];

export const GovernanceVisualCSS = () => {
  return (
    <div className="relative w-[380px]">
      {/* Terminal Window */}
      <div 
        className="rounded-xl overflow-hidden bg-black/40 border border-white/10 animate-fade-in"
      >
        {/* Title Bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03]">
          <div className="w-3 h-3 rounded-full bg-red-400/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
          <div className="w-3 h-3 rounded-full bg-green-400/60" />
          <span className="ml-2 text-[10px] uppercase tracking-wider text-white/40">
            audit log
          </span>
        </div>

        {/* Log Entries */}
        <div className="p-4 space-y-2 font-mono text-xs">
          {logs.map((log, i) => (
            <div
              key={i}
              className="flex items-center gap-2 animate-slide-up opacity-0"
              style={{ 
                animationDelay: `${log.delay}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <span className="text-white/30">[{`${9 + i}:${15 + i * 7}am`}]</span>
              <User className="w-3 h-3 text-white/40" />
              <span className="text-white/60">{log.user}</span>
              <span className="text-white/40">{log.action}</span>
              <span className="text-white/80">{log.target}</span>
              <span 
                className={`ml-auto px-2 py-0.5 rounded text-[10px] uppercase animate-scale-in opacity-0 ${
                  log.status === 'approved' 
                    ? 'bg-green-500/20 text-green-500/90' 
                    : 'bg-yellow-500/20 text-yellow-500/90'
                }`}
                style={{ 
                  animationDelay: `${log.delay + 300}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                {log.status}
              </span>
            </div>
          ))}

          {/* Blinking cursor - CSS animation */}
          <div className="flex items-center gap-1 pt-2">
            <span className="text-white/40">$</span>
            <div className="w-2 h-4 bg-white/60 animate-cursor-blink" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceVisualCSS;
