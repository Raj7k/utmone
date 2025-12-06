import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MousePointer, Eye, ShoppingCart, CreditCard } from "lucide-react";

interface TouchPoint {
  id: number;
  stage: string;
  channel: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  icon: any;
  weight: number;
}

export const MultiTouchAttributionSimulator = () => {
  const [selectedModel, setSelectedModel] = useState<string>("linear");
  
  const touchPoints: TouchPoint[] = [
    {
      id: 1,
      stage: "Awareness",
      channel: "LinkedIn Ad",
      utmSource: "linkedin",
      utmMedium: "paid-social",
      utmCampaign: "q1-awareness",
      icon: Eye,
      weight: 0
    },
    {
      id: 2,
      stage: "Consideration",
      channel: "Email Newsletter",
      utmSource: "newsletter",
      utmMedium: "email",
      utmCampaign: "weekly-digest",
      icon: MousePointer,
      weight: 0
    },
    {
      id: 3,
      stage: "Decision",
      channel: "Google Search",
      utmSource: "google",
      utmMedium: "organic",
      utmCampaign: "brand-search",
      icon: ShoppingCart,
      weight: 0
    },
    {
      id: 4,
      stage: "Conversion",
      channel: "Retargeting Ad",
      utmSource: "google-ads",
      utmMedium: "display",
      utmCampaign: "retargeting-cart",
      icon: CreditCard,
      weight: 0
    }
  ];

  const calculateWeights = (model: string) => {
    switch (model) {
      case "linear":
        return touchPoints.map(tp => ({ ...tp, weight: 25 }));
      case "first-touch":
        return touchPoints.map((tp, i) => ({ ...tp, weight: i === 0 ? 100 : 0 }));
      case "last-touch":
        return touchPoints.map((tp, i) => ({ ...tp, weight: i === touchPoints.length - 1 ? 100 : 0 }));
      case "time-decay":
        return touchPoints.map((tp, i) => ({ ...tp, weight: Math.round((i + 1) * 10) }));
      case "u-shaped":
        return touchPoints.map((tp, i) => ({ 
          ...tp, 
          weight: i === 0 || i === touchPoints.length - 1 ? 40 : 10 
        }));
      default:
        return touchPoints;
    }
  };

  const attributedTouchPoints = calculateWeights(selectedModel);

  return (
    <Card className="p-8 bg-card border border-border rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          Multi-Touch Attribution Simulator
        </h3>
        <p className="text-sm text-muted-foreground">
          See how different attribution models assign credit to touchpoints across the customer journey
        </p>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-3 block">
          Attribution Model
        </label>
        <div className="flex flex-wrap gap-2">
          {["linear", "first-touch", "last-touch", "time-decay", "u-shaped"].map((model) => (
            <Button
              key={model}
              variant={selectedModel === model ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModel(model)}
              className="capitalize"
            >
              {model.replace("-", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {attributedTouchPoints.map((tp, index) => {
          const Icon = tp.icon;
          return (
            <div key={tp.id} className="relative">
              {index < attributedTouchPoints.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
              )}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{tp.stage}</p>
                      <p className="text-sm text-muted-foreground">{tp.channel}</p>
                    </div>
                    <Badge variant={tp.weight > 0 ? "default" : "outline"}>
                      {tp.weight}% credit
                    </Badge>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground bg-muted/30 px-3 py-2 rounded">
                    utm_source={tp.utmSource} | utm_medium={tp.utmMedium}
                  </div>
                  {tp.weight > 0 && (
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500 bg-primary"
                        style={{ width: `${tp.weight}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Key Insight:</strong>{" "}
          {selectedModel === "linear" && "Linear attribution gives equal credit to all touchpoints, showing the full journey."}
          {selectedModel === "first-touch" && "First-touch attributes 100% credit to initial awareness, ignoring the journey."}
          {selectedModel === "last-touch" && "Last-touch gives all credit to the final conversion touchpoint."}
          {selectedModel === "time-decay" && "Time-decay weights recent touchpoints more heavily than earlier ones."}
          {selectedModel === "u-shaped" && "U-shaped gives 40% to first and last touch, 20% to middle touchpoints."}
        </p>
      </div>
    </Card>
  );
};
