import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { SecurityKeyManager } from "@/components/admin/SecurityKeyManager";
import { TotpSettings } from "@/components/settings/TotpSettings";
import { AuditLogViewer } from "@/components/security/AuditLogViewer";
import { TimelineAuditViewer } from "@/components/security/TimelineAuditViewer";
import { SecurityAlertsWidget } from "@/components/security/SecurityAlertsWidget";
import { RoleRecommender } from "@/components/security/RoleRecommender";
import { Shield, Key, Monitor, FileText, Bell } from "lucide-react";

export const SecurityTabContent = () => {
  const [activeSubTab, setActiveSubTab] = useState("authentication");

  return (
    <div className="space-y-6">
      {/* Security Status Banner */}
      <SecurityAlertsWidget />
      
      {/* Sub-tabs Navigation */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-11 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger 
            value="authentication" 
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-2 text-xs sm:text-sm"
          >
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">authentication</span>
            <span className="sm:hidden">auth</span>
          </TabsTrigger>
          <TabsTrigger 
            value="sessions" 
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-2 text-xs sm:text-sm"
          >
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">sessions</span>
            <span className="sm:hidden">sessions</span>
          </TabsTrigger>
          <TabsTrigger 
            value="audit" 
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-2 text-xs sm:text-sm"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">audit log</span>
            <span className="sm:hidden">audit</span>
          </TabsTrigger>
          <TabsTrigger 
            value="recommendations" 
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-2 text-xs sm:text-sm"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">alerts</span>
            <span className="sm:hidden">alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="mt-6 space-y-6 animate-fade-in">
          <TotpSettings />
          <SecurityKeyManager />
        </TabsContent>

        <TabsContent value="sessions" className="mt-6 animate-fade-in">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="audit" className="mt-6 space-y-6 animate-fade-in">
          <TimelineAuditViewer />
          <AuditLogViewer />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6 animate-fade-in">
          <RoleRecommender />
        </TabsContent>
      </Tabs>
    </div>
  );
};
