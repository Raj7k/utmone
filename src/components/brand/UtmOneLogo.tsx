import { cn } from "@/lib/utils";
import utmOneIcon from "@/assets/utm-one-icon.png";

interface UtmOneLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  className?: string;
  variant?: "light" | "dark"; // light = white text (for dark bg), dark = black text (for light bg)
}

export const UtmOneLogo = ({ size = "md", showIcon = true, className, variant = "light" }: UtmOneLogoProps) => {
  const sizeConfig = {
    sm: { icon: "h-6", text: "text-lg" },
    md: { icon: "h-8", text: "text-xl" },
    lg: { icon: "h-10", text: "text-2xl" },
    xl: { icon: "h-12", text: "text-3xl" },
  };

  const textColor = variant === "dark" ? "text-zinc-900" : "text-foreground";

  // Size dimensions for CLS prevention
  const dimensions = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 40, height: 40 },
    xl: { width: 48, height: 48 },
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <img 
          src={utmOneIcon} 
          alt="" 
          width={dimensions[size].width}
          height={dimensions[size].height}
          className={sizeConfig[size].icon} 
          loading="eager"
        />
      )}
      <span className={cn(
        "font-display font-semibold tracking-tight",
        textColor,
        sizeConfig[size].text
      )}>
        utm.one
      </span>
    </div>
  );
};
