import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { HowToUse } from "@/components/tools/HowToUse";
import { Users, Calculator, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const TeamBudgetOptimizer = () => {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [budget, setBudget] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any>(null);

  const teamGoals = [
    "Demand Generation",
    "Content Marketing",
    "Events & Field Marketing",
    "Marketing Operations",
    "Analytics & Reporting"
  ];

  const handleOptimize = async () => {
    if (!budget || parseInt(budget) < 50000) {
      toast({
        title: "invalid budget",
        description: "please enter a budget of at least $50,000",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    // Simulate AI optimization
    setTimeout(() => {
      setRecommendations({
        composition: [
          { role: "Senior Marketing Manager", salary: 140000, fte: 1 },
          { role: "Marketing Specialist", salary: 70000, fte: 2 },
          { role: "Marketing Coordinator", salary: 50000, fte: 1 }
        ],
        alternatives: [
          "Alternative: 1 Director ($180K) + 2 Coordinators ($50K each)",
          "Alternative: 3 Mid-level Specialists ($90K each)"
        ]
      });
      setIsOptimizing(false);
      toast({
        title: "optimization complete",
        description: "team recommendations generated"
      });
    }, 2000);
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Team Budget Optimizer",
          "applicationCategory": "BusinessApplication",
          "description": "Optimize team composition within budget constraints with AI-powered recommendations",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "operatingSystem": "Web Browser",
          "author": { "@type": "Organization", "name": "utm.one" }
        })}
      </script>
      <ToolLayout
      title="Team Budget Optimizer"
      description="build the optimal marketing team within your budget"
      icon={Users}
      relatedTools={[
        { title: "Market Value Calculator", href: "/resources/tools/market-value-calculator", icon: Calculator },
        { title: "Career Path Optimizer", href: "/resources/tools/career-path-optimizer", icon: TrendingUp }
      ]}
    >
      <HowToUse steps={[
        { title: "Enter your budget", description: "Input total hiring budget (minimum $50,000)" },
        { title: "Select team goals", description: "Check objectives your team needs to achieve" },
        { title: "Generate recommendations", description: "Click generate to see optimal team composition" },
        { title: "Review alternatives", description: "Explore different seniority and role combinations" }
      ]} />

      <Card>
        <CardHeader>
          <CardTitle className="lowercase">budget & goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="budget">Total Hiring Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              placeholder="400000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Team Objectives</Label>
            {teamGoals.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={goals.includes(goal)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setGoals([...goals, goal]);
                    } else {
                      setGoals(goals.filter(g => g !== goal));
                    }
                  }}
                />
                <label htmlFor={goal} className="text-sm cursor-pointer">
                  {goal}
                </label>
              </div>
            ))}
          </div>

          <Button onClick={handleOptimize} disabled={isOptimizing} className="w-full">
            {isOptimizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Team Recommendations
          </Button>
        </CardContent>
      </Card>

      {recommendations && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="lowercase">recommended team composition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.composition.map((member: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-4 rounded-lg border">
                    <div>
                      <div className="font-medium">{member.fte}x {member.role}</div>
                      <div className="text-sm text-muted-foreground">
                        ${member.salary.toLocaleString()} each
                      </div>
                    </div>
                    <div className="text-lg font-display font-bold">
                      ${(member.salary * member.fte).toLocaleString()}
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Budget Used</span>
                    <span className="text-2xl font-display font-bold text-primary">
                      ${recommendations.composition.reduce((sum: number, m: any) => sum + (m.salary * m.fte), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="lowercase">alternative scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.alternatives.map((alt: string, index: number) => (
                  <li key={index} className="text-sm text-muted-foreground">• {alt}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
      </ToolLayout>
    </>
  );
};

export default TeamBudgetOptimizer;