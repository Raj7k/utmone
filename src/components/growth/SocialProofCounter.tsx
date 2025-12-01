import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Users, TrendingUp, Zap } from "lucide-react";

interface SocialProofCounterProps {
  variant?: "default" | "minimal" | "detailed";
  role?: "marketers" | "sales" | "ops" | "developers" | "agencies" | "partners" | "startups" | "reporting" | "revops";
}

// Role-specific messaging
const roleData = {
  marketers: { count: 8500, label: "marketers", subtitle: "tracking campaigns" },
  sales: { count: 3200, label: "sales teams", subtitle: "sharing tracked links" },
  ops: { count: 1800, label: "ops teams", subtitle: "enforcing governance" },
  developers: { count: 2100, label: "developers", subtitle: "using the API" },
  agencies: { count: 450, label: "agencies", subtitle: "managing clients" },
  partners: { count: 1200, label: "partner programs", subtitle: "tracking attribution" },
  startups: { count: 4200, label: "startups", subtitle: "building with clean data" },
  reporting: { count: 2800, label: "reporting teams", subtitle: "trusting their dashboards" },
  revops: { count: 1500, label: "revops teams", subtitle: "aligning revenue operations" }
};

export const SocialProofCounter = ({ 
  variant = "default",
  role = "marketers" 
}: SocialProofCounterProps) => {
  const data = roleData[role];
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const controls = animate(count, data.count, {
      duration: 2,
      ease: "easeOut"
    });

    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayCount(latest);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [data.count]);

  if (variant === "minimal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 text-sm text-secondary-label"
      >
        <Users className="w-4 h-4 text-primary" />
        <span className="font-medium text-primary">{displayCount.toLocaleString()}+</span>
        <span>{data.label} trust utm.one</span>
      </motion.div>
    );
  }

  if (variant === "detailed") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-card border border-border rounded-2xl p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-primary/10">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">
              {displayCount.toLocaleString()}+
            </div>
            <div className="text-sm text-secondary-label">{data.label}</div>
          </div>
        </div>
        
        <div className="space-y-3 text-sm text-secondary-label">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>{data.subtitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Clean data by default</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Trusted by teams worldwide</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-4">
        <Zap className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-primary uppercase tracking-wide">
          Join {displayCount.toLocaleString()}+ {data.label}
        </span>
      </div>
      <p className="text-sm text-secondary-label">{data.subtitle}</p>
    </motion.div>
  );
};
