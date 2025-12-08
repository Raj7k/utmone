import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface TemplateBadgeProps {
  templateName: string;
}

export const TemplateBadge = ({ templateName }: TemplateBadgeProps) => {
  return (
    <Badge variant="outline" className="bg-white/5 border-white/20 text-white-90">
      <CheckCircle2 className="h-3 w-3 mr-1" />
      using template: {templateName}
    </Badge>
  );
};
