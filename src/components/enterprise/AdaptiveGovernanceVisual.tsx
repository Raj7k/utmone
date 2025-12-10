import { motion } from "framer-motion";
import { Shield, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export const AdaptiveGovernanceVisual = () => {
  const capabilities = [
    { name: "Can Create Links", granted: true },
    { name: "Can Edit Billing", granted: true },
    { name: "Can View Analytics", granted: true },
    { name: "Can Delete Links", granted: false },
    { name: "Can Manage Users", granted: false },
    { name: "Can Export Data", granted: true },
  ];

  return (
    <div className="relative">
      <Card className="p-8 md:p-12 bg-card border-2 border-border">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5">
            <Shield className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-label">
              custom role builder
            </h3>
            <p className="text-sm text-secondary-label">
              least privilege optimization in action
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                capability.granted 
                  ? 'bg-white/5 border-white/20' 
                  : 'bg-white/[0.02] border-white/10'
              }`}
            >
              <span className="font-medium text-label">{capability.name}</span>
              {capability.granted ? (
                <Check className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              ) : (
                <X className="w-5 h-5 text-secondary-label" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-xl border bg-white/5 border-white/20">
          <div className="flex items-center gap-2 text-sm text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            <Shield className="w-4 h-4" />
            <span className="font-semibold">
              Privilege Surface Area: Minimized (3/6 capabilities)
            </span>
          </div>
          <p className="text-xs text-secondary-label mt-2">
            This role satisfies work requirements while minimizing security risk
          </p>
        </div>
      </Card>
    </div>
  );
};
