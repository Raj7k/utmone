import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import FraudAlerts from "@/components/admin/FraudAlerts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WaitlistAnalytics() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold mb-2">waitlist analytics</h1>
        <p className="text-muted-foreground">comprehensive analytics and fraud detection</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">overview</TabsTrigger>
          <TabsTrigger value="fraud">fraud alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="fraud" className="space-y-6">
          <FraudAlerts />
        </TabsContent>
      </Tabs>
    </div>
  );
}