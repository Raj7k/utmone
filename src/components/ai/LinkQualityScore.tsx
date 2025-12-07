import { useMemo } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LinkQualityScoreProps {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  customSlug?: boolean;
  hasAISuggestions?: boolean;
}

const standardMediums = ['cpc', 'email', 'social', 'organic', 'referral', 'banner', 'video', 'affiliate', 'newsletter'];

export function LinkQualityScore({
  utmSource = '',
  utmMedium = '',
  utmCampaign = '',
  utmTerm = '',
  utmContent = '',
  customSlug = false,
  hasAISuggestions = false,
}: LinkQualityScoreProps) {
  const { score, insights } = useMemo(() => {
    let calculatedScore = 30; // Base score
    const tips: string[] = [];

    // +15 for source
    if (utmSource) {
      calculatedScore += 15;
    } else {
      tips.push('add a source for +15 points');
    }

    // +15 for medium (extra +5 if standard)
    if (utmMedium) {
      calculatedScore += 15;
      if (standardMediums.includes(utmMedium.toLowerCase())) {
        calculatedScore += 5;
      } else {
        tips.push('use a standard medium for +5 points');
      }
    } else {
      tips.push('add a medium for +15 points');
    }

    // +15 for campaign
    if (utmCampaign) {
      calculatedScore += 15;
    } else {
      tips.push('add a campaign for +15 points');
    }

    // +5 for term
    if (utmTerm) {
      calculatedScore += 5;
    }

    // +5 for content
    if (utmContent) {
      calculatedScore += 5;
    }

    // +10 for custom slug
    if (customSlug) {
      calculatedScore += 10;
    } else {
      tips.push('use a custom slug for +10 points');
    }

    // +5 for AI suggestions used
    if (hasAISuggestions) {
      calculatedScore += 5;
    }

    return { 
      score: Math.min(100, calculatedScore),
      insights: tips.slice(0, 2) // Show top 2 tips
    };
  }, [utmSource, utmMedium, utmCampaign, utmTerm, utmContent, customSlug, hasAISuggestions]);

  const getScoreColor = () => {
    if (score >= 80) return 'hsl(var(--primary))';
    if (score >= 50) return 'hsl(45, 93%, 47%)'; // Amber
    return 'hsl(var(--muted-foreground))';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'strong link';
    if (score >= 50) return 'good link';
    return 'needs work';
  };

  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative flex items-center gap-2 cursor-help">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
                {/* Background circle */}
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="3"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke={getScoreColor()}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  key={score}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-xs font-semibold"
                  style={{ color: getScoreColor() }}
                >
                  {score}
                </motion.span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {getScoreLabel()}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-medium">link quality score: {score}/100</p>
            {insights.length > 0 && (
              <ul className="text-xs space-y-1">
                {insights.map((tip, i) => (
                  <li key={i} className="text-muted-foreground">• {tip}</li>
                ))}
              </ul>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
