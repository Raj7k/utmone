import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface PlaybookInlineCTAProps {
  variant: "subtle" | "action" | "proof" | "question";
  headline: string;
  subtext?: string;
  ctaText?: string;
  ctaHref?: string;
  badge?: string;
  socialProof?: string;
  className?: string;
}

export const PlaybookInlineCTA = ({
  variant,
  headline,
  subtext,
  ctaText = "get early access",
  ctaHref = "/early-access",
  badge,
  socialProof,
  className,
}: PlaybookInlineCTAProps) => {
  const variants = {
    subtle: {
      container: "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/10",
      icon: <Sparkles className="w-5 h-5 text-primary" />,
    },
    action: {
      container: "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30",
      icon: <Zap className="w-5 h-5 text-primary" />,
    },
    proof: {
      container: "bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent border border-emerald-500/20",
      icon: <Users className="w-5 h-5 text-emerald-500" />,
    },
    question: {
      container: "bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20",
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    },
  };

  const config = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "rounded-2xl p-6 md:p-8 my-8",
        config.container,
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Icon */}
        <div className="shrink-0 w-12 h-12 rounded-xl bg-background/50 backdrop-blur flex items-center justify-center">
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          {badge && (
            <Badge className="mb-2 bg-primary/20 text-primary border-primary/30 text-xs">
              {badge}
            </Badge>
          )}
          <h4 className="text-lg md:text-xl font-semibold text-foreground">
            {headline}
          </h4>
          {subtext && (
            <p className="text-sm text-muted-foreground">{subtext}</p>
          )}
          {socialProof && (
            <p className="text-xs text-muted-foreground/80 flex items-center gap-1.5 mt-2">
              <Users className="w-3 h-3" />
              {socialProof}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="shrink-0">
          <Button asChild size="lg" className="gap-2 w-full md:w-auto">
            <Link to={ctaHref}>
              {ctaText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
