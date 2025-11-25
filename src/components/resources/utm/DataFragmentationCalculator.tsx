import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export const DataFragmentationCalculator = () => {
  const [campaigns, setCampaigns] = useState("12");
  const [channels, setChannels] = useState("5");
  const [teamMembers, setTeamMembers] = useState("8");

  const calculateFragmentation = () => {
    const campaignsNum = parseInt(campaigns) || 0;
    const channelsNum = parseInt(channels) || 0;
    const teamNum = parseInt(teamMembers) || 0;

    // Without governance: assume 3-5 variations per parameter per person
    const variationsPerPerson = 4;
    const withoutGovernance = campaignsNum * channelsNum * (teamNum * variationsPerPerson);
    
    // With governance: consistent naming = campaigns * channels
    const withGovernance = campaignsNum * channelsNum;
    
    const fragmentationMultiplier = Math.round(withoutGovernance / withGovernance);
    
    // ROI calculation (simplified)
    const costPerHour = 75; // Avg marketing hourly rate
    const hoursWastedMonthly = teamNum * 2; // 2 hours/person/month fixing data
    const monthlyCost = hoursWastedMonthly * costPerHour;
    const annualCost = monthlyCost * 12;
    const toolCost = 1200; // Annual tool cost
    const roi = ((annualCost - toolCost) / toolCost * 100).toFixed(0);

    return {
      withoutGovernance,
      withGovernance,
      fragmentationMultiplier,
      monthlyCost,
      annualCost,
      toolCost,
      roi: parseInt(roi)
    };
  };

  const results = calculateFragmentation();

  return (
    <div className="space-y-6 p-6 bg-card border border-border/50 rounded-xl">
      <div>
        <h4 className="font-semibold text-foreground mb-2">Data Fragmentation Calculator</h4>
        <p className="text-sm text-muted-foreground">
          Calculate the cost of inconsistent UTM naming over 12 months
        </p>
      </div>

      {/* Input Fields */}
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="campaigns">Campaigns per month</Label>
          <Input
            id="campaigns"
            type="number"
            value={campaigns}
            onChange={(e) => setCampaigns(e.target.value)}
            min="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="channels">Marketing channels</Label>
          <Input
            id="channels"
            type="number"
            value={channels}
            onChange={(e) => setChannels(e.target.value)}
            min="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="team">Team members creating links</Label>
          <Input
            id="team"
            type="number"
            value={teamMembers}
            onChange={(e) => setTeamMembers(e.target.value)}
            min="1"
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4 pt-4 border-t border-border/30">
        {/* Fragmentation Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-red-50/50 border border-red-200/50 dark:bg-red-950/20 dark:border-red-800/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Without Governance</p>
            <p className="text-2xl font-bold text-red-500">{results.withoutGovernance}</p>
            <p className="text-xs text-muted-foreground mt-1">Fragmented rows in GA4</p>
          </div>
          <div className="p-4 bg-green-50/50 border border-green-200/50 dark:bg-green-950/20 dark:border-green-800/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">With Governance</p>
            <p className="text-2xl font-bold text-green-500">{results.withGovernance}</p>
            <p className="text-xs text-muted-foreground mt-1">Clean rows in GA4</p>
          </div>
        </div>

        {/* Multiplier Warning */}
        <div className="flex items-start gap-2 p-4 bg-yellow-50/50 border border-yellow-200/50 dark:bg-yellow-950/20 dark:border-yellow-800/50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              {results.fragmentationMultiplier}× Data Fragmentation
            </p>
            <p className="text-xs text-muted-foreground">
              Without governance, you'll have {results.fragmentationMultiplier}× more rows in your analytics, making campaign comparison and attribution nearly impossible.
            </p>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-foreground">Cost Analysis</h5>
          <div className="grid gap-2">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/30">
              <span className="text-sm text-muted-foreground">Time wasted monthly (fixing data)</span>
              <span className="text-sm font-semibold text-foreground">${results.monthlyCost}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/30">
              <span className="text-sm text-muted-foreground">Annual cost of bad data</span>
              <span className="text-sm font-semibold text-red-500">${results.annualCost}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/30">
              <span className="text-sm text-muted-foreground">UTM tool cost (annual)</span>
              <span className="text-sm font-semibold text-foreground">${results.toolCost}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50/50 border border-green-200/50 dark:bg-green-950/20 dark:border-green-800/50 rounded-lg">
              <span className="text-sm font-medium text-foreground">Return on Investment</span>
              <span className="text-2xl font-bold text-green-500">{results.roi}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
