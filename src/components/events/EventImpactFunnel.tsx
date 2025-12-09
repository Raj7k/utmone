import { motion } from "framer-motion";
import { Users, Waves, Target, DollarSign } from "lucide-react";

interface EventImpactFunnelProps {
  directScans: number;
  haloVisitors: number;
  attributedPipeline?: number;
  avgDealValue?: number;
  conversionRate?: number;
}

export const EventImpactFunnel = ({
  directScans,
  haloVisitors,
  attributedPipeline,
  avgDealValue = 10000,
  conversionRate = 0.15,
}: EventImpactFunnelProps) => {
  const totalImpact = directScans + haloVisitors;
  
  // Calculate pipeline from provided values or use passed attributedPipeline
  const calculatedPipeline = attributedPipeline ?? Math.round(totalImpact * conversionRate * avgDealValue);
  
  const stages = [
    {
      icon: Users,
      label: "direct scans",
      value: directScans,
      color: "bg-primary/20 border-primary/40",
      textColor: "text-primary"
    },
    {
      icon: Waves,
      label: "halo visitors",
      value: haloVisitors,
      color: "bg-primary/10 border-primary/30",
      textColor: "text-primary/80"
    },
    {
      icon: Target,
      label: "total impact",
      value: totalImpact,
      color: "bg-primary/30 border-primary/50",
      textColor: "text-primary"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-4 rounded-xl border ${stage.color} text-center`}
          >
            <stage.icon className={`w-5 h-5 mx-auto mb-2 ${stage.textColor}`} />
            <p className="text-2xl font-bold text-foreground">
              {stage.value.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">{stage.label}</p>
            
            {/* Connector arrow */}
            {index < stages.length - 1 && (
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                →
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Pipeline Estimate */}
      {calculatedPipeline > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">estimated pipeline</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            ${(calculatedPipeline / 1000).toFixed(0)}k
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            based on {(conversionRate * 100).toFixed(0)}% conversion × ${(avgDealValue / 1000).toFixed(0)}k avg deal
          </p>
        </motion.div>
      )}
    </div>
  );
};
