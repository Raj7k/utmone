import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface ValidationBadgeProps {
  status: "valid" | "duplicate" | "invalid";
  message?: string;
}

export const ValidationBadge = ({ status, message }: ValidationBadgeProps) => {
  if (status === "valid") {
    return (
      <div className="flex items-center gap-2 text-system-green">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-xs font-medium">valid</span>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div className="flex items-center gap-2 text-system-orange" title={message}>
        <AlertTriangle className="h-4 w-4" />
        <span className="text-xs font-medium">duplicate</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-destructive" title={message}>
      <XCircle className="h-4 w-4" />
      <span className="text-xs font-medium">{message || "invalid"}</span>
    </div>
  );
};
