import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

interface SlackCardProps {
  workspaceId: string;
}

export const SlackCard = ({ workspaceId }: SlackCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#4A154B]/10 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-[#4A154B]" />
          </div>
          <div>
            <h3 className="font-semibold">Slack</h3>
            <p className="text-xs text-tertiary-label">get notified on conversions</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-muted/30">
          coming soon
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-secondary-label">
          receive real-time notifications when deals close or pipeline stages change
        </div>

        <Button className="w-full" variant="outline" disabled>
          connect slack
        </Button>
      </div>
    </Card>
  );
};
