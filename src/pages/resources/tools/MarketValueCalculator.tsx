import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Calculator, MessageSquare, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalaryFilters, FilterState } from "@/components/tools/SalaryFilters";
import { PercentileGauge } from "@/components/tools/PercentileGauge";
import { SalaryComparisonCard } from "@/components/tools/SalaryComparisonCard";
import { getSalaryForRole, getAdjustedSalary, getPercentile, formatCurrency } from "@/lib/salaryData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MarketValueCalculator = () => {
  const [filters, setFilters] = useState<FilterState>({
    role: "Marketing Manager",
    location: "United States (Average)",
    companySize: "Medium (100-500)",
    experienceYears: "5"
  });
  const [currentSalary, setCurrentSalary] = useState("");
  const [percentile, setPercentile] = useState(0);
  const [marketSalary, setMarketSalary] = useState(0);
  const [adjustedSalary, setAdjustedSalary] = useState(0);

  useEffect(() => {
    const salaryData = getSalaryForRole(filters.role);
    if (salaryData) {
      const baseSalary = salaryData.baseCompensation.p50;
      const adjusted = getAdjustedSalary(baseSalary, filters.location, filters.companySize);
      setMarketSalary(baseSalary);
      setAdjustedSalary(adjusted);

      if (currentSalary) {
        const pct = getPercentile(parseInt(currentSalary), filters.role);
        setPercentile(pct);
      }
    }
  }, [filters, currentSalary]);

  return (
    <ToolLayout
      title="Market Value Calculator"
      description="discover your market worth with real-time percentile rankings"
      icon={Calculator}
      relatedTools={[
        { title: "AI Salary Negotiation Coach", href: "/resources/tools/salary-negotiation-coach", icon: MessageSquare },
        { title: "Career Path Optimizer", href: "/resources/tools/career-path-optimizer", icon: TrendingUp }
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle className="lowercase">calculate your market value</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SalaryFilters onFilterChange={setFilters} />
          
          <div className="space-y-2">
            <Label htmlFor="currentSalary">Your Current Salary ($)</Label>
            <Input
              id="currentSalary"
              type="number"
              placeholder="85000"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {currentSalary && (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-muted-foreground lowercase">your percentile</h3>
              <PercentileGauge percentile={percentile} size="lg" />
            </div>
          </Card>

          <div className="space-y-6">
            <SalaryComparisonCard
              title="vs market median"
              current={parseInt(currentSalary)}
              market={adjustedSalary}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground lowercase">
                  market insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {percentile < 50 && (
                  <p className="text-destructive">
                    You're below the market median. Consider negotiating a {Math.round(((adjustedSalary - parseInt(currentSalary)) / parseInt(currentSalary)) * 100)}% increase to reach market rate.
                  </p>
                )}
                {percentile >= 50 && percentile < 75 && (
                  <p className="text-warning">
                    You're at market rate. Room to grow to 75th percentile ({formatCurrency(getSalaryForRole(filters.role)?.baseCompensation.p75 || 0)}).
                  </p>
                )}
                {percentile >= 75 && (
                  <p className="text-success">
                    You're above market rate. Well done! Focus on equity and benefits for additional comp.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};

export default MarketValueCalculator;