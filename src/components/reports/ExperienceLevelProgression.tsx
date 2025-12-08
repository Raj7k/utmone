import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Award } from "lucide-react";
import { formatCurrency } from "@/lib/salaryData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ExperienceLevelProgression = () => {
  const experienceData = [
    { 
      years: '0-2', 
      level: 'Entry-Level',
      salary: 52000, 
      title: 'Marketing Coordinator',
      skills: ['Social Media', 'Content', 'Email'],
      promotionTime: '2-3 years'
    },
    { 
      years: '3-5', 
      level: 'Mid-Level',
      salary: 70000, 
      title: 'Marketing Specialist',
      skills: ['Campaigns', 'Analytics', 'Automation'],
      promotionTime: '2-3 years'
    },
    { 
      years: '5-7', 
      level: 'Senior',
      salary: 95000, 
      title: 'Marketing Manager',
      skills: ['Leadership', 'Strategy', 'Budget'],
      promotionTime: '3-4 years'
    },
    { 
      years: '8-10', 
      level: 'Senior',
      salary: 130000, 
      title: 'Senior Manager',
      skills: ['Multi-Channel', 'P&L', 'Executive Comm'],
      promotionTime: '3-5 years'
    },
    { 
      years: '11-15', 
      level: 'Director',
      salary: 170000, 
      title: 'Marketing Director',
      skills: ['Dept Leadership', 'Cross-Functional', 'ROI'],
      promotionTime: '5+ years'
    },
    { 
      years: '16+', 
      level: 'VP',
      salary: 240000, 
      title: 'VP Marketing',
      skills: ['Exec Leadership', 'Strategic Planning', 'Board Comm'],
      promotionTime: 'C-Suite'
    }
  ];

  const chartData = experienceData.map(d => ({
    years: d.years,
    salary: d.salary
  }));

  return (
    <Card className="border-2 border-blazeOrange/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blazeOrange/10">
            <TrendingUp className="h-6 w-6 text-blazeOrange" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">Experience Level Progression</CardTitle>
            <p className="text-sm text-secondary-label mt-1">
              Typical salary growth trajectory from entry to executive
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="years" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" tickFormatter={(val) => `$${val / 1000}K`} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="salary" 
                stroke="hsl(var(--blazeOrange))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--blazeOrange))', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {experienceData.map((exp, idx) => (
            <div 
              key={exp.years}
              className="p-5 rounded-lg border-2 border-blazeOrange/10 hover:border-blazeOrange/30 transition-apple hover:scale-101"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge variant="outline" className="mb-2">{exp.years} years</Badge>
                  <h3 className="font-display font-bold text-lg">{exp.title}</h3>
                  <Badge variant="secondary" className="mt-1">{exp.level}</Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-blazeOrange">
                    {formatCurrency(exp.salary)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-secondary-label">
                  <Clock className="h-4 w-4" />
                  <span>Next promotion: {exp.promotionTime}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Award className="h-4 w-4 text-secondary-label" />
                  {exp.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {idx < experienceData.length - 1 && (
                <div className="mt-3 pt-3 border-t border-border text-xs text-secondary-label">
                  Next level jump: {formatCurrency(experienceData[idx + 1].salary - exp.salary)} 
                  ({(((experienceData[idx + 1].salary - exp.salary) / exp.salary) * 100).toFixed(1)}%)
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
