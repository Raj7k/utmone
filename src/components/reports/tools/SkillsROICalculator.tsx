import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, TrendingUp } from "lucide-react";

const skills = [
  { name: "AI/ML Expertise", premium: 58, learningHours: 120, category: "A" },
  { name: "GTM Strategy", premium: 45, learningHours: 80, category: "A" },
  { name: "Attribution Modeling", premium: 42, learningHours: 60, category: "A" },
  { name: "SQL/Data Analysis", premium: 28, learningHours: 40, category: "B" },
  { name: "Salesforce Admin", premium: 22, learningHours: 30, category: "B" },
  { name: "Python Scripting", premium: 25, learningHours: 50, category: "B" },
  { name: "A/B Testing", premium: 18, learningHours: 20, category: "B" },
  { name: "SEO/SEM", premium: 12, learningHours: 25, category: "C" },
];

export const SkillsROICalculator = () => {
  const [currentSalary] = useState(95000);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName) ? prev.filter((s) => s !== skillName) : [...prev, skillName]
    );
  };

  const calculateROI = () => {
    const selected = skills.filter((s) => selectedSkills.includes(s.name));
    const totalPremium = selected.reduce((sum, s) => sum + s.premium, 0);
    const totalHours = selected.reduce((sum, s) => sum + s.learningHours, 0);
    const salaryIncrease = (currentSalary * totalPremium) / 100;
    const roi = totalHours > 0 ? salaryIncrease / totalHours : 0;

    return { totalPremium, totalHours, salaryIncrease, roi, selected };
  };

  const { totalPremium, totalHours, salaryIncrease, roi, selected } = calculateROI();

  return (
    <Card className="border-2 border-blazeOrange/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Zap className="h-6 w-6 text-blazeOrange" />
          Skills ROI Calculator
        </CardTitle>
        <p className="text-sm text-secondary-label">
          Calculate return on investment for learning new skills
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-wildSand/30 rounded-lg p-4">
          <p className="text-sm text-secondary-label mb-1">Your Current Salary</p>
          <p className="text-3xl font-bold text-deepSea">${currentSalary.toLocaleString()}</p>
        </div>

        <div>
          <p className="font-semibold text-foreground mb-4">Select Skills to Learn:</p>
          <div className="space-y-3">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-start gap-3 p-3 rounded-lg border border-deepSea/10 hover:bg-wildSand/20 transition-colors"
              >
                <Checkbox
                  checked={selectedSkills.includes(skill.name)}
                  onCheckedChange={() => toggleSkill(skill.name)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{skill.name}</p>
                    <span
                      className={`text-xs font-bold ${
                        skill.category === "A"
                          ? "text-blazeOrange"
                          : skill.category === "B"
                          ? "text-deepSea"
                          : "text-foreground"
                      }`}
                    >
                      Category {skill.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-secondary-label">
                    <span>+{skill.premium}% salary premium</span>
                    <span>•</span>
                    <span>{skill.learningHours} hours to learn</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedSkills.length > 0 && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blazeOrange/10 to-deepSea/10 rounded-xl p-6">
                <p className="text-sm text-secondary-label mb-2">Total Salary Increase</p>
                <p className="text-3xl font-bold text-blazeOrange">
                  +${salaryIncrease.toLocaleString()}
                </p>
                <p className="text-sm text-secondary-label mt-2">+{totalPremium}% premium</p>
              </div>
              <div className="bg-gradient-to-br from-deepSea/10 to-wildSand/50 rounded-xl p-6">
                <p className="text-sm text-secondary-label mb-2">Total Learning Investment</p>
                <p className="text-3xl font-bold text-deepSea">{totalHours} hours</p>
                <p className="text-sm text-secondary-label mt-2">
                  ≈ {Math.round(totalHours / 10)} weeks at 10hrs/week
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blazeOrange/5 to-deepSea/5 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blazeOrange" />
                <p className="text-sm font-semibold text-foreground">Return on Investment</p>
              </div>
              <p className="text-4xl font-bold text-blazeOrange mb-2">
                ${Math.round(roi).toLocaleString()}/hour
              </p>
              <p className="text-sm text-secondary-label">
                Every hour you invest in learning yields ${Math.round(roi)} in annual salary
                increase
              </p>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-lg p-4 border-2 border-dashed border-white/20">
              <p className="font-semibold text-white mb-3">Recommended Learning Path:</p>
              <ol className="space-y-2">
                {selected
                  .sort((a, b) => b.premium / b.learningHours - a.premium / a.learningHours)
                  .map((skill, index) => (
                    <li key={skill.name} className="flex items-center gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blazeOrange text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="flex-1">{skill.name}</span>
                      <span className="text-xs text-secondary-label">
                        ${Math.round((currentSalary * skill.premium) / 100 / skill.learningHours)}/hr ROI
                      </span>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
