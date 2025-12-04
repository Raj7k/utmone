import { CheckCircle2, Users, Database, TrendingUp, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const dataSources = [
  {
    name: "Primary Research",
    icon: Users,
    description: "20,000+ survey respondents",
    verified: true,
    color: "blazeOrange"
  },
  {
    name: "SHRM Salary Database",
    icon: Database,
    description: "Society for Human Resource Management",
    verified: true,
    color: "deepSea"
  },
  {
    name: "Glassdoor",
    icon: TrendingUp,
    description: "Verified salary reports",
    verified: true,
    color: "mirage"
  },
  {
    name: "Payscale",
    icon: Database,
    description: "Compensation data platform",
    verified: true,
    color: "deepSea"
  },
  {
    name: "Levels.fyi",
    icon: TrendingUp,
    description: "Tech compensation data",
    verified: true,
    color: "blazeOrange"
  },
  {
    name: "Job Postings Analysis",
    icon: Award,
    description: "50,000+ verified postings",
    verified: true,
    color: "mirage"
  }
];

export const DataSourcesBadges = () => {
  const getColorStyles = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blazeOrange: { bg: 'rgba(249,115,22,0.1)', text: 'rgba(249,115,22,1)' },
      deepSea: { bg: 'rgba(20,184,166,0.1)', text: 'rgba(20,184,166,1)' },
      mirage: { bg: 'rgba(30,41,59,0.1)', text: 'rgba(30,41,59,1)' },
    };
    return colors[color] || colors.blazeOrange;
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dataSources.map((source, index) => {
        const Icon = source.icon;
        const colorStyles = getColorStyles(source.color);
        return (
          <Card key={index} className="border-2 hover:shadow-lg transition-apple hover:scale-101">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ background: colorStyles.bg }}>
                  <Icon className="h-6 w-6" style={{ color: colorStyles.text }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{source.name}</h4>
                    {source.verified && (
                      <CheckCircle2 className="h-4 w-4" style={{ color: 'rgba(20,184,166,1)' }} />
                    )}
                  </div>
                  <p className="text-sm text-secondary-label">{source.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
