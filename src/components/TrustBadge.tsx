import { Shield, ShieldAlert, ShieldCheck, Lock, AlertTriangle, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TrustBadgeVariant = 'ssl-secure' | 'scanned-safe' | 'threats-detected' | 'not-scanned' | 'utm-verified';
type TrustBadgeSize = 'sm' | 'md' | 'lg';

interface TrustBadgeProps {
  variant: TrustBadgeVariant;
  size?: TrustBadgeSize;
  className?: string;
}

const variantConfig = {
  'ssl-secure': {
    icon: Lock,
    label: 'SSL Secured',
    style: { background: 'rgba(34,197,94,0.1)', color: 'rgba(34,197,94,0.9)', borderColor: 'rgba(34,197,94,0.2)' },
  },
  'scanned-safe': {
    icon: ShieldCheck,
    label: 'Scanned & Safe',
    style: { background: 'rgba(34,197,94,0.1)', color: 'rgba(34,197,94,0.9)', borderColor: 'rgba(34,197,94,0.2)' },
  },
  'threats-detected': {
    icon: ShieldAlert,
    label: 'Threats Detected',
    style: { background: 'rgba(239,68,68,0.1)', color: 'rgba(239,68,68,0.9)', borderColor: 'rgba(239,68,68,0.2)' },
  },
  'not-scanned': {
    icon: AlertTriangle,
    label: 'Not Scanned',
    style: { background: 'rgba(234,179,8,0.1)', color: 'rgba(234,179,8,0.9)', borderColor: 'rgba(234,179,8,0.2)' },
  },
  'utm-verified': {
    icon: BadgeCheck,
    label: 'utm.one verified',
    style: { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.2)' },
  },
};

const sizeConfig = {
  sm: {
    badge: 'text-xs py-0.5 px-2',
    icon: 'h-3 w-3',
  },
  md: {
    badge: 'text-sm py-1 px-3',
    icon: 'h-4 w-4',
  },
  lg: {
    badge: 'text-base py-1.5 px-4',
    icon: 'h-5 w-5',
  },
};

export const TrustBadge = ({ variant, size = 'md', className }: TrustBadgeProps) => {
  const config = variantConfig[variant];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 font-medium',
        sizeStyles.badge,
        className
      )}
      style={config.style}
      aria-label={config.label}
    >
      <Icon className={sizeStyles.icon} aria-hidden="true" />
      <span>{config.label}</span>
    </Badge>
  );
};
