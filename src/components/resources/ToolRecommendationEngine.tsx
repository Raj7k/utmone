import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Tool {
  name: string;
  category: string;
  monthlyCost: number;
  setupTime: string;
  complexity: number;
}

interface ToolStack {
  tools: Tool[];
  totalCost: number;
  setupTime: string;
  complexity: string;
}

const toolDatabase: Record<string, Record<string, ToolStack>> = {
  "0-1m": {
    "0-1k": {
      tools: [
        { name: "Google Analytics 4", category: "Analytics", monthlyCost: 0, setupTime: "2 hours", complexity: 1 },
        { name: "HubSpot Free CRM", category: "CRM", monthlyCost: 0, setupTime: "3 hours", complexity: 1 },
        { name: "Google Sheets", category: "Reporting", monthlyCost: 0, setupTime: "1 hour", complexity: 1 }
      ],
      totalCost: 0,
      setupTime: "1 day",
      complexity: "Very Low"
    },
    "1-5k": {
      tools: [
        { name: "Google Analytics 4", category: "Analytics", monthlyCost: 0, setupTime: "2 hours", complexity: 1 },
        { name: "HubSpot Starter", category: "CRM", monthlyCost: 45, setupTime: "4 hours", complexity: 2 },
        { name: "Ruler Analytics", category: "Attribution", monthlyCost: 199, setupTime: "6 hours", complexity: 2 }
      ],
      totalCost: 244,
      setupTime: "2 days",
      complexity: "Low"
    }
  },
  "1-10m": {
    "1-5k": {
      tools: [
        { name: "Google Analytics 4", category: "Analytics", monthlyCost: 0, setupTime: "2 hours", complexity: 2 },
        { name: "HubSpot Professional", category: "CRM", monthlyCost: 800, setupTime: "1 week", complexity: 3 },
        { name: "Ruler Analytics", category: "Attribution", monthlyCost: 199, setupTime: "6 hours", complexity: 2 },
        { name: "Segment", category: "CDP", monthlyCost: 120, setupTime: "1 week", complexity: 3 }
      ],
      totalCost: 1119,
      setupTime: "2 weeks",
      complexity: "Medium"
    },
    "5-20k": {
      tools: [
        { name: "Google Analytics 360", category: "Analytics", monthlyCost: 12500, setupTime: "2 weeks", complexity: 4 },
        { name: "HubSpot Professional", category: "CRM", monthlyCost: 800, setupTime: "1 week", complexity: 3 },
        { name: "Bizible", category: "Attribution", monthlyCost: 3000, setupTime: "2 weeks", complexity: 4 },
        { name: "Segment", category: "CDP", monthlyCost: 120, setupTime: "1 week", complexity: 3 }
      ],
      totalCost: 16420,
      setupTime: "1 month",
      complexity: "Medium-High"
    }
  },
  "10-100m": {
    "5-20k": {
      tools: [
        { name: "Google Analytics 360", category: "Analytics", monthlyCost: 12500, setupTime: "2 weeks", complexity: 4 },
        { name: "Salesforce", category: "CRM", monthlyCost: 3000, setupTime: "1 month", complexity: 4 },
        { name: "Bizible/Marketo", category: "Attribution", monthlyCost: 3000, setupTime: "2 weeks", complexity: 4 },
        { name: "Segment", category: "CDP", monthlyCost: 300, setupTime: "1 week", complexity: 3 }
      ],
      totalCost: 18800,
      setupTime: "6 weeks",
      complexity: "High"
    },
    "20k+": {
      tools: [
        { name: "Google Analytics 360", category: "Analytics", monthlyCost: 12500, setupTime: "2 weeks", complexity: 4 },
        { name: "Salesforce Enterprise", category: "CRM", monthlyCost: 5000, setupTime: "1 month", complexity: 5 },
        { name: "Custom Attribution Platform", category: "Attribution", monthlyCost: 8000, setupTime: "3 months", complexity: 5 },
        { name: "Snowflake", category: "Data Warehouse", monthlyCost: 2000, setupTime: "1 month", complexity: 4 },
        { name: "Looker", category: "BI", monthlyCost: 3000, setupTime: "2 weeks", complexity: 4 }
      ],
      totalCost: 30500,
      setupTime: "4 months",
      complexity: "Very High"
    }
  },
  "100m+": {
    "20k+": {
      tools: [
        { name: "Custom Data Warehouse", category: "Infrastructure", monthlyCost: 15000, setupTime: "6 months", complexity: 5 },
        { name: "Salesforce Enterprise", category: "CRM", monthlyCost: 5000, setupTime: "1 month", complexity: 5 },
        { name: "Custom ML Platform", category: "Attribution", monthlyCost: 20000, setupTime: "6 months", complexity: 5 },
        { name: "Tableau/Looker", category: "BI", monthlyCost: 3000, setupTime: "1 month", complexity: 4 },
        { name: "Media Mix Modeling", category: "Analytics", monthlyCost: 10000, setupTime: "3 months", complexity: 5 }
      ],
      totalCost: 53000,
      setupTime: "12 months",
      complexity: "Enterprise"
    }
  }
};

export const ToolRecommendationEngine = () => {
  const [revenueStage, setRevenueStage] = useState<string>("1-10m");
  const [budget, setBudget] = useState<string>("1-5k");

  const getRecommendation = (): ToolStack => {
    const stageData = toolDatabase[revenueStage];
    if (!stageData) return toolDatabase["1-10m"]["1-5k"];
    
    return stageData[budget] || Object.values(stageData)[0];
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="revenue-stage">Your Revenue Stage</Label>
          <Select value={revenueStage} onValueChange={setRevenueStage}>
            <SelectTrigger id="revenue-stage">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1m">$0-1M (Foundation)</SelectItem>
              <SelectItem value="1-10m">$1-10M (Growth)</SelectItem>
              <SelectItem value="10-100m">$10-100M (Scale)</SelectItem>
              <SelectItem value="100m+">$100M+ (Enterprise)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Monthly Attribution Budget</Label>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger id="budget">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1k">$0-1K (Bootstrap)</SelectItem>
              <SelectItem value="1-5k">$1-5K (Starter)</SelectItem>
              <SelectItem value="5-20k">$5-20K (Professional)</SelectItem>
              <SelectItem value="20k+">$20K+ (Enterprise)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recommendation Summary */}
      <motion.div
        key={`${revenueStage}-${budget}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl p-8 border-2"
        style={{ background: 'linear-gradient(to bottom right, rgba(59,130,246,0.05), rgba(59,130,246,0.1))', borderColor: 'rgba(59,130,246,0.2)' }}
      >
        <h3 className="text-2xl font-display font-semibold text-foreground mb-6">
          Recommended Tool Stack
        </h3>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <DollarSign className="w-6 h-6" style={{ color: 'rgba(59,130,246,1)' }} />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
              <div className="text-lg font-semibold text-foreground">
                ${recommendation.totalCost.toLocaleString()}/mo
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <Clock className="w-6 h-6" style={{ color: 'rgba(59,130,246,1)' }} />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Setup Time</div>
              <div className="text-lg font-semibold text-foreground">
                {recommendation.setupTime}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <Zap className="w-6 h-6" style={{ color: 'rgba(59,130,246,1)' }} />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Complexity</div>
              <div className="text-lg font-semibold text-foreground">
                {recommendation.complexity}
              </div>
            </div>
          </div>
        </div>

        {/* Tool List */}
        <div className="space-y-3">
          {recommendation.tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-4 border border-border/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-foreground">{tool.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                      {tool.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>${tool.monthlyCost}/mo</span>
                    <span>•</span>
                    <span>{tool.setupTime} setup</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: tool.complexity }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(59,130,246,1)' }} />
                      ))}
                      {Array.from({ length: 5 - tool.complexity }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Export Button */}
      <Button variant="outline" className="w-full">
        Export Tool Stack (PDF)
      </Button>
    </div>
  );
};
