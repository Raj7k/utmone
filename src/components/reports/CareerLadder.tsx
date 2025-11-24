import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/salaryData";
import { motion, AnimatePresence } from "framer-motion";

interface LadderRung {
  level: number;
  role: string;
  medianSalary: number;
  yearsToNext: number;
  keySkills: string[];
  responsibilities: string[];
}

const careerPath: LadderRung[] = [
  {
    level: 1,
    role: "Marketing Coordinator",
    medianSalary: 52000,
    yearsToNext: 2,
    keySkills: ["Social Media", "Content Creation", "Email Marketing"],
    responsibilities: ["Execute campaigns", "Coordinate events", "Manage social channels"]
  },
  {
    level: 2,
    role: "Marketing Specialist",
    medianSalary: 68000,
    yearsToNext: 2,
    keySkills: ["Campaign Management", "Analytics", "Marketing Automation"],
    responsibilities: ["Own campaign execution", "Analyze performance", "Optimize conversion"]
  },
  {
    level: 3,
    role: "Senior Marketing Specialist",
    medianSalary: 82000,
    yearsToNext: 2,
    keySkills: ["Strategy", "Team Leadership", "Advanced Analytics"],
    responsibilities: ["Lead campaign strategy", "Mentor junior team", "Report to leadership"]
  },
  {
    level: 4,
    role: "Marketing Manager",
    medianSalary: 95000,
    yearsToNext: 3,
    keySkills: ["Team Management", "Budget Ownership", "Cross-functional Leadership"],
    responsibilities: ["Manage team of 3-5", "Own budget", "Drive quarterly OKRs"]
  },
  {
    level: 5,
    role: "Senior Marketing Manager",
    medianSalary: 127000,
    yearsToNext: 3,
    keySkills: ["Strategic Planning", "Stakeholder Management", "P&L Ownership"],
    responsibilities: ["Manage managers", "Own department budget", "Set annual strategy"]
  },
  {
    level: 6,
    role: "Director of Marketing",
    medianSalary: 165000,
    yearsToNext: 4,
    keySkills: ["Executive Leadership", "Revenue Accountability", "Vision Setting"],
    responsibilities: ["Lead marketing org", "Report to CMO/CEO", "Drive company growth"]
  },
];

export const CareerLadder = () => {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {careerPath.map((rung, index) => {
        const isExpanded = expandedLevel === rung.level;
        const salaryIncrease = index > 0 
          ? ((rung.medianSalary - careerPath[index - 1].medianSalary) / careerPath[index - 1].medianSalary * 100).toFixed(0)
          : null;

        return (
          <motion.div
            key={rung.level}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isExpanded ? 'border-2 border-blazeOrange' : ''
              }`}
              onClick={() => setExpandedLevel(isExpanded ? null : rung.level)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-deepSea text-white font-bold text-lg">
                      {rung.level}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">{rung.role}</h3>
                      <div className="flex items-center gap-4 text-sm text-secondary-label">
                        <span>{rung.yearsToNext} years to next level</span>
                        {salaryIncrease && (
                          <Badge variant="outline" className="border-blazeOrange text-blazeOrange">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +{salaryIncrease}% increase
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-secondary-label mb-1">Median Salary</div>
                      <div className="text-2xl font-bold text-blazeOrange">
                        {formatCurrency(rung.medianSalary)}
                      </div>
                    </div>
                    <ChevronRight className={`h-6 w-6 text-secondary-label transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t border-border grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-deepSea mb-3">Key Skills Required</h4>
                          <div className="flex flex-wrap gap-2">
                            {rung.keySkills.map((skill, i) => (
                              <Badge key={i} className="bg-deepSea/10 text-deepSea border-deepSea/20">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-deepSea mb-3">Core Responsibilities</h4>
                          <ul className="space-y-2">
                            {rung.responsibilities.map((resp, i) => (
                              <li key={i} className="text-sm text-secondary-label flex items-start gap-2">
                                <span className="text-blazeOrange mt-1">•</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
