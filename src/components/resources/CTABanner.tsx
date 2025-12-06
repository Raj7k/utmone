import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CTABannerProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  variant?: "default" | "primary" | "accent";
}

export const CTABanner = ({ 
  title, 
  description, 
  buttonText, 
  buttonHref,
  variant = "default" 
}: CTABannerProps) => {
  const bgClass = variant === "primary" 
    ? "bg-primary/5"
    : variant === "accent" 
    ? "bg-gradient-to-r from-primary/10 to-primary/5"
    : "bg-muted/30";

  return (
    <div className={`my-8 p-8 rounded-2xl ${bgClass} border border-border/50`}>
      <div className="max-w-[600px] mx-auto text-center space-y-4">
        <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground">
          {title}
        </h3>
        
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
        
        <Link to={buttonHref}>
          <Button size="lg" className="gap-2">
            {buttonText}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};