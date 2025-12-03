import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
}

const hubspotSteps: Step[] = [
  {
    id: 1,
    title: "Create Custom Properties",
    description: "Set up attribution tracking fields in HubSpot",
    estimatedTime: "15 minutes"
  },
  {
    id: 2,
    title: "Configure UTM Parameters",
    description: "Establish UTM standards and tracking",
    estimatedTime: "20 minutes"
  },
  {
    id: 3,
    title: "Set Up Workflows",
    description: "Automate attribution data capture",
    estimatedTime: "30 minutes"
  },
  {
    id: 4,
    title: "Create Reports",
    description: "Build attribution dashboards",
    estimatedTime: "25 minutes"
  }
];

const salesforceSteps: Step[] = [
  {
    id: 1,
    title: "Install Attribution Package",
    description: "Deploy custom Salesforce objects",
    estimatedTime: "20 minutes"
  },
  {
    id: 2,
    title: "Configure Campaign Hierarchy",
    description: "Set up campaign structure",
    estimatedTime: "30 minutes"
  },
  {
    id: 3,
    title: "Deploy Apex Code",
    description: "Install W-shaped attribution logic",
    estimatedTime: "45 minutes"
  },
  {
    id: 4,
    title: "Build Reports",
    description: "Create attribution reports",
    estimatedTime: "30 minutes"
  }
];

const codeSnippets = {
  hubspot: `// HubSpot Custom Properties Setup
const customProperties = [
  {
    name: "original_source",
    label: "Original Source",
    type: "enumeration",
    fieldType: "select",
    options: [
      { value: "organic", label: "Organic Search" },
      { value: "paid", label: "Paid Advertising" },
      { value: "social", label: "Social Media" },
      { value: "referral", label: "Referral" },
      { value: "direct", label: "Direct" }
    ]
  },
  {
    name: "first_touch_date",
    label: "First Touch Date",
    type: "datetime",
    fieldType: "date"
  },
  {
    name: "attribution_touchpoints",
    label: "Attribution Touchpoints",
    type: "string",
    fieldType: "textarea"
  }
];`,
  salesforce: `// Salesforce W-Shaped Attribution (Apex)
public class WShapedAttribution {
    public static void calculateAttribution(Id opportunityId) {
        List<CampaignMember> touchpoints = [
            SELECT Campaign.Name, CreatedDate, Status
            FROM CampaignMember
            WHERE Contact.AccountId IN (
                SELECT AccountId FROM Opportunity WHERE Id = :opportunityId
            )
            ORDER BY CreatedDate ASC
        ];
        
        Decimal firstTouchWeight = 0.30;
        Decimal leadCreationWeight = 0.30;
        Decimal oppCreationWeight = 0.30;
        Decimal middleWeight = 0.10;
        
        // Distribute weights across touchpoints
        if (touchpoints.size() > 0) {
            touchpoints[0].Attribution_Weight__c = firstTouchWeight;
            
            Integer leadIndex = findLeadCreationIndex(touchpoints);
            if (leadIndex >= 0) {
                touchpoints[leadIndex].Attribution_Weight__c = leadCreationWeight;
            }
            
            Integer oppIndex = touchpoints.size() - 1;
            touchpoints[oppIndex].Attribution_Weight__c = oppCreationWeight;
            
            // Distribute remaining weight to middle touchpoints
            Integer middleCount = touchpoints.size() - 3;
            if (middleCount > 0) {
                Decimal perMiddleWeight = middleWeight / middleCount;
                for (Integer i = 1; i < touchpoints.size() - 1; i++) {
                    if (i != leadIndex) {
                        touchpoints[i].Attribution_Weight__c = perMiddleWeight;
                    }
                }
            }
        }
        
        update touchpoints;
    }
}`
};

export const CRMImplementationWizard = () => {
  const [selectedCRM, setSelectedCRM] = useState<"hubspot" | "salesforce">("hubspot");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = selectedCRM === "hubspot" ? hubspotSteps : salesforceSteps;
  const code = codeSnippets[selectedCRM];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  return (
    <div className="space-y-8">
      {/* CRM Selector */}
      <div className="flex gap-4">
        <Button
          variant={selectedCRM === "hubspot" ? "default" : "outline"}
          onClick={() => setSelectedCRM("hubspot")}
          className="flex-1"
        >
          HubSpot
        </Button>
        <Button
          variant={selectedCRM === "salesforce" ? "default" : "outline"}
          onClick={() => setSelectedCRM("salesforce")}
          className="flex-1"
        >
          Salesforce
        </Button>
      </div>

      {/* Implementation Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              {!isLast && (
                <div className="absolute left-4 top-12 bottom-0 w-px bg-border/50" />
              )}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "bg-card rounded-xl p-6 border-2 transition-all cursor-pointer relative z-10",
                  isCompleted ? "border-primary/50" : "border-border/50 hover:border-border"
                )}
                onClick={() => toggleStep(step.id)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                      isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-foreground">
                        {step.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {step.estimatedTime}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Code Snippet */}
      <div className="bg-slate-950 rounded-2xl p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-md bg-primary/20 text-primary text-xs font-mono">
              {selectedCRM === "hubspot" ? "JavaScript" : "Apex"}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            className="text-white hover:text-primary"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Code
          </Button>
        </div>
        <pre className="text-sm text-white/70 overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <span className="text-sm text-muted-foreground">
          Progress: {completedSteps.length} of {steps.length} steps completed
        </span>
        <div className="flex gap-1">
          {steps.map(step => (
            <div
              key={step.id}
              className={cn(
                "w-8 h-2 rounded-full transition-colors",
                completedSteps.includes(step.id) ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
