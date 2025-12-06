import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users, Eye, CheckCircle } from "lucide-react";

interface RACIRole {
  role: string;
  responsible: string[];
  accountable: string[];
  consulted: string[];
  informed: string[];
}

const raciData: RACIRole[] = [
  {
    role: "Marketing Operations",
    responsible: ["Define UTM naming conventions", "Create templates", "Train team members"],
    accountable: ["UTM governance framework", "Template approval", "Data quality standards"],
    consulted: ["Campaign strategy", "Analytics requirements"],
    informed: ["Campaign launches", "New team member onboarding"]
  },
  {
    role: "Campaign Managers",
    responsible: ["Create campaign links", "Apply correct templates", "Test UTM tracking"],
    accountable: ["Campaign-level UTM accuracy", "Template usage compliance"],
    consulted: ["Template design", "Naming convention updates"],
    informed: ["Governance policy changes", "New template availability"]
  },
  {
    role: "Analytics Team",
    responsible: ["Monitor data quality", "Report inconsistencies", "Create dashboards"],
    accountable: ["Attribution reporting accuracy", "Data validation"],
    consulted: ["UTM parameter requirements", "Reporting needs"],
    informed: ["New campaigns", "UTM changes"]
  },
  {
    role: "Leadership",
    responsible: [],
    accountable: ["Budget allocation for UTM tools", "Team accountability"],
    consulted: ["Governance policy decisions", "Major process changes"],
    informed: ["Monthly data quality reports", "Campaign performance"]
  }
];

const RACIBadge = ({ type }: { type: string }) => {
  const config = {
    R: { label: "R", className: "bg-primary text-primary-foreground", tooltip: "Responsible (does the work)" },
    A: { label: "A", className: "bg-green-500 text-white", tooltip: "Accountable (final approval)" },
    C: { label: "C", className: "bg-yellow-500 text-white", tooltip: "Consulted (provides input)" },
    I: { label: "I", className: "bg-zinc-400 text-white", tooltip: "Informed (kept updated)" }
  };
  
  const c = config[type as keyof typeof config];
  
  return (
    <span 
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${c.className}`}
      title={c.tooltip}
    >
      {c.label}
    </span>
  );
};

export const TeamRACIMatrix = () => {
  return (
    <Card className="p-8 bg-card border border-border rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          Team RACI Matrix for UTM Governance
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Clear role definitions prevent confusion and ensure UTM consistency across teams
        </p>
        
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <RACIBadge type="R" />
            <span className="text-muted-foreground">Responsible (does the work)</span>
          </div>
          <div className="flex items-center gap-2">
            <RACIBadge type="A" />
            <span className="text-muted-foreground">Accountable (final approval)</span>
          </div>
          <div className="flex items-center gap-2">
            <RACIBadge type="C" />
            <span className="text-muted-foreground">Consulted (provides input)</span>
          </div>
          <div className="flex items-center gap-2">
            <RACIBadge type="I" />
            <span className="text-muted-foreground">Informed (kept updated)</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {raciData.map((roleData, index) => (
          <div key={index} className="border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                {roleData.role === "Leadership" ? <User className="w-5 h-5 text-primary" /> : <Users className="w-5 h-5 text-primary" />}
              </div>
              <h4 className="text-lg font-semibold text-foreground">{roleData.role}</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roleData.responsible.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RACIBadge type="R" />
                    <span className="text-sm font-medium text-foreground">Responsible</span>
                  </div>
                  <ul className="space-y-1 ml-8">
                    {roleData.responsible.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {roleData.accountable.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RACIBadge type="A" />
                    <span className="text-sm font-medium text-foreground">Accountable</span>
                  </div>
                  <ul className="space-y-1 ml-8">
                    {roleData.accountable.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {roleData.consulted.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RACIBadge type="C" />
                    <span className="text-sm font-medium text-foreground">Consulted</span>
                  </div>
                  <ul className="space-y-1 ml-8">
                    {roleData.consulted.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {roleData.informed.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RACIBadge type="I" />
                    <span className="text-sm font-medium text-foreground">Informed</span>
                  </div>
                  <ul className="space-y-1 ml-8">
                    {roleData.informed.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Implementation Tip:</strong> Schedule a 30-minute workshop to assign these roles explicitly. Ambiguity about "who owns UTM governance" is the #1 reason teams fail to maintain consistency over time.
        </p>
      </div>
    </Card>
  );
};
