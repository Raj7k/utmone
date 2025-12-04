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
  const bgStyle = variant === "primary" 
    ? { background: 'rgba(59,130,246,0.05)' }
    : variant === "accent" 
    ? { background: 'linear-gradient(to right, rgba(59,130,246,0.1), rgba(59,130,246,0.05))' }
    : undefined;

  return (
    <div className={`my-8 p-8 rounded-2xl ${variant === "default" ? "bg-muted/30" : ""} border border-border/50`} style={bgStyle}>
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