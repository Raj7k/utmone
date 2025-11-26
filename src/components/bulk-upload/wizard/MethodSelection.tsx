import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Zap } from "lucide-react";
import { BulkTemplateSelector } from "../BulkTemplateSelector";

interface MethodSelectionProps {
  workspaceId: string;
  onUseTemplate: (template: any) => void;
  onStartFresh: () => void;
}

export const MethodSelection = ({ workspaceId, onUseTemplate, onStartFresh }: MethodSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display">choose your method</h2>
        <p className="text-muted-foreground">
          templates save time by pre-filling domain, UTM parameters, and organization settings
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>use template</CardTitle>
                <CardDescription>perfect for recurring campaigns</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BulkTemplateSelector
              workspaceId={workspaceId}
              onTemplateSelect={(template) => {
                if (template) {
                  onUseTemplate(template);
                }
              }}
            />
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <FileText className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <CardTitle>start fresh</CardTitle>
                <CardDescription>configure everything manually</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={onStartFresh} variant="outline" className="w-full">
              start from scratch
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
