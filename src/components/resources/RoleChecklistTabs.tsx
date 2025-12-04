import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ActionChecklist } from "@/components/resources/ActionChecklist";
import { Users, UserCheck, Shield, Settings } from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
}

export const RoleChecklistTabs = () => {
  const checklists = {
    marketer: {
      title: "Marketer's Weekly Checklist",
      icon: Users,
      color: "text-blue-600",
      items: [
        { id: "mk-1", text: "Sent 3+ campaigns this week" },
        { id: "mk-2", text: "Reviewed lead quality feedback from sales" },
        { id: "mk-3", text: "Attended Tuesday sync meeting" },
      ] as ChecklistItem[]
    },
    sales: {
      title: "Sales Rep's Daily Checklist",
      icon: UserCheck,
      color: "text-green-600",
      items: [
        { id: "sr-1", text: "Checked new MQLs in CRM" },
        { id: "sr-2", text: "Called/emailed all MQLs within 1 hour" },
        { id: "sr-3", text: "Logged notes and next steps in CRM" },
      ] as ChecklistItem[]
    },
    leader: {
      title: "Sales Leader's Weekly Checklist",
      icon: Shield,
      color: "text-purple-600",
      items: [
        { id: "sl-1", text: "Reviewed MQL-to-SQL rate this week" },
        { id: "sl-2", text: "Checked team response times" },
        { id: "sl-3", text: "Attended Tuesday sync meeting" },
      ] as ChecklistItem[]
    },
    ops: {
      title: "Marketing Ops Weekly Checklist",
      icon: Settings,
      color: "text-orange-600",
      items: [
        { id: "mo-1", text: "Verified scoring model working correctly" },
        { id: "mo-2", text: "Confirmed routing and alerts fired correctly" },
        { id: "mo-3", text: "Checked data quality in CRM" },
        { id: "mo-4", text: "Updated dashboard metrics" },
      ] as ChecklistItem[]
    },
  };

  return (
    <Card className="my-8 border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl">Role-Specific Checklists</CardTitle>
        <CardDescription>daily and weekly tasks for every team member</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="marketer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            {Object.entries(checklists).map(([key, checklist]) => {
              const Icon = checklist.icon;
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2 py-3">
                  <Icon className={`w-4 h-4 ${checklist.color}`} />
                  <span className="hidden sm:inline">
                    {key === "marketer" ? "Marketer" : 
                     key === "sales" ? "Sales Rep" :
                     key === "leader" ? "Sales Leader" :
                     "Marketing Ops"}
                  </span>
                  <span className="sm:hidden">
                    {key === "marketer" ? "Mktr" : 
                     key === "sales" ? "Sales" :
                     key === "leader" ? "Leader" :
                     "Ops"}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(checklists).map(([key, checklist]) => {
            const Icon = checklist.icon;
            return (
              <TabsContent key={key} value={key} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                      <Icon className={`w-5 h-5 ${checklist.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{checklist.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {key === "sales" ? "Complete daily" : "Complete weekly"}
                      </p>
                    </div>
                  </div>
                  
                  <ActionChecklist
                    items={checklist.items}
                    storageKey={`sla-checklist-${key}`}
                  />

                  <div className="p-4 rounded-xl bg-muted/20 border border-border mt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Pro tip:</strong>{" "}
                      {key === "marketer" && "Track campaign performance weekly to adjust MQL scoring thresholds."}
                      {key === "sales" && "The faster you respond to MQLs, the higher your close rate. Aim for < 1 hour."}
                      {key === "leader" && "If MQL-to-SQL rate drops below 10%, review scoring with marketing."}
                      {key === "ops" && "Monitor CRM data quality daily to prevent bad data from breaking reporting."}
                    </p>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};
