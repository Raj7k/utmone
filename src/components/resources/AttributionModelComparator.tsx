import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AttributionModel {
  id: string;
  name: string;
  description: string;
  bestFor: string;
  complexity: number;
  whenToUse: string[];
  whenToAvoid: string[];
  weightDistribution: string;
}

const models: AttributionModel[] = [
  {
    id: "first-touch",
    name: "First-Touch",
    description: "100% credit to the first interaction",
    bestFor: "Brand awareness campaigns",
    complexity: 1,
    whenToUse: ["Early-stage companies", "Top-of-funnel focus", "Simple attribution needs"],
    whenToAvoid: ["Long sales cycles", "Multi-channel campaigns", "Complex journeys"],
    weightDistribution: "100% first touchpoint"
  },
  {
    id: "last-touch",
    name: "Last-Touch",
    description: "100% credit to the final interaction before conversion",
    bestFor: "Bottom-funnel optimization",
    complexity: 1,
    whenToUse: ["Short sales cycles", "Direct response campaigns", "Sales-driven orgs"],
    whenToAvoid: ["Brand building", "Long nurture cycles", "Multiple influencers"],
    weightDistribution: "100% last touchpoint"
  },
  {
    id: "linear",
    name: "Linear",
    description: "Equal credit distributed across all touchpoints",
    bestFor: "Balanced view of customer journey",
    complexity: 2,
    whenToUse: ["Multiple marketing channels", "Team collaboration", "Fair attribution"],
    whenToAvoid: ["Need to optimize specific stages", "Clear funnel priorities"],
    weightDistribution: "Equal across all touchpoints"
  },
  {
    id: "time-decay",
    name: "Time-Decay",
    description: "More credit to recent interactions",
    bestFor: "Sales enablement and late-stage nurture",
    complexity: 2,
    whenToUse: ["Long sales cycles", "Recent interactions matter more", "B2B sales"],
    whenToAvoid: ["Brand awareness focus", "Early-stage optimization"],
    weightDistribution: "Exponential increase toward conversion"
  },
  {
    id: "u-shaped",
    name: "U-Shaped",
    description: "40% first, 40% lead creation, 20% middle",
    bestFor: "Demand generation focus",
    complexity: 3,
    whenToUse: ["Lead gen campaigns", "Awareness + conversion", "$1-10M revenue"],
    whenToAvoid: ["Very short cycles", "Single-channel attribution"],
    weightDistribution: "40-20-40 distribution"
  },
  {
    id: "w-shaped",
    name: "W-Shaped",
    description: "30% first, 30% lead, 30% opportunity, 10% middle",
    bestFor: "Complex B2B sales with multiple stakeholders",
    complexity: 4,
    whenToUse: ["Enterprise B2B", "Long sales cycles", "$10M+ revenue"],
    whenToAvoid: ["Simple B2C", "Short cycles", "Limited data"],
    weightDistribution: "30-30-30-10 at key milestones"
  },
  {
    id: "custom-ml",
    name: "Custom ML",
    description: "Machine learning-based custom weighting",
    bestFor: "Data-rich organizations with technical resources",
    complexity: 5,
    whenToUse: ["Large datasets", "Complex attribution", "Technical team"],
    whenToAvoid: ["Limited data", "Small teams", "Early-stage"],
    weightDistribution: "Algorithm-determined weights"
  }
];

export const AttributionModelComparator = () => {
  const [selectedModel, setSelectedModel] = useState<string>("u-shaped");
  
  const currentModel = models.find(m => m.id === selectedModel) || models[4];

  return (
    <div className="space-y-8">
      {/* Model Selector */}
      <div className="flex flex-wrap gap-3">
        {models.map((model) => (
          <Button
            key={model.id}
            variant={selectedModel === model.id ? "default" : "outline"}
            onClick={() => setSelectedModel(model.id)}
            className="rounded-full"
          >
            {model.name}
          </Button>
        ))}
      </div>

      {/* Selected Model Details */}
      <motion.div
        key={selectedModel}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-2xl p-8 border border-border/50"
      >
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-3xl font-display font-semibold text-foreground">
                {currentModel.name}
              </h3>
              <div className="flex items-center gap-1">
                {Array.from({ length: currentModel.complexity }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'rgba(59,130,246,1)' }}
                  />
                ))}
                {Array.from({ length: 5 - currentModel.complexity }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-muted-foreground/30"
                  />
                ))}
              </div>
            </div>
            <p className="text-lg text-muted-foreground mb-2">
              {currentModel.description}
            </p>
            <p className="text-sm font-medium" style={{ color: 'rgba(59,130,246,1)' }}>
              best for: {currentModel.bestFor}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                when to use
              </h4>
              <ul className="space-y-2">
                {currentModel.whenToUse.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                when to avoid
              </h4>
              <ul className="space-y-2">
                {currentModel.whenToAvoid.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              weight distribution
            </h4>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-base font-mono text-foreground">
                {currentModel.weightDistribution}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
