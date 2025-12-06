import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface GlossaryTooltipProps {
  term: string;
  definition?: string;
  inline?: boolean;
}

const glossaryTerms: Record<string, string> = {
  "utm parameters": "Standardized URL tags (utm_source, utm_medium, utm_campaign, utm_term, utm_content) used to track campaign performance in analytics platforms like Google Analytics.",
  "link rot": "The phenomenon where URLs become invalid over time due to content removal, site restructuring, or platform shutdowns, breaking user journeys and campaign tracking.",
  "qr density": "The amount of data encoded in a QR code, measured in modules (black/white squares). Higher density codes require better scanning conditions but can store more information.",
  "clean-track": "utm.one's governance framework ensuring UTM naming consistency, link validation, and data quality across all campaigns and teams.",
  "semantic slug": "Human-readable URL segments that describe content meaning (e.g., /summer-sale-2025) rather than random characters (e.g., /x7k9p2), improving accessibility and SEO.",
  "contextual routing": "AI-powered link destination selection based on visitor context (device, location, time) to optimize conversion rates through Thompson Sampling algorithms.",
  "link health": "Real-time monitoring of link functionality including SSL validation, malware scanning, blacklist checking, and destination availability.",
  "attribution journey": "The complete path a visitor takes from first click through conversion, tracking all touchpoints for multi-touch attribution analysis.",
  "rls policy": "Row Level Security policy in Supabase/PostgreSQL that controls which database rows users can access based on authentication context.",
  "edge function": "Serverless function deployed at the network edge (close to users) for ultra-fast response times, used for redirects and analytics capture.",
  "workspace isolation": "Database architecture ensuring teams can only access their own data through strict access controls and query filters.",
  "smart rotation": "AI-driven link destination switching that learns which URLs perform best for different audience segments using reinforcement learning.",
  "thompson sampling": "Bayesian algorithm for A/B testing that dynamically allocates traffic to better-performing variants while continuously exploring alternatives.",
  "pareto frontier": "Set of optimal solutions where improving one metric requires sacrificing another, used to identify best-performing campaigns.",
  "gaussian process": "Machine learning model for click prediction that provides confidence intervals around forecasts, not just point estimates."
};

export const GlossaryTooltip = ({ term, definition, inline = false }: GlossaryTooltipProps) => {
  const termKey = term.toLowerCase();
  const definitionText = definition || glossaryTerms[termKey] || "Term definition not available";

  if (inline) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="underline decoration-dotted cursor-help decoration-primary/50">
              {term}
            </span>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="max-w-xs p-3 text-sm bg-card border border-border shadow-lg"
            sideOffset={5}
          >
            <p className="font-semibold mb-1 text-foreground">{term}</p>
            <p className="text-muted-foreground leading-relaxed">{definitionText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center gap-1 transition-colors text-primary">
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-3 text-sm bg-card border border-border shadow-lg"
          sideOffset={5}
        >
          <p className="font-semibold mb-1 text-foreground">{term}</p>
          <p className="text-muted-foreground leading-relaxed">{definitionText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Export glossary terms for use in search/autocomplete
export { glossaryTerms };