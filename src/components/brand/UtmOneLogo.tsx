import { cn } from "@/lib/utils";
import utmOneIcon from "@/assets/utm-one-icon.png";

interface UtmOneLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  className?: string;
}

export const UtmOneLogo = ({ size = "md", showIcon = true, className }: UtmOneLogoProps) => {
  const sizeConfig = {
    sm: { icon: "h-6", text: "text-lg" },
    md: { icon: "h-8", text: "text-xl" },
    lg: { icon: "h-10", text: "text-2xl" },
    xl: { icon: "h-12", text: "text-3xl" },
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <img src={utmOneIcon} alt="" className={sizeConfig[size].icon} />
      )}
      <span className={cn(
        "font-display font-semibold tracking-tight text-foreground",
        sizeConfig[size].text
      )}>
        utm.one
      </span>
    </div>
  );
};
