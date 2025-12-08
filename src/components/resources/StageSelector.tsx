import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, DollarSign, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stage {
  id: number;
  title: string;
  revenue: string;
  model: string;
  complexity: number;
  successRate: string;
  description: string;
  keyMetrics: string[];
  tools: string[];
}

const stages: Stage[] = [
  {
    id: 1,
    title: "Foundation Phase",
    revenue: "$0-1M",
    model: "First-Touch + Self-Reported",
    complexity: 1,
    successRate: "85%",
    description: "Start simple with spreadsheets and free tools. Focus on lead source capture and founder-driven attribution.",
    keyMetrics: ["Lead source capture rate >95%", "Cost per demo booked", "Source to close rate"],
    tools: ["Google Analytics 4", "HubSpot Free CRM", "Google Sheets"]
  },
  {
    id: 2,
    title: "Growth Phase",
    revenue: "$1-10M",
    model: "U-Shaped + Linear Hybrid",
    complexity: 3,
    successRate: "65%",
    description: "Implement multi-touch attribution with CRM automation. Track the full customer journey from first touch to close.",
    keyMetrics: ["Multi-touch attribution accuracy", "Channel ROI", "CAC by source"],
    tools: ["HubSpot Professional", "Google Analytics 4", "Attribution software"]
  },
  {
    id: 3,
    title: "Scale Phase",
    revenue: "$10-100M",
    model: "W-Shaped + Custom ML",
    complexity: 4,
    successRate: "45%",
    description: "Custom attribution models with machine learning. Account-based measurement and predictive analytics.",
    keyMetrics: ["Model accuracy", "Incrementality", "Account influence"],
    tools: ["Salesforce", "Bizible/Marketo", "Custom ML models"]
  },
  {
    id: 4,
    title: "Enterprise Phase",
    revenue: "$100M+",
    model: "AI-Driven Custom",
    complexity: 5,
    successRate: "29%",
    description: "Sophisticated AI models with Shapley values and incrementality testing. Privacy-compliant cross-channel measurement.",
    keyMetrics: ["Shapley value accuracy", "Incrementality lift", "MMM correlation"],
    tools: ["Custom data warehouse", "ML platforms", "Media Mix Modeling"]
  }
];

export const StageSelector = () => {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {stages.map((stage) => (
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: stage.id * 0.1 }}
          className={cn(
            "bg-card rounded-2xl border-2 transition-all cursor-pointer",
            selectedStage === stage.id
              ? "border-primary shadow-[0_10px_25px_-5px_hsl(0_0%_0%_/_0.3)]"
              : "border-border/50 hover:border-border"
          )}
          onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
        >
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-primary">
                    stage {stage.id}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    {stage.revenue}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: stage.complexity }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                    ))}
                    {Array.from({ length: 5 - stage.complexity }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-muted-foreground/30" />
                    ))}
                  </div>
                </div>
                
                <h3 className="text-2xl font-display font-semibold text-foreground mb-2">
                  {stage.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {stage.model}
                </p>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">success rate:</span>
                  <span className="text-sm font-semibold text-foreground">{stage.successRate}</span>
                </div>
              </div>
              
              <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                {selectedStage === stage.id ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
            
            <AnimatePresence>
              {selectedStage === stage.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 pt-6 border-t border-border/50 space-y-4">
                    <p className="text-base text-foreground leading-relaxed">
                      {stage.description}
                    </p>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        key metrics
                      </h4>
                      <ul className="space-y-2">
                        {stage.keyMetrics.map((metric, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="mt-1 text-primary">•</span>
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        recommended tools
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {stage.tools.map((tool, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full text-xs border bg-primary/10 text-primary border-primary/20"
                            >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
};