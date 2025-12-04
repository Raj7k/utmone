import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CaseStudy {
  company: string;
  metric: string;
  growth: string;
  approach: string;
  timeline: string;
  details: string[];
}

const caseStudies: CaseStudy[] = [
  {
    company: "Airbnb",
    metric: "21K → 80M guest arrivals",
    growth: "380,900%",
    approach: "Spreadsheet attribution tracking Craigslist posts and event-driven demand",
    timeline: "2009-2016",
    details: [
      "Tracked which Craigslist posts drove hosts to platform",
      "Measured event-driven demand spikes (SXSW, DNC)",
      "Used simple spreadsheets for cost per acquisition",
      "Concentrated on supply side first, customers second"
    ]
  },
  {
    company: "Dropbox",
    metric: "900% growth, 25:1 ROI",
    growth: "900%",
    approach: "Referral attribution with viral loop tracking",
    timeline: "Within first year",
    details: [
      "Built attribution into referral program from day one",
      "Tracked every share, click, and signup through referral links",
      "Measured viral coefficient to optimize loop",
      "Generated millions in revenue within first year"
    ]
  },
  {
    company: "Slack",
    metric: "2M users, 30% free-to-paid",
    growth: "30% conversion",
    approach: "Product-led attribution with usage-based scoring",
    timeline: "2 years",
    details: [
      "Tracked feature usage as attribution signals",
      "Measured team collaboration patterns",
      "Built conversion prediction models",
      "Achieved 30% free-to-paid conversion rate"
    ]
  },
  {
    company: "HubSpot",
    metric: "75% leads from content",
    growth: "75%",
    approach: "Custom multi-touch attribution models",
    timeline: "Ongoing",
    details: [
      "Built proprietary attribution software",
      "Tracked content influence across customer journey",
      "Measured blog post ROI individually",
      "Achieved $30B market cap with content-first strategy"
    ]
  },
  {
    company: "Monday.com",
    metric: "$7B valuation, 180K+ orgs",
    growth: "Industry-specific",
    approach: "Persona-based attribution models",
    timeline: "Scale phase",
    details: [
      "Created industry-specific attribution models",
      "Tracked persona-based conversion patterns",
      "Measured product-led growth attribution",
      "Personalized experiences based on attribution data"
    ]
  }
];

export const CaseStudyCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  const currentStudy = caseStudies[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? caseStudies.length - 1 : prev - 1));
    setExpanded(null);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === caseStudies.length - 1 ? 0 : prev + 1));
    setExpanded(null);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl p-8 md:p-12 border-2 border-border/50 hover:border-white/20 transition-all"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-4xl font-display font-bold text-foreground mb-3">
                {currentStudy.company}
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl font-display font-bold" style={{ color: 'rgba(59,130,246,1)' }}>
                  {currentStudy.growth}
                </span>
                <div className="text-sm text-muted-foreground">
                  <div>{currentStudy.metric}</div>
                  <div className="text-xs">{currentStudy.timeline}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                attribution approach
              </h4>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {currentStudy.approach}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setExpanded(expanded === currentIndex ? null : currentIndex)}
              className="w-full"
            >
              {expanded === currentIndex ? "Hide Details" : "Read Full Story"}
            </Button>

            <AnimatePresence>
              {expanded === currentIndex && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-border/50 space-y-3">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                      key insights
                    </h4>
                    <ul className="space-y-2">
                      {currentStudy.details.map((detail, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="mt-1" style={{ color: 'rgba(59,130,246,1)' }}>•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {caseStudies.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setExpanded(null);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "w-8"
                  : "bg-muted hover:bg-muted-foreground/50"
              )}
              style={index === currentIndex ? { background: 'rgba(59,130,246,1)' } : undefined}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          className="gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
