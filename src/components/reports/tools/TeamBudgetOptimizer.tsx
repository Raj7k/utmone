import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, DollarSign, TrendingDown, Download } from 'lucide-react';

export const TeamBudgetOptimizer = () => {
  const [roleCount, setRoleCount] = useState(5);
  const [seniorityMix, setSeniorityMix] = useState('balanced');
  const [location, setLocation] = useState('san-francisco');
  const [industry, setIndustry] = useState('saas');
  const [results, setResults] = useState<any>(null);

  const calculateBudget = () => {
    // Simplified calculation based on inputs
    const baseSalaries = {
      'san-francisco': { junior: 85000, mid: 125000, senior: 165000 },
      'new-york': { junior: 80000, mid: 120000, senior: 160000 },
      'austin': { junior: 70000, mid: 105000, senior: 145000 },
      'remote': { junior: 75000, mid: 110000, senior: 150000 },
    };

    const seniorityDistribution = {
      'junior-heavy': { junior: 0.6, mid: 0.3, senior: 0.1 },
      'balanced': { junior: 0.3, mid: 0.5, senior: 0.2 },
      'senior-heavy': { junior: 0.1, mid: 0.3, senior: 0.6 },
    };

    const locationData = baseSalaries[location as keyof typeof baseSalaries];
    const distribution = seniorityDistribution[seniorityMix as keyof typeof seniorityDistribution];

    const juniorCount = Math.round(roleCount * distribution.junior);
    const midCount = Math.round(roleCount * distribution.mid);
    const seniorCount = Math.round(roleCount * distribution.senior);

    const totalBudget =
      juniorCount * locationData.junior +
      midCount * locationData.mid +
      seniorCount * locationData.senior;

    const remoteData = baseSalaries['remote'];
    const remoteBudget =
      juniorCount * remoteData.junior +
      midCount * remoteData.mid +
      seniorCount * remoteData.senior;

    setResults({
      totalBudget,
      juniorCount,
      midCount,
      seniorCount,
      remoteBudget,
      savings: totalBudget - remoteBudget,
      savingsPercent: ((totalBudget - remoteBudget) / totalBudget * 100).toFixed(1),
    });
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Team Budget Optimizer
        </CardTitle>
        <CardDescription>
          Plan your hiring budget across roles, seniority levels, and locations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="roleCount">Number of Roles to Hire</Label>
            <Input
              id="roleCount"
              type="number"
              min="1"
              max="50"
              value={roleCount}
              onChange={(e) => setRoleCount(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seniorityMix">Seniority Mix</Label>
            <Select value={seniorityMix} onValueChange={setSeniorityMix}>
              <SelectTrigger id="seniorityMix">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior-heavy">Junior Heavy (60/30/10)</SelectItem>
                <SelectItem value="balanced">Balanced (30/50/20)</SelectItem>
                <SelectItem value="senior-heavy">Senior Heavy (10/30/60)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Primary Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="san-francisco">San Francisco</SelectItem>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="austin">Austin</SelectItem>
                <SelectItem value="remote">Remote (US)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger id="industry">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saas">B2B SaaS</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="fintech">Fintech</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculateBudget} className="w-full" size="lg">
          Calculate Team Budget
        </Button>

        {results && (
          <div className="mt-6 space-y-4 p-6 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-label">Total Annual Budget</p>
                <p className="text-3xl font-bold text-primary">
                  ${results.totalBudget.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-secondary-label">Junior</p>
                <p className="text-xl font-semibold">{results.juniorCount} roles</p>
              </div>
              <div>
                <p className="text-sm text-secondary-label">Mid-Level</p>
                <p className="text-xl font-semibold">{results.midCount} roles</p>
              </div>
              <div>
                <p className="text-sm text-secondary-label">Senior</p>
                <p className="text-xl font-semibold">{results.seniorCount} roles</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-green-600">
                <TrendingDown className="w-5 h-5" />
                <div>
                  <p className="text-sm">Geographic Arbitrage Savings (vs. Remote)</p>
                  <p className="text-xl font-bold">
                    ${results.savings.toLocaleString()} ({results.savingsPercent}%)
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Budget Breakdown (CSV)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};