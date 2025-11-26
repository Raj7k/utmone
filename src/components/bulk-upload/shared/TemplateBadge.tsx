import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface TemplateBadgeProps {
  templateName: string;
}

export const TemplateBadge = ({ templateName }: TemplateBadgeProps) => {
  return (
    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
      <CheckCircle2 className="h-3 w-3 mr-1" />
      using template: {templateName}
    </Badge>
  );
};
