import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

interface DomainBadgeProps {
  isVerified?: boolean;
  isPrimary?: boolean;
  sslStatus?: string;
  showIcon?: boolean;
  variant?: "default" | "outline";
}

export const DomainBadge = ({
  isVerified = false,
  isPrimary = false,
  sslStatus = "pending",
  showIcon = true,
  variant = "default",
}: DomainBadgeProps) => {
  if (isPrimary && isVerified) {
    return (
      <Badge variant={variant} style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
        {showIcon && <CheckCircle2 className="w-3 h-3 mr-1" />}
        Primary
      </Badge>
    );
  }

  if (isVerified) {
    return (
      <Badge variant={variant} className="bg-green-600 text-white">
        {showIcon && <CheckCircle2 className="w-3 h-3 mr-1" />}
        Verified
      </Badge>
    );
  }

  if (sslStatus === "failed") {
    return (
      <Badge variant="destructive">
        {showIcon && <XCircle className="w-3 h-3 mr-1" />}
        Failed
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-yellow-600 text-yellow-600">
      {showIcon && <Clock className="w-3 h-3 mr-1" />}
      Pending
    </Badge>
  );
};

interface DomainStatusProps {
  domain: string;
  isVerified: boolean;
  isPrimary: boolean;
}

export const DomainStatus = ({ domain, isVerified, isPrimary }: DomainStatusProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{domain}</span>
      <DomainBadge isVerified={isVerified} isPrimary={isPrimary} />
    </div>
  );
};
