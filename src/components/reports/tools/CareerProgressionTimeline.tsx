import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rocket, Clock } from "lucide-react";

const careerPaths = {
  "Product Marketing Manager": [
    { role: "PMM (IC)", years: 0, salary: 95 },
    { role: "Senior PMM", years: 3, salary: 125 },
    { role: "Lead PMM", years: 5, salary: 145 },
    { role: "Director PMM", years: 7, salary: 175 },
    { role: "VP Marketing", years: 10, salary: 220 },
  ],
  "Sales Development Rep": [
    { role: "SDR", years: 0, salary: 65 },
    { role: "Senior SDR", years: 2, salary: 75 },
    { role: "Account Executive", years: 3, salary: 120 },
    { role: "Enterprise AE", years: 5, salary: 180 },
    { role: "Sales Manager", years: 7, salary: 160 },
    { role: "Director of Sales", years: 10, salary: 200 },
  ],
  "Marketing Operations Manager": [
    { role: "MarkOps Specialist", years: 0, salary: 78 },
    { role: "MarkOps Manager", years: 3, salary: 115 },
    { role: "Senior MarkOps", years: 5, salary: 140 },
    { role: "Director MarkOps", years: 7, salary: 165 },
    { role: "VP Marketing Ops", years: 10, salary: 210 },
  ],
  "Revenue Operations Manager": [
    { role: "RevOps Analyst", years: 0, salary: 85 },
    { role: "RevOps Manager", years: 3, salary: 125 },
    { role: "Senior RevOps", years: 5, salary: 158 },
    { role: "Director RevOps", years: 7, salary: 185 },
    { role: "VP RevOps", years: 10, salary: 240 },
  ],
};

export const CareerProgressionTimeline = () => {
  const [selectedPath, setSelectedPath] = useState<keyof typeof careerPaths>(
    "Product Marketing Manager"
  );
  const [scenario, setScenario] = useState<"steady" | "fast-track">("steady");

  const path = careerPaths[selectedPath];
  const adjustedPath = path.map((stage) => ({
    ...stage,
    years: scenario === "fast-track" ? Math.round(stage.years * 0.7) : stage.years,
    salary: scenario === "fast-track" ? Math.round(stage.salary * 1.15) : stage.salary,
  }));

  const totalEarnings = adjustedPath.reduce((sum, stage, index) => {
    const nextStage = adjustedPath[index + 1];
    const yearsAtLevel = nextStage ? nextStage.years - stage.years : 3;
    return sum + stage.salary * yearsAtLevel;
  }, 0);

  const totalYears = adjustedPath[adjustedPath.length - 1].years;

  return (
    <Card className="border-2 border-blazeOrange/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Rocket className="h-6 w-6 text-blazeOrange" />
          Career Progression Timeline
        </CardTitle>
        <p className="text-sm text-secondary-label">
          Visualize your career path with salary progression over 10 years
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Starting Role</Label>
            <Select
              value={selectedPath}
              onValueChange={(value) => setSelectedPath(value as keyof typeof careerPaths)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(careerPaths).map((path) => (
                  <SelectItem key={path} value={path}>
                    {path}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Career Path Scenario</Label>
            <Select value={scenario} onValueChange={(value: any) => setScenario(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="steady">Steady (Standard Progression)</SelectItem>
                <SelectItem value="fast-track">Fast-Track (High Performer)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {adjustedPath.map((stage, index) => {
            const isLast = index === adjustedPath.length - 1;
            const nextStage = adjustedPath[index + 1];
            const yearsAtLevel = nextStage ? nextStage.years - stage.years : 3;

            return (
              <div key={index} className="relative">
                <div className="flex items-start gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blazeOrange to-deepSea flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    {!isLast && (
                      <div className="w-0.5 h-16 bg-gradient-to-b from-blazeOrange/50 to-deepSea/50" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-lg text-mirage">{stage.role}</p>
                          <div className="flex items-center gap-2 text-xs text-secondary-label mt-1">
                            <Clock className="h-3 w-3" />
                            <span>Year {stage.years}</span>
                            <span>•</span>
                            <span>{yearsAtLevel} years at this level</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blazeOrange">
                            ${stage.salary}K
                          </p>
                          <p className="text-xs text-secondary-label mt-1">
                            ${Math.round(stage.salary / 12)}K/month
                          </p>
                        </div>
                      </div>

                      {scenario === "fast-track" && (
                        <div className="mt-3 pt-3 border-t border-deepSea/10">
                          <p className="text-xs text-blazeOrange font-semibold">
                            Fast-Track Advantage: +15% salary, -30% time to promotion
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="bg-gradient-to-br from-blazeOrange/10 to-deepSea/10 rounded-xl p-6">
            <p className="text-sm text-secondary-label mb-2">Total Career Earnings</p>
            <p className="text-4xl font-bold text-blazeOrange">${totalEarnings}K</p>
            <p className="text-sm text-secondary-label mt-2">Over {totalYears} years</p>
          </div>
          <div className="bg-gradient-to-br from-deepSea/10 to-wildSand/50 rounded-xl p-6">
            <p className="text-sm text-secondary-label mb-2">Average Annual Salary</p>
            <p className="text-4xl font-bold text-deepSea">
              ${Math.round(totalEarnings / totalYears)}K
            </p>
            <p className="text-sm text-secondary-label mt-2">
              Across all progression stages
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
