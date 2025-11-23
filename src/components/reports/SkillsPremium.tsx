import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface Skill {
  name: string;
  premium: number;
  category: "technical" | "strategic" | "leadership";
  demandLevel: "high" | "medium";
}

const skills: Skill[] = [
  { name: "AI/Machine Learning", premium: 15000, category: "technical", demandLevel: "high" },
  { name: "Marketing Automation (HubSpot/Marketo)", premium: 12000, category: "technical", demandLevel: "high" },
  { name: "Data Analytics & BI", premium: 11000, category: "technical", demandLevel: "high" },
  { name: "Salesforce Advanced Admin", premium: 10000, category: "technical", demandLevel: "high" },
  { name: "Revenue Operations", premium: 14000, category: "strategic", demandLevel: "high" },
  { name: "Account-Based Marketing (ABM)", premium: 9000, category: "strategic", demandLevel: "high" },
  { name: "Growth Marketing", premium: 10000, category: "strategic", demandLevel: "medium" },
  { name: "Marketing Attribution", premium: 8000, category: "strategic", demandLevel: "medium" },
  { name: "Team Leadership (5+ reports)", premium: 13000, category: "leadership", demandLevel: "high" },
  { name: "Cross-functional Stakeholder Mgmt", premium: 7000, category: "leadership", demandLevel: "medium" },
  { name: "Product Marketing", premium: 11000, category: "strategic", demandLevel: "high" },
  { name: "Demand Generation", premium: 9500, category: "strategic", demandLevel: "high" },
  { name: "SQL/Python for Marketing", premium: 12000, category: "technical", demandLevel: "medium" },
  { name: "Conversion Rate Optimization", premium: 8500, category: "technical", demandLevel: "medium" },
  { name: "Customer Lifecycle Marketing", premium: 7500, category: "strategic", demandLevel: "medium" },
];

const categoryColors = {
  technical: "deepSea",
  strategic: "blazeOrange",
  leadership: "mirage"
};

export const SkillsPremium = () => {
  const sortedSkills = [...skills].sort((a, b) => b.premium - a.premium);
  const maxPremium = Math.max(...skills.map(s => s.premium));

  return (
    <Card className="bg-wildSand/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blazeOrange" />
          Skills That Command Premium Salaries
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Average additional compensation above base role salary
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedSkills.map((skill, index) => {
            const percentage = (skill.premium / maxPremium) * 100;
            const colorClass = categoryColors[skill.category];

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs border-${colorClass} text-${colorClass}`}
                    >
                      {skill.category}
                    </Badge>
                    {skill.demandLevel === "high" && (
                      <Badge className="text-xs bg-blazeOrange">High Demand</Badge>
                    )}
                  </div>
                  <span className="font-bold text-blazeOrange">
                    +${(skill.premium / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r from-deepSea to-blazeOrange rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg border-2 border-blazeOrange/20">
          <h4 className="font-semibold text-blazeOrange mb-3">💡 Career Strategy Insight</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Professionals with 3+ skills from the top 5 list typically earn 25-40% above their base role median. 
            Technical skills (AI/ML, Data Analytics, SQL) show the highest premium growth trajectory, while strategic 
            skills (RevOps, ABM) provide the best career advancement acceleration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
