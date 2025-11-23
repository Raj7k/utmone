import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, AlertTriangle, CheckCircle2, Upload } from 'lucide-react';

export const HiringCompetitivenessDashboard = () => {
  const [uploaded, setUploaded] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate analysis
      setTimeout(() => {
        setUploaded(true);
        setAnalysis({
          totalRoles: 12,
          competitive: 5,
          atRisk: 4,
          nonCompetitive: 3,
          averageGap: -8.5,
          topRisks: [
            { role: 'Senior Product Marketing Manager', gap: -15, market: 145000, current: 123250 },
            { role: 'Marketing Operations Manager', gap: -12, market: 125000, current: 110000 },
            { role: 'Demand Generation Manager', gap: -10, market: 118000, current: 106200 },
          ],
        });
      }, 1000);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Hiring Competitiveness Dashboard
        </CardTitle>
        <CardDescription>
          Benchmark your salary bands against market data and identify retention risks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!uploaded ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salaryData">Upload Your Salary Bands (CSV)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="salaryData"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                CSV format: Role, Current Salary, Location
              </p>
            </div>

            <div className="p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground">
              <Upload className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>Upload your current salary bands to see competitiveness analysis</p>
              <p className="text-sm mt-2">Or manually enter roles below</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-600">{analysis.competitive}</p>
                <p className="text-sm text-green-600/80">Competitive</p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mb-2" />
                <p className="text-2xl font-bold text-yellow-600">{analysis.atRisk}</p>
                <p className="text-sm text-yellow-600/80">At Risk</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
                <p className="text-2xl font-bold text-red-600">{analysis.nonCompetitive}</p>
                <p className="text-sm text-red-600/80">Non-Competitive</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Top 3 Retention Risks</h4>
              <div className="space-y-3">
                {analysis.topRisks.map((risk: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-muted/20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">{risk.role}</p>
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                        {risk.gap}% below market
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current</p>
                        <p className="font-semibold">${risk.current.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Market Median</p>
                        <p className="font-semibold">${risk.market.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Recommended adjustment: +${(risk.market - risk.current).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" size="lg">
                Generate Adjustment Plan
              </Button>
              <Button variant="outline" size="lg">
                Export Full Report
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
