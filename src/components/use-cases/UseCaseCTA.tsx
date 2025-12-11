import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface UseCaseCTAProps {
  headline: string;
  subheadline?: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  variant?: "dark" | "light" | "gradient";
}

export const UseCaseCTA = ({
  headline,
  subheadline,
  primaryCTA = { label: "get early access", href: "/early-access" },
  secondaryCTA,
  variant = "dark",
}: UseCaseCTAProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const bgClasses = {
    dark: "bg-foreground text-background",
    light: "bg-muted/50 text-foreground",
    gradient: "bg-gradient-to-br from-primary/10 via-background to-primary/5 text-foreground",
  };

  const buttonVariant = variant === "dark" ? "secondary" : "default";

  return (
    <section 
      ref={ref} 
      className={`py-20 md:py-28 ${bgClasses[variant]}`}
    >
      <div className="max-w-[980px] mx-auto px-6 md:px-8 text-center">
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {headline}
        </motion.h2>
        
        {subheadline && (
          <motion.p 
            className={`text-lg max-w-xl mx-auto mb-10 ${variant === "dark" ? "text-background/70" : "text-muted-foreground"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {subheadline}
          </motion.p>
        )}

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button asChild size="lg" variant={buttonVariant} className="text-base group">
            <Link to={primaryCTA.href}>
              {primaryCTA.label}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          {secondaryCTA && (
            <Button 
              asChild 
              size="lg" 
              variant={variant === "dark" ? "ghost" : "outline"} 
              className={`text-base ${variant === "dark" ? "text-background/80 hover:text-background hover:bg-background/10" : ""}`}
            >
              <Link to={secondaryCTA.href}>{secondaryCTA.label}</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};
