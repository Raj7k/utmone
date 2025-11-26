import { BulkUploadAnalytics } from "../BulkUploadAnalytics";
import { BatchLinkOperations } from "../BatchLinkOperations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsTabProps {
  workspaceId: string;
}

export const AnalyticsTab = ({ workspaceId }: AnalyticsTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">bulk analytics</h2>
        <p className="text-muted-foreground">aggregate metrics and batch operations</p>
      </div>

      <Tabs defaultValue="analytics">
        <TabsList>
          <TabsTrigger value="analytics">analytics</TabsTrigger>
          <TabsTrigger value="operations">batch operations</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <BulkUploadAnalytics workspaceId={workspaceId} />
        </TabsContent>

        <TabsContent value="operations" className="mt-6">
          <BatchLinkOperations workspaceId={workspaceId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
