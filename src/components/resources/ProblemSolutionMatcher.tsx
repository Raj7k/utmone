import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Lightbulb, ArrowRight } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  rootCause: string;
  solution: string;
  actionSteps: string[];
  relatedChecklist: string;
}

const problems: Problem[] = [
  {
    id: "slow-response",
    title: "Response time is slow",
    description: "Sales reps are taking 3+ hours to contact new MQLs, causing leads to go cold.",
    rootCause: "MQL alerts not reaching sales reps immediately, or reps checking CRM infrequently.",
    solution: "Turn on Slack alerts and mobile push notifications",
    actionSteps: [
      "Enable Slack integration in your CRM",
      "Create a dedicated #new-mqls channel",
      "Set up instant notifications when MQL score hits 30+",
      "Add mobile app push notifications for sales reps",
      "Target: < 1 hour response time"
    ],
    relatedChecklist: "Sales Rep's Daily Checklist"
  },
  {
    id: "bad-leads",
    title: "Sales says all leads are bad",
    description: "Sales team reports that most MQLs aren't actually qualified or ready to buy.",
    rootCause: "Lead scoring thresholds are too low, or engagement signals aren't weighted correctly.",
    solution: "Adjust scoring weights and raise MQL threshold",
    actionSteps: [
      "Review last 20 MQLs that didn't convert to SQL",
      "Identify common patterns (wrong company size, low engagement, etc.)",
      "Increase fit score requirements (e.g., company size from 10 to 15 points)",
      "Raise MQL threshold from 30 to 40 points",
      "Re-test with next 25 leads"
    ],
    relatedChecklist: "Marketing Ops Weekly Checklist"
  },
  {
    id: "no-close",
    title: "Leads convert but don't close",
    description: "MQLs become SQLs, but deals aren't closing at expected rates.",
    rootCause: "Leads are qualified but not ready to buy, or sales process needs improvement.",
    solution: "Review why they said no and adjust discovery questions",
    actionSteps: [
      "Interview last 10 lost deals to understand objections",
      "Add \"budget\" and \"timeline\" to SQL qualification criteria",
      "Update discovery call script to identify readiness signals",
      "Consider adding \"SAL\" stage between MQL and SQL",
      "Track \"not ready\" vs \"not qualified\" reasons separately"
    ],
    relatedChecklist: "Sales Leader's Weekly Checklist"
  },
  {
    id: "nurture-overflow",
    title: "Too many leads in nurture",
    description: "Hundreds of leads stuck in nurture phase, never progressing to MQL.",
    rootCause: "MQL threshold is too high, or nurture campaigns aren't engaging enough.",
    solution: "Raise MQL threshold from 30 to 40 points to reduce volume",
    actionSteps: [
      "Audit current nurture campaigns for engagement rates",
      "Identify which content drives MQL conversions",
      "Raise MQL threshold to 40 points to focus on higher-intent leads",
      "Create \"fast-track\" nurture for high-fit, low-engagement leads",
      "Set auto-archive rules for leads inactive > 90 days"
    ],
    relatedChecklist: "Marketer's Weekly Checklist"
  },
  {
    id: "no-attendance",
    title: "No one attends sync",
    description: "Weekly alignment meetings are skipped or attendance is inconsistent.",
    rootCause: "Meetings are too long (60 min) or lack clear structure and outcomes.",
    solution: "Make it 15 minutes, not 60 — use the timer",
    actionSteps: [
      "Cut meeting from 60 min to 15 min sharp",
      "Use the Weekly Sync Timer to stay on track",
      "Make attendance non-negotiable for leaders",
      "Share 1-page summary in Slack after each meeting",
      "Celebrate wins in the first 60 seconds to build momentum"
    ],
    relatedChecklist: "Sales Leader's Weekly Checklist"
  },
  {
    id: "crm-chaos",
    title: "CRM data is a mess",
    description: "Fields are missing, scores are wrong, and routing isn't working correctly.",
    rootCause: "No data governance, manual processes, or broken automation.",
    solution: "Implement validation rules and weekly data audits",
    actionSteps: [
      "Add required field validation for company name, size, industry",
      "Set up automated lead scoring (no manual score entry)",
      "Create data quality dashboard showing % complete profiles",
      "Assign marketing ops to audit top 100 leads weekly",
      "Block MQL progression if critical fields are empty"
    ],
    relatedChecklist: "Marketing Ops Weekly Checklist"
  },
  {
    id: "no-feedback",
    title: "Sales never gives feedback",
    description: "Marketing has no idea if leads are good or bad because sales doesn't log outcomes.",
    rootCause: "No structured feedback loop, or logging feels like extra work for sales reps.",
    solution: "Make feedback mandatory in SQL progression",
    actionSteps: [
      "Add \"Lead Quality\" dropdown to SQL status change (1-5 stars)",
      "Require reason field when marking MQL as \"not qualified\"",
      "Block SQL progression until feedback is logged",
      "Share top 3 feedback items in Tuesday sync",
      "Celebrate marketing when leads score 4-5 stars"
    ],
    relatedChecklist: "Sales Rep's Daily Checklist"
  },
  {
    id: "score-drift",
    title: "Scoring model becomes stale",
    description: "Lead scoring was accurate 3 months ago, but conversion rates are dropping now.",
    rootCause: "Market changed, ICP shifted, or campaign mix changed without updating scoring.",
    solution: "Review and adjust scoring monthly",
    actionSteps: [
      "Compare MQL-to-SQL rates month-over-month",
      "Analyze which score components predict closed deals best",
      "Interview 5 recent customers to validate fit score criteria",
      "Adjust engagement weights based on actual conversion data",
      "Document changes and re-test for 2 weeks"
    ],
    relatedChecklist: "Marketing Ops Weekly Checklist"
  },
  {
    id: "misaligned-goals",
    title: "Marketing and sales have different goals",
    description: "Marketing is measured on leads, sales on revenue — no shared accountability.",
    rootCause: "Incentives aren't aligned, no shared metrics or joint targets.",
    solution: "Create shared revenue target and track together",
    actionSteps: [
      "Set joint monthly revenue goal (e.g., $500K pipeline)",
      "Make MQL-to-SQL rate a shared KPI (target: 15%)",
      "Split commission/bonus based on pipeline contribution",
      "Celebrate wins together in Tuesday sync",
      "Hold both teams accountable for the 7 sacred metrics"
    ],
    relatedChecklist: "Sales Leader's Weekly Checklist"
  },
];

export const ProblemSolutionMatcher = () => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [solved, setSolved] = useState<Set<string>>(new Set());

  const handleProblemSelect = (problemId: string) => {
    const problem = problems.find(p => p.id === problemId);
    setSelectedProblem(problem || null);
  };

  const markAsSolved = () => {
    if (selectedProblem) {
      setSolved(prev => new Set([...prev, selectedProblem.id]));
    }
  };

  return (
    <Card className="my-8 border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">9 Common Problems + Quick Fixes</CardTitle>
            <CardDescription>interactive troubleshooting for alignment issues</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">What problem are you facing?</label>
          <Select onValueChange={handleProblemSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a problem to see the solution..." />
            </SelectTrigger>
            <SelectContent>
              {problems.map(problem => (
                <SelectItem key={problem.id} value={problem.id} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    {solved.has(problem.id) && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                    <span>{problem.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AnimatePresence mode="wait">
          {selectedProblem && (
            <motion.div
              key={selectedProblem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Problem Description */}
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">{selectedProblem.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProblem.description}</p>
                  </div>
                </div>
              </div>

              {/* Root Cause */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border">
                <p className="text-sm font-medium text-foreground mb-2">Root Cause:</p>
                <p className="text-sm text-muted-foreground">{selectedProblem.rootCause}</p>
              </div>

              {/* Solution */}
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Solution:</p>
                    <p className="text-base font-semibold text-foreground">{selectedProblem.solution}</p>
                  </div>
                </div>
              </div>

              {/* Action Steps */}
              <div className="p-4 rounded-xl border bg-primary/5 border-primary/20">
                <p className="text-sm font-medium text-foreground mb-3">Action Steps:</p>
                <ol className="space-y-2">
                  {selectedProblem.actionSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Related Checklist */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Related</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{selectedProblem.relatedChecklist}</span>
                </div>
                {!solved.has(selectedProblem.id) && (
                  <Button onClick={markAsSolved} variant="default">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Solved
                  </Button>
                )}
                {solved.has(selectedProblem.id) && (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Solved
                  </Badge>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedProblem && (
          <div className="p-8 text-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Select a problem from the dropdown above to see the solution</p>
          </div>
        )}

        {solved.size > 0 && (
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <p className="text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4 inline mr-2" />
              You've solved {solved.size} of {problems.length} common problems. Nice work!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};