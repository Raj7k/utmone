import { getBrandConfig } from "@/lib/brandRegistry";
import { cn } from "@/lib/utils";

interface InlineBrandProps {
  brand: string;
  showLabel?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export const InlineBrand = ({ 
  brand, 
  showLabel = true, 
  size = "sm",
  className 
}: InlineBrandProps) => {
  const config = getBrandConfig(brand);
  
  if (!config) {
    return <span>{brand}</span>;
  }
  
  const Icon = config.icon;
  
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} style={{ color: config.color }}>
      <Icon className={sizeClasses[size]} />
      {showLabel && <span>{config.name}</span>}
    </span>
  );
};
