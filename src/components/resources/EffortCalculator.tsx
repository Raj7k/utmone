import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LazyPieChart, LazyChartContainer, Pie, Cell, ResponsiveContainer, Legend } from "@/components/charts/LazyCharts";

interface ContentType {
  name: string;
  traditionalHours: number;
  aiHours: number;
  aiPercentage: number;
  humanPercentage: number;
}

const contentTypes: Record<string, ContentType> = {
  "blog-post": {
    name: "Blog Post (1,500 words)",
    traditionalHours: 8,
    aiHours: 3,
    aiPercentage: 70,
    humanPercentage: 30
  },
  "whitepaper": {
    name: "Whitepaper (5,000 words)",
    traditionalHours: 40,
    aiHours: 12,
    aiPercentage: 75,
    humanPercentage: 25
  },
  "social-campaign": {
    name: "Social Media Campaign (10 posts)",
    traditionalHours: 4,
    aiHours: 1,
    aiPercentage: 80,
    humanPercentage: 20
  },
  "email-series": {
    name: "Email Series (5 emails)",
    traditionalHours: 6,
    aiHours: 2,
    aiPercentage: 75,
    humanPercentage: 25
  },
  "video-script": {
    name: "Video Script (5 minutes)",
    traditionalHours: 5,
    aiHours: 2,
    aiPercentage: 65,
    humanPercentage: 35
  },
  "landing-page": {
    name: "Landing Page Copy",
    traditionalHours: 10,
    aiHours: 3,
    aiPercentage: 70,
    humanPercentage: 30
  },
  "case-study": {
    name: "Case Study (2,000 words)",
    traditionalHours: 12,
    aiHours: 4,
    aiPercentage: 68,
    humanPercentage: 32
  },
  "webinar-content": {
    name: "Webinar Deck & Script",
    traditionalHours: 16,
    aiHours: 5,
    aiPercentage: 70,
    humanPercentage: 30
  }
};

export const EffortCalculator = () => {
  const [selectedType, setSelectedType] = useState<string>("blog-post");
  const [piecesPerMonth, setPiecesPerMonth] = useState<number>(4);

  const contentType = contentTypes[selectedType];
  
  const hoursSavedPerPiece = contentType.traditionalHours - contentType.aiHours;
  const totalTraditionalHours = contentType.traditionalHours * piecesPerMonth;
  const totalAIHours = contentType.aiHours * piecesPerMonth;
  const totalHoursSaved = hoursSavedPerPiece * piecesPerMonth;
  const efficiencyGain = ((hoursSavedPerPiece / contentType.traditionalHours) * 100).toFixed(0);

  const distributionData = [
    { name: "AI Handles", value: contentType.aiPercentage, color: "hsl(217, 91%, 50%)" },
    { name: "Human Adds", value: contentType.humanPercentage, color: "hsl(48, 100%, 50%)" }
  ];

  return (
    <Card className="glass-card p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-display font-bold text-foreground">AI vs human effort calculator</h3>
        <p className="text-muted-foreground">
          calculate time savings with AI-assisted content creation
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>content type</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(contentTypes).map(([key, type]) => (
                <SelectItem key={key} value={key}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>pieces per month</Label>
          <div className="flex gap-2">
            {[1, 2, 4, 8, 12, 20].map((num) => (
              <Button
                key={num}
                variant={piecesPerMonth === num ? "default" : "outline"}
                size="sm"
                onClick={() => setPiecesPerMonth(num)}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Time Breakdown */}
        <div className="space-y-6">
          <h4 className="font-display font-semibold text-lg text-foreground">time breakdown</h4>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">traditional approach (per piece)</p>
              <p className="text-2xl font-display font-bold text-foreground">{contentType.traditionalHours} hours</p>
            </div>

            <div className="p-4 rounded-lg border-2 bg-primary/10 border-primary/30">
              <p className="text-sm text-muted-foreground">with AI assistance (per piece)</p>
              <p className="text-2xl font-display font-bold text-primary">{contentType.aiHours} hours</p>
            </div>

            <div className="p-4 bg-system-green/10 rounded-lg border-2 border-system-green/30">
              <p className="text-sm text-muted-foreground">time saved (per piece)</p>
              <p className="text-2xl font-display font-bold text-system-green">
                {hoursSavedPerPiece} hours
                <span className="text-sm ml-2">({efficiencyGain}% faster)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Effort Distribution */}
        <div className="space-y-6">
          <h4 className="font-display font-semibold text-lg text-foreground">effort distribution</h4>
          
          <LazyChartContainer height={200}>
            <ResponsiveContainer width="100%" height={200}>
              <LazyPieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </LazyPieChart>
            </ResponsiveContainer>
          </LazyChartContainer>

          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>AI handles repetitive tasks: research, drafting, optimization</p>
            <p>human adds: strategy, creativity, brand voice, fact-checking</p>
          </div>
        </div>
      </div>

      {/* Monthly ROI */}
      <div className="border-t border-border pt-6 space-y-4">
        <h4 className="font-display font-semibold text-lg text-foreground">monthly ROI</h4>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">traditional</p>
            <p className="text-2xl font-display font-bold text-foreground">{totalTraditionalHours}h</p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-primary/10">
            <p className="text-sm text-muted-foreground mb-1">with AI</p>
            <p className="text-2xl font-display font-bold text-primary">{totalAIHours}h</p>
          </div>
          
          <div className="text-center p-4 bg-system-green/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">saved</p>
            <p className="text-2xl font-display font-bold text-system-green">{totalHoursSaved}h</p>
          </div>
        </div>

        <div className="text-center p-6 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
          <p className="text-sm text-muted-foreground mb-2">
            that's equivalent to
          </p>
          <p className="text-3xl font-display font-bold text-primary">
            {(totalHoursSaved / 40).toFixed(1)} weeks
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            of productivity gained per month
          </p>
        </div>
      </div>
    </Card>
  );
};
