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
    className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  },
  'scanned-safe': {
    icon: ShieldCheck,
    label: 'Scanned & Safe',
    className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  },
  'threats-detected': {
    icon: ShieldAlert,
    label: 'Threats Detected',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  'not-scanned': {
    icon: AlertTriangle,
    label: 'Not Scanned',
    className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  },
  'utm-verified': {
    icon: BadgeCheck,
    label: 'utm.one verified',
    className: 'bg-muted text-foreground border-border',
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
        config.className,
        className
      )}
      aria-label={config.label}
    >
      <Icon className={sizeStyles.icon} aria-hidden="true" />
      <span>{config.label}</span>
    </Badge>
  );
};
