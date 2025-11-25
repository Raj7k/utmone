import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface ComingSoonBadgeProps {
  children: ReactNode;
  className?: string;
}

export const ComingSoonBadge = ({ children, className = "" }: ComingSoonBadgeProps) => {
  return (
    <div className={`relative opacity-50 pointer-events-none ${className}`}>
      <Badge className="absolute -top-2 -right-2 z-10 bg-muted text-muted-foreground border border-border">
        Coming Soon
      </Badge>
      {children}
    </div>
  );
};
