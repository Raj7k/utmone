import { UTMTemplateManager } from "../UTMTemplateManager";
import { SharedTemplatesManager } from "../SharedTemplatesManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TemplatesTabProps {
  workspaceId: string;
}

export const TemplatesTab = ({ workspaceId }: TemplatesTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">template management</h2>
        <p className="text-muted-foreground">create and manage bulk upload templates</p>
      </div>

      <Tabs defaultValue="utm">
        <TabsList>
          <TabsTrigger value="utm">UTM templates</TabsTrigger>
          <TabsTrigger value="shared">shared templates</TabsTrigger>
        </TabsList>

        <TabsContent value="utm" className="mt-6">
          <UTMTemplateManager workspaceId={workspaceId} onApplyTemplate={() => {}} />
        </TabsContent>

        <TabsContent value="shared" className="mt-6">
          <SharedTemplatesManager workspaceId={workspaceId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
