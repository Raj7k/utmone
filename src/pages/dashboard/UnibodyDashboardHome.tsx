import { motion } from "framer-motion";
import { HeroInput } from "@/components/dashboard/HeroInput";
import { BentoRecentLinksTile } from "@/components/dashboard/bento/BentoRecentLinksTile";
import { AIInsightsTile } from "@/components/dashboard/bento/AIInsightsTile";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { LinkHealthWidget } from "@/components/analytics/LinkHealthWidget";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";

const MonolithCard = ({ 
  children, 
  className,
  dimmed = false 
}: { 
  children: React.ReactNode; 
  className?: string;
  dimmed?: boolean;
}) => (
  <motion.div
    whileHover={{ opacity: 1 }}
    className={cn(
      "transition-opacity duration-300",
      dimmed ? "opacity-50 hover:opacity-100" : "opacity-100",
      className
    )}
  >
    {children}
  </motion.div>
);

const UnibodyDashboardHome = () => {
  const { currentWorkspace } = useWorkspaceContext();

  return (
    <ErrorBoundary section="unibody-dashboard-home">
      <div className="space-y-16">
        {/* Hero Section - Always-On Input */}
        <section className="pt-12 pb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Create a link
            </h1>
            <p className="text-zinc-500 text-lg mb-8">
              Paste any URL to shorten and track
            </p>
          </motion.div>
          
          <HeroInput />
        </section>

        {/* Onboarding - Only shows for new users */}
        <ErrorBoundary section="onboarding-checklist">
          <OnboardingChecklist />
        </ErrorBoundary>

        {/* The Monolith - Single Pane of Glass */}
        <section className="space-y-12">
          {/* Primary Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MonolithCard dimmed>
              <ErrorBoundary section="ai-insights">
                <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-colors">
                  <AIInsightsTile />
                </div>
              </ErrorBoundary>
            </MonolithCard>

            <MonolithCard dimmed>
              <ErrorBoundary section="link-health">
                <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-colors">
                  <LinkHealthWidget />
                </div>
              </ErrorBoundary>
            </MonolithCard>
          </div>

          {/* Recent Links - Full Width */}
          <MonolithCard>
            <ErrorBoundary section="recent-links">
              <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5">
                <BentoRecentLinksTile />
              </div>
            </ErrorBoundary>
          </MonolithCard>
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default UnibodyDashboardHome;
