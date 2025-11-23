import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Brain, TrendingUp, Target } from 'lucide-react';

const AVAILABLE_SKILLS = [
  'SEO/SEM',
  'Content Marketing',
  'Email Marketing',
  'Marketing Automation',
  'Analytics (GA4)',
  'A/B Testing',
  'CRO',
  'Social Media Marketing',
  'Paid Advertising',
  'Account-Based Marketing',
  'Product Marketing',
  'Demand Generation',
  'AI/ML for Marketing',
  'Data Analysis',
  'SQL',
];

export const TeamSkillsGapAnalyzer = () => {
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);

  const toggleRequiredSkill = (skill: string) => {
    setRequiredSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleCurrentSkill = (skill: string) => {
    setCurrentSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const analyzeGaps = () => {
    const gaps = requiredSkills.filter(skill => !currentSkills.includes(skill));
    const covered = requiredSkills.filter(skill => currentSkills.includes(skill));
    
    const premiumSkills = ['AI/ML for Marketing', 'Data Analysis', 'SQL', 'Marketing Automation'];
    const highValueGaps = gaps.filter(gap => premiumSkills.includes(gap));
    
    setAnalysis({
      totalRequired: requiredSkills.length,
      covered: covered.length,
      gaps: gaps.length,
      gapsList: gaps,
      highValueGaps,
      coveragePercent: requiredSkills.length > 0 
        ? ((covered.length / requiredSkills.length) * 100).toFixed(0)
        : 0,
      recommendations: gaps.map(gap => ({
        skill: gap,
        action: premiumSkills.includes(gap) ? 'Hire specialist' : 'Upskill existing team',
        estimatedCost: premiumSkills.includes(gap) ? '$95,000 - $140,000/year' : '$2,000 - $5,000 training',
        timeframe: premiumSkills.includes(gap) ? '3-6 months' : '1-3 months',
      })),
    });
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Team Skills Gap Analyzer
        </CardTitle>
        <CardDescription>
          Identify skill gaps and get hire vs. upskill recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-3 block">Required Skills for Team Goals</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {AVAILABLE_SKILLS.map(skill => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`required-${skill}`}
                    checked={requiredSkills.includes(skill)}
                    onCheckedChange={() => toggleRequiredSkill(skill)}
                  />
                  <label
                    htmlFor={`required-${skill}`}
                    className="text-sm cursor-pointer"
                  >
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Current Team Skills</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {AVAILABLE_SKILLS.map(skill => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${skill}`}
                    checked={currentSkills.includes(skill)}
                    onCheckedChange={() => toggleCurrentSkill(skill)}
                  />
                  <label
                    htmlFor={`current-${skill}`}
                    className="text-sm cursor-pointer"
                  >
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={analyzeGaps} 
          className="w-full" 
          size="lg"
          disabled={requiredSkills.length === 0}
        >
          Analyze Skills Gaps
        </Button>

        {analysis && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/20 rounded-lg text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{analysis.totalRequired}</p>
                <p className="text-sm text-muted-foreground">Required</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-600">{analysis.covered}</p>
                <p className="text-sm text-green-600/80">Covered</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg text-center">
                <Brain className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <p className="text-2xl font-bold text-red-600">{analysis.gaps}</p>
                <p className="text-sm text-red-600/80">Gaps</p>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Skills Coverage</p>
              <p className="text-3xl font-bold text-primary">{analysis.coveragePercent}%</p>
            </div>

            {analysis.gapsList.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Gap Analysis & Recommendations</h4>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">{rec.skill}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          rec.action === 'Hire specialist'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {rec.action}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Estimated Cost</p>
                          <p className="font-medium">{rec.estimatedCost}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Timeframe</p>
                          <p className="font-medium">{rec.timeframe}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" className="w-full" size="lg">
              Download Skills Development Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
