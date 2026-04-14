import { supabaseFrom } from "@/lib/supabaseHelper";
import { useState, useEffect } from "react";
import { GuideLayout } from "@/components/resources/GuideLayout";
import { ActionChecklist } from "@/components/resources/ActionChecklist";
import { CTABanner } from "@/components/resources/CTABanner";
import { FAQAccordion, FAQCategory } from "@/components/resources/FAQAccordion";
import { PlaybookInlineCTA } from "@/components/resources/PlaybookInlineCTA";
import { SharePrompt } from "@/components/resources/SharePrompt";
import { ProgressiveReveal } from "@/components/landing/ProgressiveReveal";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Users, MousePointerClick, Target, ShieldCheck, TrendingUp, Award, ChevronRight, ChevronDown, Database, Code, Zap, Globe, Trophy, Settings, Mail, Copy, Check, Clock, Sparkles, ArrowRight, BookOpen, Wrench, MessageSquare, Link2, Share2, LayoutDashboard, Gift, Radio, CheckCircle2, Calendar, Megaphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Product Screenshots
import heroLanding from "@/assets/playbooks/hr-katalyst/hero-landing.png";
import howItWorks from "@/assets/playbooks/hr-katalyst/how-it-works.png";
import hallOfChampions from "@/assets/playbooks/hr-katalyst/hall-of-champions.png";
import campaignStats from "@/assets/playbooks/hr-katalyst/campaign-stats.png";
import leaderboardTable from "@/assets/playbooks/hr-katalyst/leaderboard-table.png";
import emailCampaigns from "@/assets/playbooks/hr-katalyst/email-campaigns.png";
import adminDashboard from "@/assets/playbooks/hr-katalyst/admin-dashboard.png";
import adminDashboardHero from "@/assets/playbooks/hr-katalyst/admin-dashboard-hero.png";
import referralFlow from "@/assets/playbooks/hr-katalyst/referral-flow.png";

// ============================================
// PLAYBOOK SCREENSHOT COMPONENT
// ============================================
const PlaybookScreenshot = ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
  <figure className="my-8">
    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/30 bg-card">
      <img src={src} alt={alt} className="w-full" loading="lazy" />
    </div>
    {caption && (
      <figcaption className="text-center text-sm text-muted-foreground mt-3">{caption}</figcaption>
    )}
  </figure>
);

// ============================================
// ANIMATED COUNTER COMPONENT
// ============================================
const AnimatedCounter = ({ value, suffix = "" }: { value: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [numericValue]);
  
  const formatted = count.toLocaleString();
  return <span>{formatted}{suffix}</span>;
};

// ============================================
// PART DIVIDER COMPONENT
// ============================================
const partGradients: Record<number, { bg: string; icon: string; badge: string }> = {
  1: {
    bg: "bg-gradient-to-r from-amber-500/5 via-orange-500/10 to-amber-500/5",
    icon: "bg-gradient-to-br from-amber-500/20 to-orange-500/10",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  2: {
    bg: "bg-gradient-to-r from-emerald-500/5 via-green-500/10 to-emerald-500/5",
    icon: "bg-gradient-to-br from-emerald-500/20 to-green-500/10",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  3: {
    bg: "bg-gradient-to-r from-violet-500/5 via-purple-500/10 to-violet-500/5",
    icon: "bg-gradient-to-br from-violet-500/20 to-purple-500/10",
    badge: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
  },
};

const PartDivider = ({ part, title, subtitle, icon: Icon }: { part: number; title: string; subtitle: string; icon: React.ElementType }) => {
  const gradient = partGradients[part] || partGradients[1];
  
  return (
    <div className="relative py-16 my-16">
      <div className={cn("absolute inset-0", gradient.bg)} />
      <div className="relative text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-lg", gradient.icon)}>
            <Icon className="w-6 h-6 text-foreground" />
          </div>
          <Badge className={cn("text-lg px-4 py-1 border", gradient.badge)}>Part {part}</Badge>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">{title}</h2>
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

// ============================================
// SEASON PROGRESSION CHART
// ============================================
const SeasonProgressionChart = () => {
  const seasons = [
    { season: "HR Katalyst 1", registrations: "10K", referrals: 332, percentage: 3.3 },
    { season: "HR Katalyst 2", registrations: "16K", referrals: 437, percentage: 2.7 },
    { season: "HR Katalyst 3", registrations: "18K", referrals: 554, percentage: 3.1 },
    { season: "HR Katalyst 4", registrations: "29K", referrals: 897, percentage: 3.1 },
    { season: "HR Katalyst 5", registrations: "25K", referrals: 6900, percentage: 27.6 },
  ];

  const maxPercentage = 27.6;

  return (
    <Card className="p-6 bg-card border-border">
      <h4 className="font-semibold text-foreground mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Season Progression: Referral as % of Total Registrations
      </h4>
      <div className="space-y-4">
        {seasons.map((s, i) => (
          <motion.div 
            key={s.season}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-28 text-sm text-muted-foreground shrink-0 font-medium">{s.season}</div>
            <div className="w-12 text-sm text-foreground shrink-0">{s.registrations}</div>
            <div className="flex-1 h-8 bg-muted/30 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${(s.percentage / maxPercentage) * 100}%` }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
                className={cn(
                  "h-full rounded-full flex items-center justify-end pr-3",
                  i === seasons.length - 1 
                    ? "bg-gradient-to-r from-primary to-primary/80" 
                    : "bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/50"
                )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground">
                {s.percentage}%
              </span>
            </div>
            <div className="w-20 text-sm text-muted-foreground text-right shrink-0">
              {s.referrals.toLocaleString()} refs
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
        <p className="text-foreground font-medium">
          Referral went from <span className="text-muted-foreground">~3%</span> to <span className="text-primary font-bold">28%</span> of total registrations
        </p>
      </div>
    </Card>
  );
};

// ============================================
// REFERRER SANKEY DIAGRAM (982 → Split Paths)
// ============================================
const ReferrerSankey = () => {
  const paths = [
    { label: "Zero conversions", count: 643, percentage: 65, conversions: 0, color: "text-muted-foreground" },
    { label: "1-9 conversions", count: 304, percentage: 31, conversions: 823, color: "text-blue-500" },
    { label: "10-99 conversions", count: 28, percentage: 3, conversions: 909, color: "text-amber-500" },
    { label: "100+ conversions", count: 7, percentage: 0.7, conversions: 3173, color: "text-primary" },
  ];

  return (
    <Card className="p-6 bg-card border-border overflow-hidden">
      <h4 className="font-semibold text-foreground mb-6 flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        The Referrer Journey: What Happened to 982 Referrers
      </h4>
      
      {/* Sankey visualization */}
      <div className="relative">
        {/* Source node */}
        <div className="flex items-center justify-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="bg-primary/20 border-2 border-primary rounded-2xl px-8 py-4 text-center"
          >
            <div className="text-3xl font-bold text-foreground">982</div>
            <div className="text-sm text-muted-foreground">Signed Up as Referrers</div>
          </motion.div>
        </div>

        {/* Flow lines SVG */}
        <svg className="absolute top-20 left-0 w-full h-24 pointer-events-none" viewBox="0 0 400 60">
          {paths.map((_, i) => {
            const startX = 200;
            const endX = 50 + (i * 100);
            return (
              <motion.path
                key={i}
                d={`M ${startX} 0 Q ${startX} 30, ${endX} 60`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeOpacity={0.2 + (i * 0.1)}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
            );
          })}
        </svg>

        {/* Destination nodes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-16">
          {paths.map((path, i) => (
            <motion.div
              key={path.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={cn(
                "rounded-xl p-4 text-center border",
                i === 3 ? "bg-primary/10 border-primary/30" : "bg-muted/30 border-border"
              )}
            >
              <div className={cn("text-2xl font-bold", path.color)}>{path.count}</div>
              <div className="text-xs text-muted-foreground mb-2">{path.percentage}%</div>
              <div className="text-sm text-foreground font-medium">{path.label}</div>
              {path.conversions > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  → {path.conversions.toLocaleString()} total refs
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Key insight */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center"
        >
          <p className="text-foreground">
            <span className="font-bold text-primary">7 people</span> (0.7%) drove <span className="font-bold text-primary">46%</span> of all conversions — that's the power law in action
          </p>
        </motion.div>
      </div>
    </Card>
  );
};

// ============================================
// INSIGHTS BENTO CARD - Unified 2x2 Grid
// ============================================
const InsightsBentoCard = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const insights = [
    {
      title: "Power Law Effect",
      value: "7 = 46%",
      subtitle: "0.7% of referrers drove nearly half of all conversions",
      shareText: "7 referrers drove 46% of our conversions. The power law is real in referral campaigns."
    },
    {
      title: "Conversion Rate",
      value: "28%",
      subtitle: "Visit-to-registration on referral traffic",
      shareText: "28% conversion rate on referral traffic. 3x the industry average for event landing pages."
    },
    {
      title: "Campaign Integrity",
      value: "96.6%",
      subtitle: "Valid referrals after fraud detection",
      shareText: "96.6% of referrals passed fraud detection. Clean data without blocking real people."
    },
    {
      title: "Channel Winner",
      value: "WhatsApp",
      subtitle: "Outperformed every other sharing channel",
      shareText: "WhatsApp outperformed every other channel in our referral campaign. Mobile-first sharing wins."
    }
  ];

  const handleShare = (index: number, platform: 'twitter' | 'linkedin' | 'copy') => {
    const insight = insights[index];
    const text = `${insight.shareText}\n\nFrom the HR Katalyst Referral Playbook by utm.one`;
    const url = 'https://utm.one/resources/playbooks/hr-katalyst-referral';
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(`${text}\n\n${url}`);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-card border-border overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-border/50">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Key Insights</h4>
          <span className="text-xs text-muted-foreground/50 font-mono">utm.one</span>
        </div>
        
        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={cn(
                "p-4 md:p-6 flex flex-col",
                // Add borders between cells
                index % 2 === 0 && "md:border-r border-border/50",
                index < 2 && "border-b border-border/50"
              )}
            >
              {/* Title */}
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
                {insight.title}
              </span>
              
              {/* Value */}
              <span className="text-xl md:text-2xl font-bold text-foreground mb-1">
                {insight.value}
              </span>
              
              {/* Subtitle */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-3">
                {insight.subtitle}
              </p>
              
              {/* Share buttons */}
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleShare(index, 'twitter')}
                  className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                >
                  𝕏
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleShare(index, 'linkedin')}
                  className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                >
                  in
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleShare(index, 'copy')}
                  className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                >
                  {copiedIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
// ============================================
// VISITOR FUNNEL (24K → 19K → 6.9K → 6.6K)
// ============================================
const VisitorFunnel = () => {
  const steps = [
    { label: "Total Link Clicks", value: "24,044", percentage: 100, color: "from-primary/40 to-primary/20" },
    { label: "Unique Sessions", value: "19,689", percentage: 82, color: "from-blue-500/40 to-blue-500/20" },
    { label: "Registrations", value: "6,903", percentage: 28.7, color: "from-green-500/40 to-green-500/20" },
    { label: "Valid Conversions", value: "6,665", percentage: 27.7, color: "from-emerald-500/40 to-emerald-500/20" },
  ];

  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <motion.div 
          key={step.label}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          <div 
            className={cn(
              "relative h-16 flex items-center justify-between px-6 border-x border-border/50",
              `bg-gradient-to-r ${step.color}`
            )}
            style={{ 
              width: `${Math.max(step.percentage, 30)}%`, 
              marginLeft: `${(100 - Math.max(step.percentage, 30)) / 2}%`,
              borderRadius: index === 0 ? '12px 12px 0 0' : index === steps.length - 1 ? '0 0 12px 12px' : '0'
            }}
          >
            <span className="text-foreground font-medium text-sm">{step.label}</span>
            <div className="text-right">
              <span className="text-foreground font-bold text-lg">{step.value}</span>
              {index > 0 && (
                <span className="text-muted-foreground text-xs block">{step.percentage.toFixed(1)}%</span>
              )}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="flex justify-center py-0.5">
              <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ============================================
// OLYMPIC PODIUM (Power Law Visualization)
// ============================================
const OlympicPodium = () => {
  const tiers = [
    { position: 2, label: "High Performers", count: 28, range: "10-99 refs", conversions: 909, percentage: 13, height: 120 },
    { position: 1, label: "Champions", count: 7, range: "100+ refs", conversions: 3173, percentage: 46, height: 180 },
    { position: 3, label: "Contributors", count: 304, range: "1-9 refs", conversions: 823, percentage: 12, height: 80 },
  ];

  const medals = ["🥈", "🥇", "🥉"];

  return (
    <div className="relative">
      {/* Pareto callout */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-sm px-4 py-1.5">
          🎯 0.7% of referrers drove 46% of results
        </Badge>
      </motion.div>

      <div className="flex items-end justify-center gap-3 h-72">
        {tiers.map((tier, index) => (
          <motion.div 
            key={tier.position}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="flex flex-col items-center"
          >
            {/* Stats above podium */}
            <div className="text-center mb-3">
              <div className="text-3xl font-bold text-foreground">{tier.count}</div>
              <div className="text-xs text-muted-foreground">{tier.range}</div>
              <div className="text-sm font-medium text-primary">{tier.conversions.toLocaleString()} refs</div>
            </div>
            
            {/* Podium block */}
            <div 
              className={cn(
                "w-24 md:w-28 rounded-t-xl flex flex-col items-center justify-start pt-4 relative overflow-hidden",
                tier.position === 1 ? "bg-gradient-to-b from-amber-400 to-amber-600" :
                tier.position === 2 ? "bg-gradient-to-b from-zinc-300 to-zinc-500" :
                "bg-gradient-to-b from-orange-400 to-orange-600"
              )}
              style={{ height: tier.height }}
            >
              <div className="text-3xl mb-1">{medals[index]}</div>
              <div className="text-white font-bold text-xl">{tier.percentage}%</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Label */}
            <div className="text-xs text-muted-foreground mt-2 text-center max-w-24 font-medium">{tier.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Inactive referrers note */}
      <div className="text-center mt-8 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
          ❄️ 643 referrers (65%) had 0 conversions — and that's okay
        </span>
      </div>
    </div>
  );
};

// ============================================
// REGISTRATION VELOCITY GRAPH
// ============================================
const VelocityGraph = () => {
  const weeks = [
    { week: "Week 1", daily: 150, label: "Steady start" },
    { week: "Week 2", daily: 200, label: "Momentum builds" },
    { week: "Week 3", daily: 250, label: "Word spreads" },
    { week: "Week 4", daily: 400, label: "FOMO kicks in" },
    { week: "Last 48h", daily: 800, label: "Final rush" },
  ];

  const maxDaily = Math.max(...weeks.map(w => w.daily));

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Registration Velocity Over 4 Weeks
      </h4>
      <div className="space-y-3">
        {weeks.map((week, index) => (
          <motion.div 
            key={week.week}
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "100%" }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-20 text-sm text-muted-foreground shrink-0">{week.week}</div>
            <div className="flex-1 h-8 bg-muted/30 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${(week.daily / maxDaily) * 100}%` }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className={cn(
                  "h-full rounded-full flex items-center justify-end pr-3",
                  index === weeks.length - 1 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500" 
                    : "bg-gradient-to-r from-primary/60 to-primary"
                )}
              >
                <span className="text-xs font-bold text-white">{week.daily}/day</span>
              </motion.div>
            </div>
            <div className="w-28 text-xs text-muted-foreground hidden md:block">{week.label}</div>
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Registrations accelerated 5x in the final 48 hours due to deadline urgency
      </p>
    </div>
  );
};

// ============================================
// COLLAPSIBLE CODE BLOCK
// ============================================
const CollapsibleCodeBlock = ({ 
  title, 
  code, 
  language = "typescript",
  defaultOpen = false,
  askLovable 
}: { 
  title: string; 
  code: string; 
  language?: string;
  defaultOpen?: boolean;
  askLovable?: string;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-t-lg border border-zinc-800 hover:bg-zinc-800 transition-colors">
          <div className="flex items-center gap-2 text-zinc-300">
            <Code className="w-4 h-4" />
            <span className="text-sm font-mono">{title}</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-zinc-400 transition-transform", isOpen && "rotate-180")} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="relative group">
          <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-b-lg overflow-x-auto text-sm font-mono border-x border-b border-zinc-800">
            <code>{code}</code>
          </pre>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        {askLovable && (
          <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Ask Lovable:</strong> "{askLovable}"</span>
            </p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

// ============================================
// BUILD PHASE CARD
// ============================================
const BuildPhaseCard = ({ 
  phase, 
  title, 
  description, 
  time, 
  icon: Icon, 
  code, 
  checklist,
  askLovable 
}: { 
  phase: number;
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  code: string;
  checklist: string[];
  askLovable: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="relative"
  >
    <Card className="p-6 bg-card border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="outline" className="text-xs">Phase {phase}</Badge>
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" /> {time}
            </Badge>
          </div>
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>
      </div>

      {/* Collapsible Code */}
      <div className="mb-4">
        <CollapsibleCodeBlock 
          title={`${title.toLowerCase().replace(/\s/g, '-')}.ts`}
          code={code}
          askLovable={askLovable}
        />
      </div>

      {/* Checklist */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-primary" />
          Phase {phase} Checklist
        </h4>
        <ul className="space-y-2">
          {checklist.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  </motion.div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function HRKatalystReferralPlaybook() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const metrics = [
    { icon: MousePointerClick, label: "Total Clicks", value: "24,044", scrollTo: "visitor-funnel" },
    { icon: Target, label: "Registrations", value: "6,900+", scrollTo: "visitor-funnel" },
    { icon: TrendingUp, label: "Conversion Rate", value: "28%", scrollTo: "visitor-funnel" },
    { icon: Users, label: "Referrers", value: "982", scrollTo: "referrer-funnel" },
    { icon: Trophy, label: "Champions", value: "7", subtext: "drove 46%", scrollTo: "power-law" },
    { icon: ShieldCheck, label: "Integrity", value: "96.6%", scrollTo: "integrity" },
  ];

  const preEventChecklist = [
    { id: "pre-1", text: "Define your north star metric (registrations, qualified leads, or attendees)" },
    { id: "pre-2", text: "Align UTMs, naming, and campaign structure before launch" },
    { id: "pre-3", text: "Set up unique referral code generation system" },
    { id: "pre-4", text: "Build landing page optimized for conversion (single CTA)" },
    { id: "pre-5", text: "Create thank you page that invites new registrants to become referrers" },
    { id: "pre-6", text: "Design real-time leaderboard with transparent rules" },
  ];

  const fraudProtectionChecklist = [
    { id: "fraud-1", text: "Block known disposable email domains" },
    { id: "fraud-2", text: "Block obvious fake name patterns" },
    { id: "fraud-3", text: "Rate limit conversions per IP and session" },
    { id: "fraud-4", text: "Run periodic manual audits on outlier patterns" },
    { id: "fraud-5", text: "Mark invalid entries instead of deleting (keep audit trail)" },
    { id: "fraud-6", text: "Publish integrity note so people know you care" },
  ];

  const faqItems: { question: string; answer: string; category?: FAQCategory }[] = [
    // Strategy
    {
      question: "How much budget do we need to run a referral campaign?",
      answer: "Start with $500-2,000 for prizes and merch. The beauty of referral campaigns is they're mostly organic. Your biggest costs are rewards for top performers. We spent under $3,000 total on prizes but drove 6,900+ registrations.",
      category: "strategy",
    },
    {
      question: "Can this work for B2B events, not just B2C?",
      answer: "Absolutely. B2B actually works better because professional networks are higher-trust. People refer colleagues they genuinely think will benefit. Our HR Katalyst audience was 100% B2B professionals.",
      category: "strategy",
    },
    {
      question: "What's the ideal campaign duration?",
      answer: "4 weeks is the sweet spot. Week 1 for launch momentum, weeks 2-3 for steady growth, week 4 for FOMO-driven final push. Shorter campaigns lack momentum; longer ones lose urgency.",
      category: "strategy",
    },
    {
      question: "Should we launch referrals at the same time as ticket sales?",
      answer: "No. Launch referrals 1-2 weeks after initial sales begin. This way, early registrants become your first referrers, and you've validated demand before investing in the referral infrastructure.",
      category: "strategy",
    },
    // Execution
    {
      question: "How do we prevent fake referrals and gaming?",
      answer: "Block disposable domains, rate limit conversions per IP, run manual audits on outliers, and mark (don't delete) suspicious entries. Keep an audit trail. Our campaign blocked 238 fraudulent submissions while maintaining 96.6% integrity rate.",
      category: "execution",
    },
    {
      question: "What rewards work best for referral campaigns?",
      answer: "Three tiers work best: headline prizes for top 3 (creates competition), guaranteed merch for mid-tier (creates motivation), and recognition badge for anyone with 1+ referral (creates participation). Recognition emails had our highest open rates.",
      category: "execution",
    },
    {
      question: "How many hours per week did it take to manage the campaign?",
      answer: "About 3-5 hours per week once set up. Most time went to: sending weekly digest emails, posting leaderboard updates, and reviewing flagged entries. The automation handles 90% of the work.",
      category: "execution",
    },
    // Metrics
    {
      question: "How important is real-time tracking?",
      answer: "Critical. When referrers can see their stats and leaderboard position update in real-time, engagement compounds. They share more because they can see immediate results. Delayed reporting kills momentum.",
      category: "metrics",
    },
    {
      question: "What conversion rate should we expect?",
      answer: "We achieved 28% visit-to-registration conversion on our referral landing page. The key: make it clear, not clever. One line about what it is, who it's for, what they get, the date, and a single CTA.",
      category: "metrics",
    },
    {
      question: "What were the top 3 channels that drove referrals?",
      answer: "WhatsApp (45%), LinkedIn (32%), Email (18%). WhatsApp dominated because it's where Indian professionals actually communicate. Design for mobile-first sharing, not desktop sharing buttons.",
      category: "metrics",
    },
    {
      question: "What was the ROI compared to paid ads?",
      answer: "Roughly 8x better cost-per-registration than our paid campaigns. Referral traffic converted at 28% vs 8% for paid. Plus, referral attendees had higher engagement at the actual event.",
      category: "metrics",
    },
    // Trust / Objection handling
    {
      question: "We tried referral marketing before and it didn't work. Why is this different?",
      answer: "Most referral campaigns fail because of broken tracking, not bad marketing. If you can't prove which referrer drove which registration, the whole system loses credibility. Clean attribution is the foundation.",
      category: "trust",
    },
    {
      question: "Our audience isn't tech-savvy. Will they actually share?",
      answer: "HR Katalyst's audience included HR managers in traditional industries. The key is making sharing effortless: pre-written messages, one-tap copy buttons, WhatsApp deep links. Remove friction, not assume capability.",
      category: "trust",
    },
    {
      question: "How do we convince leadership to invest in this?",
      answer: "Present it as a risk-free experiment. The infrastructure cost is minimal (build in 2-3 days), the prizes are only paid out on results, and you get attribution data regardless. Worst case: you learn what doesn't work.",
      category: "trust",
    },
    // Results
    {
      question: "How many referrers will actually refer?",
      answer: "Expect power law distribution. In our campaign, 7 people (0.7%) drove 46% of conversions. 65% of referrers brought 0 conversions. Design for your champions, not your averages.",
      category: "results",
    },
  ];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: "Playbooks", href: "/resources/playbooks" },
    { label: "HR Katalyst Referral", href: "" },
  ];

  const howToSteps = [
    { name: "Decide Success Metric", text: "Pick one north star: registrations, qualified leads, or actual attendees" },
    { name: "Clean Your Tracking", text: "Define UTM source, medium, campaign, content for this event" },
    { name: "Design the Referral Loop", text: "What does someone see after registration? How do they get their unique link?" },
    { name: "Build Minimal Product", text: "Unique code generator, landing page, thank you page, leaderboard" },
    { name: "Protect Yourself", text: "Block fake domains, sanity check IPs, have manual review mechanism" },
    { name: "Communicate Like Human", text: "Make emails feel personal, not transactional" },
  ];

  // Build phases for Part 2
  const buildPhases = [
    {
      phase: 1,
      title: "Database Setup",
      icon: Database,
      time: "~15 mins",
      description: "Create the core tables for referrers, visits, and conversions",
      askLovable: "Create a referral system with tables for referrers, visits, and conversions with RLS policies",
      code: `-- Create referrers table
CREATE TABLE public.referrers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  ref_code TEXT NOT NULL UNIQUE,
  total_visits INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create referral_visits table
CREATE TABLE public.referral_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ref_code TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create referral_conversions table  
CREATE TABLE public.referral_conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ref_code TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  is_valid BOOLEAN DEFAULT true,
  fraud_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);`,
      checklist: [
        "Create referrers table with ref_code unique constraint",
        "Create referral_visits table for click tracking",
        "Create referral_conversions table with is_valid flag",
        "Enable RLS on all tables",
        "Add indexes on ref_code columns",
      ],
    },
    {
      phase: 2,
      title: "Referral Code Generation",
      icon: Code,
      time: "~20 mins",
      description: "Generate unique, memorable referral codes for each participant",
      askLovable: "Create a GetLink page where users enter their name and email to get a unique referral code",
      code: `// Generate unique referral code
const generateRefCode = (name: string): string => {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .slice(0, 6);
  const randomSuffix = Math.random()
    .toString(36)
    .substring(2, 6);
  return \`\${cleanName}-\${randomSuffix}\`;
};

// Create referrer with unique code
const createReferrer = async (name: string, email: string) => {
  const ref_code = generateRefCode(name);
  
  const { data, error } = await supabaseFrom('referrers')
    .insert({ name, email, ref_code })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};`,
      checklist: [
        "Create ref code generator function",
        "Ensure codes are URL-safe and memorable",
        "Handle duplicate code collisions",
        "Create GetLink page with form validation",
        "Show instant referral link after signup",
      ],
    },
    {
      phase: 3,
      title: "Tracking Edge Functions",
      icon: Zap,
      time: "~30 mins",
      description: "Log every click and conversion with fraud protection",
      askLovable: "Create edge functions for track-visit and track-conversion with IP logging and fraud detection",
      code: `// supabase/functions/track-visit/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { ref_code } = await req.json()
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const ua = req.headers.get('user-agent') || 'unknown'

  // Log the visit
  await supabaseFrom('referral_visits').insert({
    ref_code, ip_address: ip, user_agent: ua,
  })

  // Increment referrer's visit count
  await supabase.rpc('increment_referrer_visits', { code: ref_code })

  return new Response(JSON.stringify({ success: true }))
})`,
      checklist: [
        "Create track-visit edge function",
        "Create track-conversion edge function",
        "Implement IP and user-agent logging",
        "Add fraud detection checks",
        "Increment referrer counts atomically",
      ],
    },
    {
      phase: 4,
      title: "External Website Integration",
      icon: Globe,
      time: "~20 mins",
      description: "Connect your landing page to the tracking system",
      askLovable: "Create a JavaScript snippet that reads ref parameter from URL and calls the track-visit function",
      code: `// Add this to your landing page
<script>
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  
  if (refCode) {
    // Store in cookie for conversion tracking
    document.cookie = \`ref_code=\${refCode};path=/;max-age=2592000\`;
    
    // Track the visit
    fetch('https://your-project.supabase.co/functions/v1/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref_code: refCode })
    });
  }
})();
</script>

// Add this to your thank-you page
<script>
(function() {
  const refCode = getCookie('ref_code');
  const email = /* get from form */;
  const name = /* get from form */;
  
  if (refCode) {
    fetch('https://your-project.supabase.co/functions/v1/track-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref_code: refCode, email, name })
    });
  }
})();
</script>`,
      checklist: [
        "Add tracking snippet to landing page",
        "Store ref code in cookie",
        "Add conversion tracking to thank you page",
        "Test the full flow end-to-end",
        "Verify data appears in database",
      ],
    },
    {
      phase: 5,
      title: "Leaderboard & Gamification",
      icon: Trophy,
      time: "~25 mins",
      description: "Create a real-time leaderboard that drives competition",
      askLovable: "Create a leaderboard page showing top referrers with ranks, badges, and real-time updates",
      code: `// Get leaderboard data
const getLeaderboard = async (limit = 25) => {
  const { data, error } = await supabaseFrom('referrers')
    .select('name, ref_code, total_conversions')
    .gt('total_conversions', 0)
    .order('total_conversions', { ascending: false })
    .limit(limit);
    
  if (error) throw error;
  
  return data.map((referrer, index) => ({
    ...referrer,
    rank: index + 1,
    tier: getTier(referrer.total_conversions),
    badge: getBadge(index + 1),
  }));
};

const getTier = (conversions: number) => {
  if (conversions >= 100) return 'champion';
  if (conversions >= 25) return 'gold';
  if (conversions >= 10) return 'silver';
  return 'starter';
};

const getBadge = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
};`,
      checklist: [
        "Create leaderboard query function",
        "Implement tier/badge logic",
        "Build LeaderboardPage component",
        "Add real-time subscriptions (optional)",
        "Show user's own rank prominently",
      ],
    },
    {
      phase: 6,
      title: "Admin Dashboard",
      icon: Settings,
      time: "~30 mins",
      description: "Monitor campaign health, review fraud, and manage rewards",
      askLovable: "Create an admin dashboard with KPI cards, fraud review queue, and export functionality",
      code: `// Admin KPI query
const getAdminStats = async () => {
  const [referrers, visits, conversions, fraud] = await Promise.all([
    supabaseFrom('referrers').select('id', { count: 'exact' }),
    supabaseFrom('referral_visits').select('id', { count: 'exact' }),
    supabaseFrom('referral_conversions').select('id', { count: 'exact' }),
    supabaseFrom('referral_conversions')
      .select('id', { count: 'exact' })
      .eq('is_valid', false),
  ]);

  return {
    totalReferrers: referrers.count || 0,
    totalVisits: visits.count || 0,
    totalConversions: conversions.count || 0,
    fraudBlocked: fraud.count || 0,
    integrityRate: conversions.count 
      ? (((conversions.count - (fraud.count || 0)) / conversions.count) * 100).toFixed(1)
      : '100',
  };
};`,
      checklist: [
        "Create AdminDashboard page",
        "Build KPI cards (visits, conversions, integrity)",
        "Add fraud review queue with approve/reject",
        "Implement export functionality (CSV)",
        "Add date range filters",
      ],
    },
    {
      phase: 7,
      title: "Email Automation",
      icon: Mail,
      time: "~25 mins",
      description: "Keep referrers engaged with welcome, milestone, and winner emails",
      askLovable: "Create email templates for welcome, milestone achievements, and weekly stats using Resend",
      code: `// Email templates
const emailTemplates = {
  welcome: (name: string, refCode: string) => ({
    subject: "You're officially a Katalyst insider 🎉",
    html: \`
      <h1>Welcome, \${name}!</h1>
      <p>Your unique referral link is ready:</p>
      <p><strong>https://example.com/?ref=\${refCode}</strong></p>
      <p>Share it and watch your leaderboard rank climb!</p>
    \`,
  }),
  
  milestone: (name: string, count: number) => ({
    subject: \`You just hit \${count} referrals! 🏆\`,
    html: \`
      <h1>Amazing work, \${name}!</h1>
      <p>You've brought \${count} people into the conversation.</p>
      <p>Keep going - the leaderboard is heating up!</p>
    \`,
  }),
  
  weeklyStats: (name: string, stats: any) => ({
    subject: "Your weekly referral update",
    html: \`
      <h1>Hey \${name}, here's your week:</h1>
      <ul>
        <li>New visits: \${stats.newVisits}</li>
        <li>New referrals: \${stats.newConversions}</li>
        <li>Current rank: #\${stats.rank}</li>
      </ul>
    \`,
  }),
};`,
      checklist: [
        "Set up Resend or similar email provider",
        "Create welcome email template",
        "Create milestone notification emails",
        "Create weekly stats digest",
        "Add winner announcement email",
      ],
    },
  ];

  // Import author image
  const authorAvatarUrl = new URL('@/assets/authors/rajnish-kumar.jpeg', import.meta.url).href;

  return (
    <>
      <SEO
        title="How to Run a Referral Campaign That Actually Works | utm.one"
        description="Learn how to run a referral campaign that actually works. Step-by-step marketer guide with real proof from HR Katalyst 5: 6,900+ registrations, 28% conversion rate. By Rajnish Kumar, Director of Marketing at Keka."
        canonical="https://utm.one/resources/playbooks/hr-katalyst-referral"
        ogType="article"
        publishedTime="2025-12-13"
        author="Rajnish Kumar"
        keywords={["referral marketing", "referral campaign", "community-led growth", "event marketing", "HR conference", "viral growth", "referral program", "growth marketing", "conversion optimization", "event registration"]}
      />
      <ArticleSchema
        headline="How to Run a Referral Campaign That Actually Works"
        description="Step-by-step marketer guide with real proof from HR Katalyst 5: 6,900+ registrations, 28% conversion rate"
        author="Rajnish Kumar"
        datePublished="2025-12-13"
        dateModified="2025-12-13"
      />
      <FAQSchema questions={faqItems} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href ? `https://utm.one${b.href}` : "" }))} />
      <HowToSchema
        name="How to Build a Referral Campaign for Events"
        description="14-step process for implementing community-led referral growth that drives 28% conversion"
        steps={howToSteps}
      />
      <SpeakableSchema headline="How to Run a Referral Campaign That Actually Works" summary="Step-by-step marketer guide with real proof: 6,900+ registrations, 28% conversion" cssSelectors={['.speakable-content']} />
      
      <GuideLayout
        title="how to run a referral campaign that actually works"
        subtitle="a step-by-step marketer guide (with real proof from HR Katalyst 5)"
        readTime="25 min read"
        publishedDate="December 13, 2025"
        lastUpdated="December 2025"
        breadcrumbs={breadcrumbs}
        author={{
          name: "Rajnish Kumar",
          role: "Director - Marketing",
          company: "Keka",
          avatarUrl: authorAvatarUrl
        }}
        tableOfContents={[
          { id: "results", title: "Results Dashboard", number: "01", subtitle: "6,900+ registrations, 28% conversion" },
          { id: "shareable-insights", title: "Key Insights", number: "02", subtitle: "shareable stats that prove the system works" },
          { id: "the-scene", title: "Part 1: The Story", number: "03", subtitle: "5 seasons of referral evolution" },
          { id: "part-2", title: "Part 2: Marketer's Playbook", number: "04", subtitle: "14 steps to launch your own campaign" },
          { id: "part-3", title: "Part 3: Build in Lovable", number: "05", subtitle: "7-phase technical implementation" },
          { id: "faq", title: "FAQ", number: "06", subtitle: "common questions answered" },
        ]}
      >
        {/* Hero Summary */}
        <ProgressiveReveal>
          <p className="text-xl text-foreground leading-relaxed mb-8 speakable-content">
            This is the behind-the-scenes story of how a nerdy HR conference turned into a 25K person movement. Real numbers, real architecture, and a step-by-step guide you can copy.
          </p>
        </ProgressiveReveal>

        {/* Hero Dashboard Screenshot */}
        <PlaybookScreenshot 
          src={adminDashboardHero} 
          alt="HR Katalyst Admin Dashboard showing 24,044 visits, 6,903 registrations, 28.7% conversion rate, and 235 active referrers" 
          caption="Real dashboard data from HR Katalyst Season 5"
        />

        {/* Clickable Metrics Dashboard */}
        <section className="mb-16" id="results">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  onClick={() => scrollToSection(metric.scrollTo)}
                  className="p-4 text-center bg-card border-border cursor-pointer hover:bg-muted/50 hover:scale-105 hover:shadow-lg transition-all duration-200 group"
                >
                  <metric.icon className="w-5 h-5 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <div className="text-xl md:text-2xl font-bold text-foreground">
                    <AnimatedCounter value={metric.value} />
                  </div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                  <ArrowRight className="w-3 h-3 mx-auto mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">Click any metric to jump to details</p>
        </section>

        {/* Shareable Insight Cards - Bento Layout */}
        <section className="mb-16" id="shareable-insights">
          <h3 className="text-xl font-display font-semibold text-foreground mb-4">Key Insights (Share These)</h3>
          <p className="text-muted-foreground text-sm mb-6">Click any share button to post on social media with utm.one branding</p>
          <InsightsBentoCard />
          
          {/* Inline CTA after Insights */}
          <PlaybookInlineCTA
            variant="action"
            headline="track your referral links the right way"
            subtext="join 500+ marketers who ditched spreadsheets for clean, consistent attribution"
            ctaText="join the waitlist"
          />
        </section>

        {/* ================================================ */}
        {/* PART 1: THE STORY */}
        {/* ================================================ */}
        <PartDivider 
          part={1} 
          title="The Story" 
          subtitle="What happened and what we learned"
          icon={BookOpen}
        />

        {/* 1.1 The Scene - Diversifying Distribution */}
        <section className="mb-16" id="the-scene">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Scene: Diversifying Distribution
          </h2>
          
          <ProgressiveReveal>
            <div className="bg-muted/30 border border-border rounded-xl p-6 mb-8 italic text-foreground">
              <p className="text-lg leading-relaxed mb-4">
                It started in a late-night Zoom room. But not the kind where you're staring at bad numbers. Our numbers were good — growing every season: 10K → 16K → 18K → 29K.
              </p>
              <p className="text-lg leading-relaxed">
                The problem wasn't growth. The problem was <strong>how</strong> we were growing. Too dependent on paid ads. Too reliant on partners. We wanted to unlock something different: community.
              </p>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              HR Katalyst 5 was also our most constrained season: less than 30 days to execute, running alongside a Salary Benchmark Report. We didn't have time for elaborate campaigns. We needed something simple that could compound on its own.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-8">
              The referral system wasn't born from crisis — it was born from opportunity. We asked a simple question: <em>"What if the people who love this event could bring others like them?"</em>
            </p>
          </ProgressiveReveal>

          {/* Season Progression Chart */}
          <ProgressiveReveal>
            <SeasonProgressionChart />
          </ProgressiveReveal>

          {/* Share Prompt after Season Progression */}
          <SharePrompt 
            text="referrals went from 3% to 28% in one campaign 🔥" 
            variant="highlight"
          />

          <ProgressiveReveal>
            <div className="grid md:grid-cols-3 gap-4 mt-8 mb-8">
              <Card className="p-5 bg-card border-border text-center">
                <div className="text-3xl font-bold text-foreground mb-1">5</div>
                <div className="text-sm text-muted-foreground">Seasons of growth</div>
              </Card>
              <Card className="p-5 bg-card border-border text-center">
                <div className="text-3xl font-bold text-foreground mb-1">&lt;30</div>
                <div className="text-sm text-muted-foreground">Days to execute Season 5</div>
              </Card>
              <Card className="p-5 bg-card border-border text-center">
                <div className="text-3xl font-bold text-foreground mb-1">New</div>
                <div className="text-sm text-muted-foreground">Channel unlocked: community</div>
              </Card>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg mb-6">
              <p className="text-lg text-foreground italic">
                Someone on that call asked the question that changed everything: "What is the <strong>system</strong> that will let HR Katalyst grow every year without killing the team?"
              </p>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              Not "what campaign should we run?" Not "which influencer should we partner with?" But: what <em>system</em>? That distinction mattered. Campaigns end. Systems compound.
            </p>
          </ProgressiveReveal>
        </section>

        {/* 1.2 The Bet - Expanded */}
        <section className="mb-16" id="the-bet">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Bet: Community as Primary Channel
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              We had obvious truths staring at us: people who attended once loved it, they told friends anyway, and our strongest registrations came from "my friend forwarded this." The signal was there. We'd just never designed for it.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="bg-primary/10 border border-primary/20 p-6 rounded-xl mb-8">
              <p className="text-xl text-foreground font-semibold text-center">
                The bet: Treat referrals as the <strong>primary</strong> growth channel, not a side campaign.
              </p>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              This wasn't "add a referral code to the thank-you page." This was: build referral infrastructure like you'd build a product. Dedicated team. Dedicated tracking. Dedicated loop.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <h3 className="text-xl font-semibold text-foreground mb-4">Three Non-Negotiable Rules</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="p-5 bg-card border-border">
                <div className="text-2xl mb-3">🎁</div>
                <h4 className="font-semibold text-foreground mb-2">No spammy hacks</h4>
                <p className="text-sm text-muted-foreground">Had to feel like a gift, not a pyramid scheme. HR people can smell bad incentives from a mile away. If it felt transactional, they'd ignore it.</p>
              </Card>
              <Card className="p-5 bg-card border-border">
                <div className="text-2xl mb-3">📊</div>
                <h4 className="font-semibold text-foreground mb-2">Trust the data</h4>
                <p className="text-sm text-muted-foreground">Clean tracking with UTMs, naming rules, governance. Everyone sees the same numbers. No "my spreadsheet says differently" conversations.</p>
              </Card>
              <Card className="p-5 bg-card border-border">
                <div className="text-2xl mb-3">🏗️</div>
                <h4 className="font-semibold text-foreground mb-2">Build like a product</h4>
                <p className="text-sm text-muted-foreground">Separate backlog. Clear architecture. Edge functions. Database tables. Dashboard. Everything had to work together as a system.</p>
              </Card>
            </div>
          </ProgressiveReveal>
        </section>

        {/* 1.3 Season 0: Clean Pipes First */}
        <section className="mb-16" id="season-zero">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Season 0: Cleaning the Pipes
          </h2>

          <ProgressiveReveal>
            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-xl mb-8">
              <p className="text-lg text-foreground">
                <strong>Before the first referral code was created, we spent a full sprint on tracking infrastructure.</strong> This felt slow at the time. It turned out to be the most important decision we made.
              </p>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              The problem: our existing data was a mess. Different teams used different UTM conventions. Some links had source but not medium. Campaign names changed mid-season. Nobody trusted the dashboards because everyone had their own version of truth.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              If your data is dirty, your referral program will be too. You won't know which referrer is performing. You won't catch fraud. You won't be able to reward winners confidently.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <h3 className="text-xl font-semibold text-foreground mb-4">What we fixed:</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Card className="p-4 bg-card border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-foreground">UTM Alignment</h4>
                    <p className="text-sm text-muted-foreground">Every link follows the same structure: source=referral, medium=referrer-name, campaign=season-x</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-card border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Naming Rules</h4>
                    <p className="text-sm text-muted-foreground">Lowercase, hyphens, no spaces, predictable patterns. If you can't automate the name, you can't trust the rollup.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-card border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Single Source of Truth</h4>
                    <p className="text-sm text-muted-foreground">One database. One dashboard. No parallel spreadsheets. If it's not in the system, it didn't happen.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-card border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Governance Layer</h4>
                    <p className="text-sm text-muted-foreground">Link creation locked to approved templates. No one could create rogue links with wrong parameters.</p>
                  </div>
                </div>
              </Card>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="bg-muted/30 border-l-4 border-muted-foreground p-6 rounded-r-lg">
              <p className="text-foreground italic">
                "We probably spent 40% of our pre-season time on tracking governance. It felt like we weren't building anything. But when Season 5 launched, we could see exactly which referrer drove which registration within seconds. That confidence changed everything."
              </p>
            </div>
          </ProgressiveReveal>
        </section>

        {/* 1.4 Designing the Loop: 4 Experiences */}
        <section className="mb-16" id="the-loop">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Designing the Loop: 4 Experiences
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-8">
              The referral system wasn't one thing—it was four connected experiences. Each one had to work perfectly, and together they had to create a loop that felt effortless.
            </p>
          </ProgressiveReveal>

          {/* Experience 1: GetLink */}
          <ProgressiveReveal>
            <Card className="p-6 bg-card border-border mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Experience 1: The GetLink Page</h3>
                  <p className="text-muted-foreground mb-4">Where existing fans become referrers</p>
                  <div className="bg-muted/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-foreground">
                      <strong>Design philosophy:</strong> Capture name, email, phone (for prize shipping). Generate unique referral link instantly. No approval process, no waiting. You sign up, you're in.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Name + Email + Phone</Badge>
                    <Badge variant="outline" className="text-xs">Instant ref_code generation</Badge>
                    <Badge variant="outline" className="text-xs">Copy-to-clipboard link</Badge>
                    <Badge variant="outline" className="text-xs">WhatsApp share button</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </ProgressiveReveal>

          <PlaybookScreenshot 
            src={heroLanding} 
            alt="HR Katalyst GetLink page where fans become referrers" 
            caption="The GetLink page where existing fans become referrers"
          />

          {/* Experience 2: Landing Page */}
          <ProgressiveReveal>
            <Card className="p-6 bg-card border-border mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Experience 2: The Landing Page</h3>
                  <p className="text-muted-foreground mb-4">Where referred visitors convert</p>
                  <div className="bg-muted/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-foreground">
                      <strong>Design philosophy:</strong> Make it clear, not clever. One line about what it is. One line about who it's for. What they get. The date. A single CTA. Nothing else.
                    </p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <strong>Result:</strong> 28% visit-to-registration conversion rate. Industry average for event landing pages is 8-12%.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </ProgressiveReveal>

          {/* Experience 3: Thank You Page */}
          <ProgressiveReveal>
            <Card className="p-6 bg-card border-border mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Experience 3: The Thank You Page</h3>
                  <p className="text-muted-foreground mb-4">Where registrants become referrers (the loop closes)</p>
                  <div className="bg-muted/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-foreground">
                      <strong>Design philosophy:</strong> The moment after registration is peak excitement. Don't waste it with "check your email." Ask them to invite friends <em>right now</em>.
                    </p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      <strong>Key insight:</strong> "You're registered! Want to bring your team?" converts 3x better than "Share with friends." Make it about <em>them</em>, not about <em>us</em>.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </ProgressiveReveal>

          {/* Experience 4: Leaderboard */}
          <ProgressiveReveal>
            <Card className="p-6 bg-card border-border mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-primary">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Experience 4: The Leaderboard</h3>
                  <p className="text-muted-foreground mb-4">Where competition drives behavior</p>
                  <div className="bg-muted/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-foreground">
                      <strong>Design philosophy:</strong> Real-time. Public. Transparent rules. When someone brings a friend, their rank updates within seconds. Delayed reporting kills momentum.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Real-time updates</Badge>
                    <Badge variant="outline" className="text-xs">Top 25 visible</Badge>
                    <Badge variant="outline" className="text-xs">Tier badges (Champion/Gold/Silver)</Badge>
                    <Badge variant="outline" className="text-xs">Personal rank always visible</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </ProgressiveReveal>

          <PlaybookScreenshot 
            src={leaderboardTable} 
            alt="HR Katalyst real-time leaderboard showing top referrers and prizes" 
            caption="Real-time leaderboard showing top referrers and tier badges"
          />

          <ProgressiveReveal>
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
              <p className="text-lg text-foreground">
                <strong>The loop:</strong> GetLink → Share → Landing Page → Register → Thank You Page → GetLink again. Every registrant was offered the chance to become a referrer. The flywheel fed itself.
              </p>
            </div>
          </ProgressiveReveal>
        </section>

        {/* 1.5 Protecting the Game - Expanded */}
        <section className="mb-16" id="integrity-story">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Protecting the Game: The 238 We Blocked
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              When you offer prizes for referrals, someone will try to game the system. We knew this going in. The question wasn't <em>if</em> we'd catch fraud—it was <em>how transparently</em> we'd handle it.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="p-5 bg-card border-border text-center">
                <div className="text-3xl font-bold text-red-500 mb-1">238</div>
                <div className="text-sm text-muted-foreground">Fraudulent submissions blocked</div>
              </Card>
              <Card className="p-5 bg-card border-border text-center">
                <div className="text-3xl font-bold text-green-500 mb-1">96.6%</div>
                <div className="text-sm text-muted-foreground">Integrity rate maintained</div>
              </Card>
              <Card className="p-5 bg-card border-border text-center">
                <div className="text-3xl font-bold text-amber-500 mb-1">0</div>
                <div className="text-sm text-muted-foreground">False positives (real people blocked)</div>
              </Card>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <h3 className="text-xl font-semibold text-foreground mb-4">What We Caught</h3>
            <div className="space-y-3 mb-8">
              <Card className="p-4 bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">🚫</div>
                  <div>
                    <span className="font-medium text-foreground">Disposable email domains</span>
                    <span className="text-muted-foreground text-sm ml-2">— tempmail, guerrilla, 10minutemail variants</span>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">🚫</div>
                  <div>
                    <span className="font-medium text-foreground">Fake name patterns</span>
                    <span className="text-muted-foreground text-sm ml-2">— "asdf asdf", single-letter names, keyboard mash</span>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">🚫</div>
                  <div>
                    <span className="font-medium text-foreground">IP rate limiting</span>
                    <span className="text-muted-foreground text-sm ml-2">— 15+ registrations from same IP within an hour</span>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">🚫</div>
                  <div>
                    <span className="font-medium text-foreground">Outlier pattern analysis</span>
                    <span className="text-muted-foreground text-sm ml-2">— manual review for anyone with 50+ conversions in 24 hours</span>
                  </div>
                </div>
              </Card>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-xl mb-8">
              <h4 className="font-semibold text-foreground mb-2">The "Marked, Not Deleted" Philosophy</h4>
              <p className="text-foreground">
                We never deleted suspicious entries. We marked them as <code className="bg-muted px-1 rounded">is_valid = false</code> with a <code className="bg-muted px-1 rounded">fraud_reason</code>. This meant: (1) the leaderboard stayed clean, (2) honest referrers never saw their competitors cheating, and (3) we had a full audit trail if anyone questioned results.
              </p>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              The 238 blocked submissions might seem small against 6,903 total registrations. But imagine if we hadn't caught them: a cheater on the leaderboard would have demoralized legitimate referrers, and prize integrity would have been compromised. Small numbers, big impact.
            </p>
          </ProgressiveReveal>
        </section>

        {/* 1.6 The Human Side */}
        <section className="mb-16" id="human-side">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Human Side: Recognition That Resonated
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              The mechanics worked. But what made people <em>feel</em> something? The recognition. Not the prizes—the acknowledgment.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <h3 className="text-xl font-semibold text-foreground mb-4">Emails People Actually Opened</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Card className="p-5 bg-card border-border">
                <div className="bg-muted/30 rounded-lg p-4 mb-3 font-mono text-sm">
                  <div className="text-muted-foreground mb-1">Subject:</div>
                  <div className="text-foreground">You just hit 25 referrals 🏆</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sent automatically when milestone reached. 78% open rate. Higher than any marketing email we'd ever sent.
                </p>
              </Card>
              <Card className="p-5 bg-card border-border">
                <div className="bg-muted/30 rounded-lg p-4 mb-3 font-mono text-sm">
                  <div className="text-muted-foreground mb-1">Subject:</div>
                  <div className="text-foreground">You're now #7 in the country</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sent when someone broke into top 10. The specificity—"#7," not "top 10"—made it personal.
                </p>
              </Card>
            </div>
          </ProgressiveReveal>

          <PlaybookScreenshot 
            src={emailCampaigns} 
            alt="Segmented email campaigns to different referrer groups" 
            caption="Automated email campaigns for milestone notifications"
          />

          <ProgressiveReveal>
            <h3 className="text-xl font-semibold text-foreground mb-4">What We Said (And Didn't Say)</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-green-500/10 p-5 rounded-xl border border-green-500/20">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3">✓ What worked</h4>
                <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                  <li>"You brought 7 HR peers into a better conversation this month."</li>
                  <li>"Because of you, someone in Pune just discovered Katalyst."</li>
                  <li>"Your leaderboard position: #12 (up from #18 yesterday)"</li>
                </ul>
              </div>
              <div className="bg-red-500/10 p-5 rounded-xl border border-red-500/20">
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3">✗ What we avoided</h4>
                <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                  <li>"Dear user, you have earned 70 points."</li>
                  <li>"Share more to unlock exclusive rewards!"</li>
                  <li>"Don't miss out on your chance to win!"</li>
                </ul>
              </div>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="bg-muted/30 border-l-4 border-muted-foreground p-6 rounded-r-lg mb-8">
              <p className="text-foreground italic mb-4">
                "When I got the email saying I was #7 in the country, I screenshotted it and sent it to my team. I've never done that with a marketing email in my life."
              </p>
              <p className="text-sm text-muted-foreground">— Referrer who brought 47 registrations</p>
            </div>
          </ProgressiveReveal>

          <PlaybookScreenshot 
            src={hallOfChampions} 
            alt="Hall of Champions celebrating top referrers" 
            caption="Hall of Champions celebrating top performers with tier badges"
          />

          <ProgressiveReveal>
            <h3 className="text-xl font-semibold text-foreground mb-4">The Reward Structure That Worked</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-5 bg-card border-border">
                <div className="text-2xl mb-3">🏆</div>
                <h4 className="font-semibold text-foreground mb-2">Top 3: Headline Prize</h4>
                <p className="text-sm text-muted-foreground">MacBook, AirPods, Amazon voucher. Created competition at the top.</p>
              </Card>
              <Card className="p-5 bg-card border-border">
                <div className="text-2xl mb-3">🎁</div>
                <h4 className="font-semibold text-foreground mb-2">Top 25: Guaranteed Merch</h4>
                <p className="text-sm text-muted-foreground">Branded hoodie + mug. Created motivation to stay in the race.</p>
              </Card>
              <Card className="p-5 bg-card border-border">
                <div className="text-2xl mb-3">⭐</div>
                <h4 className="font-semibold text-foreground mb-2">1+ Referral: Recognition Badge</h4>
                <p className="text-sm text-muted-foreground">Certificate + social shoutout. Created broad participation.</p>
              </Card>
            </div>
          </ProgressiveReveal>
        </section>

        {/* 1.7 The Referrer Sankey */}
        <section className="mb-16" id="referrer-funnel">
          <ProgressiveReveal>
            <ReferrerSankey />
          </ProgressiveReveal>
        </section>

        <section className="mb-16" id="visitor-funnel">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Visitor Conversion Funnel
          </h2>
          <p className="text-muted-foreground mb-6">From clicks to valid registrations — a 28% conversion rate:</p>
          <ProgressiveReveal>
            <div className="bg-card border border-border rounded-xl p-8">
              <VisitorFunnel />
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-foreground">82%</div>
                    <div className="text-muted-foreground">Unique vs Total</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-foreground">28.7%</div>
                    <div className="text-muted-foreground">Visit → Register</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-foreground">96.5%</div>
                    <div className="text-muted-foreground">Data Integrity</div>
                  </div>
                </div>
              </div>
            </div>
          </ProgressiveReveal>
        </section>

        {/* 1.8 Power Law with Podium */}
        <section className="mb-16" id="power-law">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Power Law: Champions Drive Results
          </h2>
          <ProgressiveReveal>
            <div className="bg-card border border-border rounded-xl p-8">
              <OlympicPodium />
            </div>
          </ProgressiveReveal>
          
          {/* Share Prompt after Power Law */}
          <SharePrompt 
            text="7 people drove 46% of all referral conversions. the power law is real." 
            variant="highlight"
          />

          <PlaybookScreenshot 
            src={campaignStats} 
            alt="Key campaign metrics at a glance" 
            caption="Key campaign metrics: clicks, sessions, registrations, and conversion rates"
          />
        </section>

        {/* 1.9 Registration Velocity */}
        <section className="mb-16" id="velocity">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Campaign Momentum Over Time
          </h2>
          <ProgressiveReveal>
            <VelocityGraph />
          </ProgressiveReveal>

          <PlaybookScreenshot 
            src={referralFlow} 
            alt="Complete referral flow visualization" 
            caption="Complete referral journey: from click to conversion"
          />
        </section>

        {/* 1.10 Key Lessons */}
        <section className="mb-16" id="lessons">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            5 Things That Actually Moved the Needle
          </h2>

          <ProgressiveReveal>
            <div className="space-y-4">
              {[
                { num: 1, title: "Treated referrals as a product", desc: "Separate backlog, clear architecture, edge functions, database tables, dashboard—all built intentionally. Not 'add a share button.'" },
                { num: 2, title: "Trusted power laws, not averages", desc: "A tiny percentage of referrers drove the majority of registrations. We designed for champions, not the average." },
                { num: 3, title: "Made the loop obvious", desc: "Register → get link → share → see your name move → get rewarded. No jargon. No hidden steps." },
                { num: 4, title: "Clean tracking from day one", desc: "UTMs, naming, governance meant everyone saw the same numbers. No 'my spreadsheet says differently' conversations." },
                { num: 5, title: "Respected the audience", desc: "No fake scarcity, no shady tactics. HR folks sniff out bad incentives. Every message felt like a gift, not a scheme." },
              ].map((item) => (
                <motion.div 
                  key={item.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  <Card className="p-4 bg-card border-border">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {item.num}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ProgressiveReveal>
        </section>

        {/* Inline CTA before Part 2 */}
        <PlaybookInlineCTA
          variant="subtle"
          headline="want results like this?"
          subtext="utm.one makes clean tracking effortless — the foundation for any successful referral campaign"
          ctaText="get early access"
        />

        {/* ================================================ */}
        {/* PART 2: THE MARKETER'S PLAYBOOK */}
        {/* ================================================ */}
        <div id="part-2">
          <PartDivider 
            part={2} 
            title="The Marketer's Playbook" 
            subtitle="Step-by-step guide any marketer can execute"
            icon={Target}
          />
        </div>

        {/* 2.0 Why This Playbook Exists */}
        <section className="mb-16" id="why-playbook">
          <ProgressiveReveal>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-display font-semibold text-foreground mb-4">
                Why This Playbook Exists
              </h2>
              <p className="text-lg text-foreground leading-relaxed mb-4">
                Most referral campaigns fail. Not because the idea is wrong, but because the execution is fuzzy.
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                When we ran HR Katalyst 5, we wanted something very simple:
              </p>
              <blockquote className="border-l-4 border-primary pl-6 py-2 mb-6 bg-background/50 rounded-r-lg">
                <p className="text-lg text-foreground italic">
                  "If an HR professional enjoys our event, they should have an easy way to invite other HRs. And every invitation should be tracked cleanly."
                </p>
              </blockquote>
              <p className="text-foreground mb-4">That one sentence turned into:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { value: "6,903", label: "Registrations" },
                  { value: "24,044", label: "Link Clicks" },
                  { value: "28%", label: "Conversion Rate" },
                  { value: "982", label: "Referrers" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card border border-border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                <p className="text-foreground font-medium">
                  🎯 The goal of this guide: Any marketer should be able to run the same referral engine for their event, product launch, or webinar — <strong>without asking engineering for help.</strong>
                </p>
              </div>
            </div>
          </ProgressiveReveal>

          <PlaybookScreenshot 
            src={adminDashboard} 
            alt="Admin dashboard tracking all referral activity" 
            caption="The admin dashboard tracking all referral activity in real-time"
          />
        </section>
        <section className="mb-16" id="referral-simple">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Referral System in Simple English
          </h2>
          <ProgressiveReveal>
            <p className="text-lg text-foreground mb-6">It's a simple loop:</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {[
                { num: 1, text: "Someone signs up" },
                { num: 2, text: "They get a unique link" },
                { num: 3, text: "They share it" },
                { num: 4, text: "People click → register" },
                { num: 5, text: "The referrer climbs a leaderboard" },
              ].map((step, i) => (
                <div key={step.num} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {step.num}
                    </div>
                    <span className="text-foreground text-sm font-medium">{step.text}</span>
                  </div>
                  {i < 4 && <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />}
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground">
              That's it. No complicated tech needed. You just need <strong className="text-foreground">clean tracking</strong> and <strong className="text-foreground">clear messaging</strong>.
            </p>
          </ProgressiveReveal>
        </section>

        {/* 2.2 The 8 Building Blocks */}
        <section className="mb-16" id="building-blocks">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-4">
            The 8 Building Blocks
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            If you understand these eight components, you can run ANY referral campaign.
          </p>

          <ProgressiveReveal>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { 
                  num: 1, 
                  title: "Get My Referral Link Page", 
                  desc: "Where a user enters their name/email and receives their unique referral link.", 
                  icon: Link2,
                  color: "from-blue-500/20 to-blue-500/10"
                },
                { 
                  num: 2, 
                  title: "Share Modal", 
                  desc: "A simple popup with pre-written messages for WhatsApp, LinkedIn, Email, X, and Copy link.", 
                  icon: Share2,
                  tip: "Make sharing effortless.",
                  color: "from-green-500/20 to-green-500/10"
                },
                { 
                  num: 3, 
                  title: "High-Converting Landing Page", 
                  desc: "Where referral traffic lands. It must convert at least 20–30%. (Our event page converted 28%.)", 
                  icon: LayoutDashboard,
                  color: "from-purple-500/20 to-purple-500/10"
                },
                { 
                  num: 4, 
                  title: "Thank-You Page That Extends the Loop", 
                  desc: "After registering: 'Do you want to invite others like you?' Super simple.", 
                  icon: CheckCircle2,
                  color: "from-amber-500/20 to-amber-500/10"
                },
                { 
                  num: 5, 
                  title: "Leaderboard", 
                  desc: "Shows top referrers, their ranks, and incentives. (We saw people obsessively refresh this.)", 
                  icon: Trophy,
                  color: "from-orange-500/20 to-orange-500/10"
                },
                { 
                  num: 6, 
                  title: "Rewards & Gamification", 
                  desc: "People don't share for prizes. They share for recognition, status, identity, and belonging.", 
                  icon: Gift,
                  tip: "Rewards simply push them harder.",
                  color: "from-pink-500/20 to-pink-500/10"
                },
                { 
                  num: 7, 
                  title: "Communication Engines", 
                  desc: "Email, WhatsApp, LinkedIn — everything that drives traffic.", 
                  icon: MessageSquare,
                  color: "from-cyan-500/20 to-cyan-500/10"
                },
                { 
                  num: 8, 
                  title: "Clean Tracking (utm.one philosophy)", 
                  desc: "Every click → every visit → every registration must be counted cleanly. This was our biggest advantage.", 
                  icon: Target,
                  color: "from-primary/20 to-primary/10"
                },
              ].map((block) => (
                <motion.div
                  key={block.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: block.num * 0.05 }}
                >
                  <Card className={cn("p-5 bg-gradient-to-br border-border h-full", block.color)}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-background/80 flex items-center justify-center">
                        <block.icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{block.num}</Badge>
                          <h4 className="font-semibold text-foreground">{block.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{block.desc}</p>
                        {block.tip && (
                          <p className="text-xs text-primary mt-2 font-medium">💡 {block.tip}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ProgressiveReveal>

          <PlaybookScreenshot 
            src={howItWorks} 
            alt="Simple 3-step process for referrers" 
            caption="Simple 3-step process: Sign up, Share, Win"
          />
        </section>
        <section className="mb-16" id="execution-steps">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-4">
            14 Steps: Day-by-Day Execution
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            This is the section a marketer will LOVE. Clear. Linear. Execute today.
          </p>

          <ProgressiveReveal>
            <div className="space-y-4">
              {[
                { step: 1, day: "Prep", time: "5 mins", title: "Define the referral goal", desc: 'Write a simple goal statement: "We want to drive X registrations in Y days with a referral conversion rate of Z%."', example: "For HR Katalyst: Goal → 5,000+ referrals, 25K traffic, 28% conversion rate." },
                { step: 2, day: "Prep", time: "10 mins", title: "Create your reward structure", desc: "Keep it simple. Give more status than stuff.", rewards: ["🥇 Rank 1 → Apple Watch", "🥈 Rank 2 → Amazon Echo", "🥉 Rank 3 → Smartwatch", "🎁 10+ referrals → Merch pack", "⭐ 1 referral → Inner Circle badge"] },
                { step: 3, day: "Prep", time: "1-2 hrs", title: "Prepare all communication assets", desc: "A referral campaign dies when marketers improvise daily. Before launch, prepare:", items: ["Email templates (launch, rank change, rewards reveal, final 72h)", "WhatsApp templates (group, personal, status)", "LinkedIn posts (launch, leaderboard, reward reveal, final hours)", "In-event CTAs (pinned messages, slides, host shoutouts)"] },
                { step: 4, day: "Prep", time: "QA", title: "Set up and validate referral pages", desc: "As a marketer, your job is to validate, not build. You check:", checklist: ["The 'Get Link' page works", "The link looks clean with UTMs", "The Share Modal works on mobile", "The landing page converts (above-fold CTA)", "The thank-you page triggers referral flow", "The leaderboard updates with test data"] },
                { step: 5, day: "Day 1", time: "Launch", title: "Launch the campaign (soft)", desc: "Start small. Launch only to internal team, past attendees, warm communities, friendly speakers.", expected: "150–300 early referrers, 500–800 visits" },
                { step: 6, day: "Day 2", time: "Launch", title: "Full public launch", desc: "Send major email to full audience. Publish LinkedIn post. Share in WhatsApp groups. Ask influencers/speakers to share. Post in HR communities.", expected: "1,000–2,000 visitors, 200–500 new registrations" },
                { step: 7, day: "Day 4", time: "Viral", title: "Drop the leaderboard on social", desc: "This is when the real viral loop begins. Post Top 10 names, total referrals, teaser text: 'Ranks shifting fast...'", trigger: "FOMO, Curiosity, Competitiveness → People rush to get their name on that board." },
                { step: 8, day: "Day 5", time: "Push", title: "Activate WhatsApp at scale", desc: "WhatsApp crushed every other channel. Post in HR groups, ask speakers to share, ask employees to share, ask referrers to post statuses.", result: "This step alone brought 1,000+ visits in 24 hours." },
                { step: 9, day: "Day 6", time: "Email", title: "Send Rank Change Email", desc: 'Subject: "You climbed the leaderboard 🔥" — This email alone drove the largest referral spike because it shows your rank, your referrals, and how many you need to win.', tip: "Taps into progress psychology." },
                { step: 10, day: "Day 7", time: "Reveal", title: "Reveal rewards visually", desc: "Post visuals of your prizes. We saw mid-tier referrers wake up, dormant referrers restart, and urgency increase." },
                { step: 11, day: "Day 8", time: "Network", title: "Activate speakers", desc: "Speakers share → new networks join → more potential referrers. Give them a copy-paste message." },
                { step: 12, day: "Day 9", time: "Push", title: "Mid-week push", desc: "Updated leaderboard, shoutouts, WhatsApp reminders, mini emails. Keep the loop alive." },
                { step: 13, day: "Day 11-13", time: "Sprint", title: "Final 72 hours sprint", desc: "This is where 40% of all referrals happen.", actions: ['Send final sprint email: "72 hours left ⏳ win these rewards"', "Publish leaderboard", "Add countdown timers", "Push WhatsApp statuses", "Ask speakers to repost"], result: "We got 1,000+ registrations in the last 3 days alone." },
                { step: 14, day: "Day 13", time: "Close", title: "Close the campaign", desc: "Freeze leaderboard, clean fraud, announce winners, send claim forms, thank referrers publicly.", tip: "Closing strong ensures next year people come back." },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                >
                  <Card className="p-5 bg-card border-border">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Step indicator */}
                      <div className="flex items-center gap-3 md:flex-col md:items-center md:w-24 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {item.step}
                        </div>
                        <div className="flex gap-2 md:flex-col md:items-center">
                          <Badge variant="secondary" className="text-xs">{item.day}</Badge>
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.time}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                        <p className="text-muted-foreground text-sm mb-3">{item.desc}</p>
                        
                        {item.example && (
                          <div className="bg-primary/5 p-3 rounded-lg text-sm text-foreground">
                            <strong>Example:</strong> {item.example}
                          </div>
                        )}
                        
                        {item.rewards && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.rewards.map((r, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{r}</Badge>
                            ))}
                          </div>
                        )}
                        
                        {item.items && (
                          <ul className="mt-2 space-y-1">
                            {item.items.map((it, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                {it}
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        {item.checklist && (
                          <div className="grid sm:grid-cols-2 gap-2 mt-2">
                            {item.checklist.map((c, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                {c}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {item.actions && (
                          <ul className="mt-2 space-y-1">
                            {item.actions.map((a, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Megaphone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        {item.expected && (
                          <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                            📈 Expected: {item.expected}
                          </div>
                        )}
                        
                        {item.result && (
                          <div className="mt-2 text-sm text-amber-600 dark:text-amber-400 font-medium">
                            🔥 Result: {item.result}
                          </div>
                        )}
                        
                        {item.trigger && (
                          <div className="mt-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                            ⚡ {item.trigger}
                          </div>
                        )}
                        
                        {item.tip && (
                          <div className="mt-2 text-sm text-primary font-medium">
                            💡 {item.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ProgressiveReveal>
          
          {/* Share Prompt after 14 Steps */}
          <SharePrompt 
            text="14-step referral playbook that drove 6,900 registrations. no fluff." 
            variant="highlight"
          />
        </section>

        {/* 2.4 The 3 Checklists */}
        <section className="mb-16" id="marketer-checklists">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-4">
            The Simple Marketer Checklist
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Copy this. Check it off. Run your campaign.
          </p>

          <ProgressiveReveal>
            <Tabs defaultValue="before" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="before" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Before Launch
                </TabsTrigger>
                <TabsTrigger value="during" className="flex items-center gap-2">
                  <Radio className="w-4 h-4" /> During Campaign
                </TabsTrigger>
                <TabsTrigger value="final" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Final Sprint
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="before">
                <Card className="p-6 bg-card border-border">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Before Launch Checklist
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Define rewards structure",
                      "Prepare all email templates",
                      "Prepare WhatsApp messages",
                      "Prepare LinkedIn posts",
                      "Validate get-link page works",
                      "Validate referral link behavior",
                      "Validate leaderboard updates",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-5 h-5 rounded border-2 border-muted-foreground/30 flex items-center justify-center">
                          <Check className="w-3 h-3 text-transparent" />
                        </div>
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="during">
                <Card className="p-6 bg-card border-border">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-primary" />
                    During Campaign Checklist
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Send Rank change emails",
                      "Post leaderboard updates",
                      "Activate WhatsApp groups",
                      "Activate speakers",
                      "Push daily reminders",
                      "Keep landing page converting",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-5 h-5 rounded border-2 border-muted-foreground/30 flex items-center justify-center">
                          <Check className="w-3 h-3 text-transparent" />
                        </div>
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="final">
                <Card className="p-6 bg-card border-border">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Final Sprint Checklist
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Countdown posts with timer",
                      'Send "72 hours left" email',
                      "WhatsApp blast to all groups",
                      "Freeze leaderboard",
                      "Clean fraud entries",
                      "Announce winners publicly",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <div className="w-5 h-5 rounded border-2 border-amber-500/50 flex items-center justify-center">
                          <Check className="w-3 h-3 text-transparent" />
                        </div>
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </ProgressiveReveal>
        </section>

        {/* 2.5 The Proof */}
        <section className="mb-16" id="proof">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-4">
            The Proof: HR Katalyst Results
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We ran this exact system. Here are the real numbers:
          </p>

          <ProgressiveReveal>
            <Card className="p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                  { value: "6,903", label: "Registrations" },
                  { value: "24,044", label: "Link Clicks" },
                  { value: "28%", label: "Conversion" },
                  { value: "982", label: "Referrers" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: "238", label: "Fraud Blocked" },
                  { value: "96.6%", label: "Integrity Rate" },
                  { value: "7", label: "Champions" },
                  { value: "55%", label: "From Top 7" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30 text-sm px-4 py-2">
                  ✓ This is not theory. This is battle-tested.
                </Badge>
              </div>
            </Card>
          </ProgressiveReveal>
        </section>

        {/* 2.6 The UTM One Hook */}
        <section className="mb-16" id="utm-hook">
          <ProgressiveReveal>
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                Why This Worked: Clean Tracking
              </h3>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-foreground leading-relaxed mb-4">
                  <strong>All of this worked because the tracking worked.</strong> Every referral link. Every click. Every registration. 100% tracked cleanly.
                </p>
                <p className="text-foreground leading-relaxed mb-4">
                  Most referral campaigns fail not because of poor marketing, but because of <strong>broken attribution</strong>.
                </p>
                <p className="text-foreground leading-relaxed mb-6">
                  HR Katalyst proved that when tracking is clean, growth is clean.
                </p>
                <div className="bg-background/50 p-6 rounded-xl border border-primary/20">
                  <p className="text-foreground font-medium mb-4">
                    That is exactly why we built <strong className="text-primary">utm.one</strong> — the simplest way for marketers to create clean, consistent, reliable tracking links that power viral loops like this.
                  </p>
                  <Button size="lg" className="gap-2">
                    Get Early Access <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </ProgressiveReveal>
        </section>

        {/* ================================================ */}
        {/* PART 3: BUILD IN LOVABLE */}
        {/* ================================================ */}
        <div id="part-3">
          <PartDivider 
            part={3} 
            title="Build in Lovable" 
            subtitle="Technical implementation for builders"
            icon={Wrench}
          />
        </div>

        {/* 2.1 Quick Start Checklist */}
        <section className="mb-16" id="copy-this">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            6-Step Quick Start
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Here's a stripped-down version you can run, even without engineers on standby.
          </p>

          <ActionChecklist
            items={preEventChecklist}
            storageKey="hr-katalyst-copy-this"
            title="Implementation Checklist"
          />

          <ProgressiveReveal>
            <div className="mt-8 bg-muted/30 border-l-4 border-primary p-6 rounded-r-lg">
              <h4 className="font-semibold text-foreground mb-2">Communication tip:</h4>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                  <p className="text-sm text-green-700 dark:text-green-300 italic">"You brought 7 HR peers into a better conversation this month."</p>
                  <span className="text-xs text-green-600 dark:text-green-400 mt-2 block">✓ Human</span>
                </div>
                <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                  <p className="text-sm text-red-700 dark:text-red-300 italic">"Dear user, you have earned 70 points. Click here."</p>
                  <span className="text-xs text-red-600 dark:text-red-400 mt-2 block">✗ Robotic</span>
                </div>
              </div>
            </div>
          </ProgressiveReveal>
        </section>

        {/* 2.2 Fraud Protection */}
        <section className="mb-16" id="integrity">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Protecting Campaign Integrity
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              We blocked 238 fraudulent submissions while maintaining 96.6% integrity rate. Here's how:
            </p>
          </ProgressiveReveal>

          <ActionChecklist
            items={fraudProtectionChecklist}
            storageKey="hr-katalyst-fraud-protection"
            title="Fraud Protection Checklist"
          />

          <ProgressiveReveal>
            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-xl mt-6">
              <p className="text-foreground">
                <strong>Pro tip:</strong> Instead of deleting bad entries, mark them as invalid and keep an audit trail. This lets you clean the leaderboard without angering honest referrers.
              </p>
            </div>
          </ProgressiveReveal>
        </section>

        {/* CTA Banner */}
        <CTABanner
          title="Build your referral system with utm.one"
          description="Clean tracking, real-time attribution, and governance tools to power your community-led growth"
          buttonText="Get Early Access"
          buttonHref="/early-access"
          variant="primary"
        />

        {/* 2.3 Build in Lovable - 7 Phases */}
        <section className="mb-16 mt-16" id="build-lovable">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Step-by-Step Guide</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How to Build This in Lovable
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete technical guide to build the entire referral system. Total time: ~3 hours with Lovable.
            </p>
          </div>

          <div className="space-y-6">
            {buildPhases.map((phase) => (
              <BuildPhaseCard key={phase.phase} {...phase} />
            ))}
          </div>

          <ProgressiveReveal>
            <div className="mt-8 bg-primary/10 border border-primary/20 p-6 rounded-xl">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Pro Tip: Build in Order
              </h4>
              <p className="text-foreground">
                Follow the phases sequentially. Each phase builds on the previous one. With Lovable, you can have a working referral system in 1-2 days.
              </p>
            </div>
          </ProgressiveReveal>
        </section>

        {/* Timeline */}
        <section className="mb-16" id="timeline">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Campaign Timeline
          </h2>
          <ProgressiveReveal>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              {[
                { week: "Week -2", title: "System Build", items: ["Set up database", "Create edge functions", "Build referrer signup page"] },
                { week: "Week -1", title: "Testing", items: ["Test end-to-end flow", "Verify fraud detection", "Soft launch to team"] },
                { week: "Week 1", title: "Launch", items: ["Announce to existing community", "150 referrers sign up", "First 1,000 conversions"] },
                { week: "Week 2-3", title: "Momentum", items: ["Weekly email digests", "Leaderboard updates", "Mid-campaign push"] },
                { week: "Week 4", title: "Final Push", items: ["48-hour countdown emails", "5x registration velocity", "Winner announcements"] },
              ].map((phase, index) => (
                <motion.div 
                  key={phase.week}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-10 pb-8 last:pb-0"
                >
                  <div className="absolute left-2.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  <div className="text-sm text-primary font-medium mb-1">{phase.week}</div>
                  <h4 className="font-semibold text-foreground mb-2">{phase.title}</h4>
                  <ul className="space-y-1">
                    {phase.items.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <Check className="w-3 h-3 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </ProgressiveReveal>
        </section>

        {/* Pre-FAQ Inline CTA */}
        <PlaybookInlineCTA
          variant="proof"
          headline="this exact playbook drove 6,900+ registrations"
          subtext="get the tools to replicate it — clean tracking, real-time attribution, and viral loop infrastructure"
          ctaText="get early access"
          badge="founding member badge"
          socialProof="2,847 marketers on the waitlist"
        />

        {/* FAQ */}
        <section className="mb-16" id="faq">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mb-6">
            15 questions from marketers who ran similar campaigns
          </p>
          <FAQAccordion items={faqItems} showCategories />
        </section>

        {/* Final CTA */}
        <section className="mb-16">
          <ProgressiveReveal>
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 text-center">
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                Ready to build your own referral engine?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                utm.one gives you clean tracking, real-time attribution, and the governance tools to power community-led growth.
              </p>
              <Button size="lg" className="gap-2">
                Get Early Access <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>
          </ProgressiveReveal>
        </section>
      </GuideLayout>
    </>
  );
}
