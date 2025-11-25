import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const NamingConventionSimulator = () => {
  const [source, setSource] = useState("LinkedIn");
  const [medium, setMedium] = useState("Paid Social");
  const [campaign, setCampaign] = useState("Q1 Product Launch");

  const conventions = [
    {
      name: "Lowercase Hyphen (Recommended)",
      transform: (val: string) => val.toLowerCase().replace(/\s+/g, "-"),
      correct: true,
      explanation: "Prevents data fragmentation, GA4-friendly"
    },
    {
      name: "CamelCase (Wrong)",
      transform: (val: string) => val.replace(/\s+/g, "").replace(/^\w/, c => c.toLowerCase()).replace(/\s\w/g, c => c.toUpperCase()),
      correct: false,
      explanation: "Creates separate rows in analytics"
    },
    {
      name: "Underscore Separator (Wrong)",
      transform: (val: string) => val.toLowerCase().replace(/\s+/g, "_"),
      correct: false,
      explanation: "Inconsistent with best practices"
    },
    {
      name: "Mixed Case (Wrong)",
      transform: (val: string) => val,
      correct: false,
      explanation: "Most fragmented - 'LinkedIn' ≠ 'linkedin' in GA4"
    }
  ];

  const calculateFragmentation = () => {
    // Simulate how many extra rows you'd get with mixed naming
    const variants = [
      source.toLowerCase(),
      source.toUpperCase(),
      source,
      source.replace(/\s+/g, "-").toLowerCase(),
      source.replace(/\s+/g, "_").toLowerCase()
    ];
    return new Set(variants).size;
  };

  const fragmentation = calculateFragmentation();

  return (
    <div className="space-y-6 p-6 bg-card border border-border/50 rounded-xl">
      <div>
        <h4 className="font-semibold text-foreground mb-2">Naming Convention Simulator</h4>
        <p className="text-sm text-muted-foreground">
          See how different naming conventions affect your analytics data
        </p>
      </div>

      {/* Input Fields */}
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="source">utm_source</Label>
          <Input
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="LinkedIn"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medium">utm_medium</Label>
          <Input
            id="medium"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            placeholder="Paid Social"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="campaign">utm_campaign</Label>
          <Input
            id="campaign"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            placeholder="Q1 Product Launch"
          />
        </div>
      </div>

      {/* Convention Comparison */}
      <div className="space-y-3">
        <h5 className="text-sm font-semibold text-foreground">Convention Results</h5>
        {conventions.map((conv, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              conv.correct
                ? "bg-green-50/50 border-green-200/50 dark:bg-green-950/20 dark:border-green-800/50"
                : "bg-red-50/50 border-red-200/50 dark:bg-red-950/20 dark:border-red-800/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{conv.name}</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  conv.correct ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {conv.correct ? "✓ Correct" : "✗ Wrong"}
              </span>
            </div>
            <code className="text-sm text-foreground block mb-2">
              utm_source={conv.transform(source)}&utm_medium={conv.transform(medium)}&utm_campaign={conv.transform(campaign)}
            </code>
            <p className="text-xs text-muted-foreground">{conv.explanation}</p>
          </div>
        ))}
      </div>

      {/* Fragmentation Warning */}
      {fragmentation > 1 && (
        <div className="flex items-start gap-2 p-4 bg-yellow-50/50 border border-yellow-200/50 dark:bg-yellow-950/20 dark:border-yellow-800/50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Data Fragmentation Risk
            </p>
            <p className="text-xs text-muted-foreground">
              Using inconsistent naming creates {fragmentation}× more rows in GA4, making reporting harder and attribution less reliable.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
