import { BulkUploadHistory } from "../BulkUploadHistory";
import { ScheduledLinksManager } from "../ScheduledLinksManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HistoryTabProps {
  workspaceId: string;
}

export const HistoryTab = ({ workspaceId }: HistoryTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">upload history</h2>
        <p className="text-muted-foreground">view and manage your past bulk uploads</p>
      </div>

      <Tabs defaultValue="completed">
        <TabsList>
          <TabsTrigger value="completed">completed</TabsTrigger>
          <TabsTrigger value="scheduled">scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="completed" className="mt-6">
          <BulkUploadHistory workspaceId={workspaceId} />
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <ScheduledLinksManager workspaceId={workspaceId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
