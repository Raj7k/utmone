import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Users, Target } from "lucide-react";

interface CaseStudy {
  id: number;
  company: string;
  industry: string;
  teamSize: string;
  challenge: string;
  solution: string;
  results: string[];
  utmStrategy: string;
  icon: any;
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    company: "TechCorp SaaS",
    industry: "B2B SaaS",
    teamSize: "15-person marketing team",
    challenge: "Data fragmentation across 12 different campaign sources with inconsistent naming conventions causing $50K/month in wasted ad spend.",
    solution: "Implemented Clean-Track framework with enforced lowercase naming, centralized template system, and mandatory approval workflow.",
    results: [
      "95% reduction in duplicate UTM values",
      "Campaign ROI visibility increased from 40% to 98%",
      "$42K/month recovered in attributed ad spend",
      "Analytics setup time reduced from 4 hours to 15 minutes"
    ],
    utmStrategy: "Channel-first hierarchy: {channel}-{region}-{product}-{quarter}",
    icon: Building2
  },
  {
    id: 2,
    company: "RetailHub E-commerce",
    industry: "E-commerce",
    teamSize: "8-person growth team",
    challenge: "Unable to attribute multi-channel campaigns. Black Friday campaign had 47 different UTM variations for the same promotion.",
    solution: "Created seasonal templates with locked utm_campaign fields and dynamic utm_content placeholders.",
    results: [
      "100% UTM consistency across 200+ Black Friday links",
      "Multi-touch attribution implemented successfully",
      "Revenue attribution accuracy improved by 87%",
      "Email-to-purchase funnel fully tracked for first time"
    ],
    utmStrategy: "Event-based templates: {season}-{year}-{category}-{promo-type}",
    icon: TrendingUp
  },
  {
    id: 3,
    company: "AgencyFlow Marketing",
    industry: "Agency",
    teamSize: "30-person agency serving 20 clients",
    challenge: "Client campaigns mixed together in shared analytics. No way to separate performance by client or account manager.",
    solution: "Client-scoped workspaces with role-based permissions and client-specific UTM prefixes.",
    results: [
      "Client data fully isolated with zero cross-contamination",
      "Client reporting automated (previously 10 hours/week manual work)",
      "Campaign approval time reduced from 2 days to 2 hours",
      "Agency won 3 new clients citing 'governance as competitive advantage'"
    ],
    utmStrategy: "Client-prefix system: {client-code}-{campaign-type}-{channel}-{date}",
    icon: Users
  }
];

export const CaseStudyExplorer = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  
  const filteredCaseStudies = selectedIndustry === "all" 
    ? caseStudies 
    : caseStudies.filter(cs => cs.industry.toLowerCase().includes(selectedIndustry.toLowerCase()));

  return (
    <Card className="p-8 bg-card border border-border rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          Case Study Explorer
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Real-world UTM implementation examples from teams that fixed their tracking
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedIndustry === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedIndustry("all")}
          >
            All Industries
          </Button>
          <Button
            variant={selectedIndustry === "saas" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedIndustry("saas")}
          >
            B2B SaaS
          </Button>
          <Button
            variant={selectedIndustry === "ecommerce" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedIndustry("ecommerce")}
          >
            E-commerce
          </Button>
          <Button
            variant={selectedIndustry === "agency" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedIndustry("agency")}
          >
            Agency
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredCaseStudies.map((study) => {
          const Icon = study.icon;
          return (
            <div key={study.id} className="border border-border rounded-lg p-6 hover:border-white/30 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <Icon className="w-6 h-6" style={{ color: 'rgba(59,130,246,1)' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-foreground">{study.company}</h4>
                    <Badge variant="outline">{study.industry}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{study.teamSize}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Challenge</p>
                  <p className="text-sm text-muted-foreground">{study.challenge}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Solution</p>
                  <p className="text-sm text-muted-foreground">{study.solution}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Results</p>
                  <ul className="space-y-1">
                    {study.results.map((result, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Target className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(59,130,246,1)' }} />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-1">UTM Strategy</p>
                  <code className="text-xs font-mono text-muted-foreground bg-muted/30 px-3 py-2 rounded block">
                    {study.utmStrategy}
                  </code>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
