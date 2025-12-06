import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Target, DollarSign } from 'lucide-react';

export const RetentionRiskCalculator = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [tenure, setTenure] = useState('');
  const [performance, setPerformance] = useState('high');
  const [riskScore, setRiskScore] = useState<any>(null);

  const calculateRisk = () => {
    const salary = parseInt(currentSalary);
    const years = parseFloat(tenure);
    
    // Simplified risk scoring algorithm
    let score = 50; // Base score
    
    // Tenure impact (longer tenure = lower risk)
    if (years < 1) score += 20;
    else if (years < 2) score += 10;
    else if (years > 4) score -= 15;
    
    // Performance impact (high performers = higher flight risk if underpaid)
    if (performance === 'high') score += 15;
    else if (performance === 'low') score -= 10;
    
    // Salary benchmarking (simplified)
    const marketMedian = 120000;
    const salaryGap = ((salary - marketMedian) / marketMedian) * 100;
    if (salaryGap < -10) score += 20;
    else if (salaryGap < -5) score += 10;
    else if (salaryGap > 10) score -= 10;
    
    const finalScore = Math.max(0, Math.min(100, score));
    const replacementCost = salary * 1.5; // 150% of salary
    
    const getStyleForScore = (score: number) => {
      if (score > 70) return { color: 'rgba(220,38,38,1)', bg: 'rgba(220,38,38,0.1)' };
      if (score > 40) return { color: 'rgba(202,138,4,1)', bg: 'rgba(202,138,4,0.1)' };
      return { color: 'rgba(22,163,74,1)', bg: 'rgba(22,163,74,0.1)' };
    };
    const styles = getStyleForScore(finalScore);
    
    setRiskScore({
      score: finalScore,
      level: finalScore > 70 ? 'High' : finalScore > 40 ? 'Medium' : 'Low',
      colorStyle: styles,
      replacementCost,
      recommendations: finalScore > 70 
        ? ['Immediate salary adjustment of 10-15%', 'Quarterly retention bonus', 'Career path conversation']
        : finalScore > 40
        ? ['Annual merit increase of 5-8%', 'Professional development budget', 'Regular check-ins']
        : ['Maintain current compensation', 'Continue recognition programs'],
    });
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Retention Risk Calculator
        </CardTitle>
        <CardDescription>
          Calculate flight risk and get preemptive retention recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="employeeName">Employee/Role Name</Label>
            <Input
              id="employeeName"
              placeholder="e.g., Senior Marketing Manager"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentSalary">Current Salary</Label>
            <Input
              id="currentSalary"
              type="number"
              placeholder="120000"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenure">Tenure (Years)</Label>
            <Input
              id="tenure"
              type="number"
              step="0.5"
              placeholder="2.5"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="performance">Performance Level</Label>
            <Select value={performance} onValueChange={setPerformance}>
              <SelectTrigger id="performance">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Performer</SelectItem>
                <SelectItem value="medium">Meets Expectations</SelectItem>
                <SelectItem value="low">Needs Improvement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={calculateRisk} 
          className="w-full" 
          size="lg"
          disabled={!employeeName || !currentSalary || !tenure}
        >
          Calculate Retention Risk
        </Button>

        {riskScore && (
          <div className="mt-6 space-y-4">
            <div className="p-6 rounded-lg" style={{ background: riskScore.colorStyle.bg }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-secondary-label">Flight Risk Score</p>
                  <p className="text-4xl font-bold" style={{ color: riskScore.colorStyle.color }}>
                    {riskScore.score}/100
                  </p>
                  <p className="text-lg font-semibold" style={{ color: riskScore.colorStyle.color }}>
                    {riskScore.level} Risk
                  </p>
                </div>
                <AlertTriangle className="w-12 h-12" style={{ color: riskScore.colorStyle.color }} />
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-secondary-label" />
                  <p className="text-sm text-secondary-label">Estimated Replacement Cost</p>
                </div>
                <p className="text-2xl font-bold">
                  ${riskScore.replacementCost.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Recommended Actions</h4>
              <ul className="space-y-2">
                {riskScore.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button variant="outline" className="w-full" size="lg">
              Generate Retention Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};