import { Shield, Lock, Zap, ShieldCheck, Ban } from "lucide-react";

const badges = [
  { icon: Lock, label: "256-bit Encryption" },
  { icon: Shield, label: "GDPR Compliant" },
  { icon: Zap, label: "99.99% Uptime Target" },
  { icon: ShieldCheck, label: "SOC 2 (In Progress)" },
  { icon: Ban, label: "We Never Sell Your Data" },
];

export const TrustBadgeStrip = () => {
  return (
    <section className="w-full py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/40 backdrop-blur-xl border border-border/50"
            >
              <badge.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
