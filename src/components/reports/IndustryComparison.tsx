import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Wifi, Award } from "lucide-react";
import { industryMultipliers } from "@/lib/salaryData/industries";
import { formatCurrency } from "@/lib/salaryData";

export const IndustryComparison = () => {
  const baseSalary = 95000; // Marketing Manager baseline

  return (
    <Card className="border-2 border-deepSea/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-deepSea/10">
            <Building2 className="h-6 w-6 text-deepSea" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">Industry Comparison</CardTitle>
            <p className="text-sm text-secondary-label mt-1">
              Same role, different industry: salary variations explained
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {industryMultipliers.map((ind, idx) => {
            const adjustedSalary = Math.round(baseSalary * ind.multiplier);
            const difference = adjustedSalary - baseSalary;
            const percentDiff = ((difference / baseSalary) * 100).toFixed(1);
            
            return (
              <div 
                key={ind.industry}
                className="p-5 rounded-lg border-2 hover:shadow-md transition-apple hover:scale-101"
                style={{
                  borderColor: `hsl(var(--deepSea) / ${0.1 + (idx * 0.05)})`
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-bold text-lg">{ind.industry}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {ind.avgGrowthRate}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Wifi className="h-3 w-3 mr-1" />
                        {ind.remoteAvailability}% Remote
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-display font-bold text-deepSea">
                      {formatCurrency(adjustedSalary)}
                    </div>
                    <div className={`text-sm font-medium ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {difference >= 0 ? '+' : ''}{percentDiff}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Award className="h-4 w-4 text-secondary-label" />
                  <div className="text-sm text-secondary-label">
                    Top Skills:
                  </div>
                  {ind.topSkills.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-wildSand/50 rounded-lg text-sm text-secondary-label">
          <strong className="text-foreground">Note:</strong> Salaries shown are for Marketing Manager role 
          with 5 years experience in mid-sized companies. Industry multipliers based on analysis of 50,000+ 
          job postings and survey data.
        </div>
      </CardContent>
    </Card>
  );
};
