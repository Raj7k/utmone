import { ToolLayout } from "@/components/tools/ToolLayout";
import { Sparkles, Calculator, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const AIvsHumanROI = () => {
  const roleRisks = [
    { role: "Junior Content Writer", risk: 75, color: "destructive" },
    { role: "Social Media Coordinator", risk: 65, color: "warning" },
    { role: "Email Marketing Specialist", risk: 55, color: "warning" },
    { role: "Marketing Coordinator", risk: 50, color: "warning" },
    { role: "Demand Gen Specialist", risk: 40, color: "success" },
    { role: "Marketing Manager", risk: 35, color: "success" },
    { role: "Marketing Ops Director", risk: 25, color: "success" },
    { role: "VP Marketing", risk: 15, color: "success" }
  ];

  const aiSkillsPremiums = [
    { skill: "AI/ML Expertise", premium: 15000 },
    { skill: "Marketing Automation", premium: 12000 },
    { skill: "Prompt Engineering", premium: 8000 },
    { skill: "Data Analysis/Python", premium: 15000 },
    { skill: "AI Tool Proficiency", premium: 6000 }
  ];

  return (
    <ToolLayout
      title="AI vs. Human ROI Calculator"
      description="understand role automation risk and AI skills premiums"
      icon={Sparkles}
      relatedTools={[
        { title: "Market Value Calculator", href: "/resources/tools/market-value-calculator", icon: Calculator },
        { title: "Team Budget Optimizer", href: "/resources/tools/team-budget-optimizer", icon: Users }
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="lowercase">role automation risk scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {roleRisks.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.role}</span>
                <Badge variant={item.color === "destructive" ? "destructive" : item.color === "warning" ? "secondary" : "default"}>
                  {item.risk}/100
                </Badge>
              </div>
              <Progress value={item.risk} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {item.risk >= 60 && "High risk - focus on strategic skills and AI tool mastery"}
                {item.risk >= 40 && item.risk < 60 && "Medium risk - complement AI with human judgment"}
                {item.risk < 40 && "Low risk - strategic and leadership skills remain essential"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="lowercase">AI skills salary premiums</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiSkillsPremiums.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 rounded-lg border">
                <span className="font-medium">{item.skill}</span>
                <span className="text-xl font-display font-bold text-primary">
                  +${item.premium.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="lowercase">future-proofing recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">Skills least likely to be automated:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Strategic planning & executive communication</li>
              <li>• Stakeholder management & cross-functional leadership</li>
              <li>• Creative direction & brand positioning</li>
              <li>• Team management & mentorship</li>
              <li>• Business acumen & budget management</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default AIvsHumanROI;