import { BulkUploadComments } from "../BulkUploadComments";
import { BulkUploadApprovalWorkflow } from "../BulkUploadApprovalWorkflow";
import { BulkUploadActivityLog } from "../BulkUploadActivityLog";
import { BulkUploadAssignment } from "../BulkUploadAssignment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamTabProps {
  workspaceId: string;
}

export const TeamTab = ({ workspaceId }: TeamTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">team collaboration</h2>
        <p className="text-muted-foreground">manage approvals, comments, and activity</p>
      </div>

      <Tabs defaultValue="approvals">
        <TabsList>
          <TabsTrigger value="approvals">approvals</TabsTrigger>
          <TabsTrigger value="comments">comments</TabsTrigger>
          <TabsTrigger value="activity">activity log</TabsTrigger>
          <TabsTrigger value="assignments">assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="mt-6">
          <p className="text-sm text-muted-foreground">select an upload to view approvals</p>
        </TabsContent>

        <TabsContent value="comments" className="mt-6">
          <p className="text-sm text-muted-foreground">select an upload to view comments</p>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <p className="text-sm text-muted-foreground">select an upload to view activity</p>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <p className="text-sm text-muted-foreground">select an upload to manage assignments</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};
