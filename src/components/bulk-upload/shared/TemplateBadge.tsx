import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface TemplateBadgeProps {
  templateName: string;
}

export const TemplateBadge = ({ templateName }: TemplateBadgeProps) => {
  return (
    <Badge variant="outline" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>
      <CheckCircle2 className="h-3 w-3 mr-1" />
      using template: {templateName}
    </Badge>
  );
};
