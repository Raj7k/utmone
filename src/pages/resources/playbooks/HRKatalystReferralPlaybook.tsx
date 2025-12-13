import { useState, useEffect } from "react";
import { GuideLayout } from "@/components/resources/GuideLayout";
import { ActionChecklist } from "@/components/resources/ActionChecklist";
import { CTABanner } from "@/components/resources/CTABanner";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { ProgressiveReveal } from "@/components/landing/ProgressiveReveal";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Users, MousePointerClick, Target, ShieldCheck, TrendingUp, Award, ChevronRight, ChevronDown, Database, Code, Zap, Globe, Trophy, Settings, Mail, Copy, Check, Clock, Sparkles, ArrowRight, BookOpen, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
const PartDivider = ({ part, title, subtitle, icon: Icon }: { part: number; title: string; subtitle: string; icon: React.ElementType }) => (
  <div className="relative py-16 my-16">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
    <div className="relative text-center">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <Badge variant="outline" className="text-lg px-4 py-1">Part {part}</Badge>
      </div>
      <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">{title}</h2>
      <p className="text-lg text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

// ============================================
// REFERRER FUNNEL (982 → 339 → 7 Champions)
// ============================================
const ReferrerFunnel = () => {
  const steps = [
    { label: "Signed Up as Referrers", value: "982", percentage: 100, description: "registered to participate" },
    { label: "Had 1+ Conversion", value: "339", percentage: 35, description: "successfully referred someone" },
    { label: "Champions (100+ refs)", value: "7", percentage: 0.7, description: "drove 46% of all conversions" },
  ];

  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <motion.div 
          key={step.label}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 }}
          className="relative"
        >
          <div 
            className="relative h-20 flex items-center justify-between px-6 border-x-2 border-primary/20"
            style={{ 
              width: `${Math.max(step.percentage, 15)}%`, 
              marginLeft: `${(100 - Math.max(step.percentage, 15)) / 2}%`,
              background: `linear-gradient(135deg, hsl(var(--primary) / ${0.3 - index * 0.08}), hsl(var(--primary) / ${0.15 - index * 0.04}))`,
              borderRadius: index === 0 ? '12px 12px 0 0' : index === steps.length - 1 ? '0 0 12px 12px' : '0'
            }}
          >
            <div>
              <span className="text-foreground font-medium text-sm md:text-base">{step.label}</span>
              <span className="text-muted-foreground text-xs block">{step.description}</span>
            </div>
            <div className="text-right">
              <span className="text-foreground font-bold text-xl md:text-2xl">{step.value}</span>
              {index > 0 && (
                <span className="text-muted-foreground text-xs block">{step.percentage}%</span>
              )}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="flex justify-center">
              <ChevronDown className="w-5 h-5 text-primary/40" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
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
    { icon: TrendingUp, label: "Conversion Rate", value: "28%", scrollTo: "visitor-funnel" },
    { icon: Users, label: "Referrers", value: "982", scrollTo: "referrer-funnel" },
    { icon: Trophy, label: "Champions", value: "7", subtext: "drove 46%", scrollTo: "power-law" },
    { icon: ShieldCheck, label: "Integrity", value: "96.6%", scrollTo: "integrity" },
    { icon: Target, label: "Growth", value: "10K→25K", scrollTo: "results" },
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

  const faqItems = [
    {
      question: "How do we prevent fake referrals and gaming?",
      answer: "Block disposable domains, rate limit conversions per IP, run manual audits on outliers, and mark (don't delete) suspicious entries. Keep an audit trail. Our campaign blocked 238 fraudulent submissions while maintaining 96.6% integrity rate."
    },
    {
      question: "What rewards work best for referral campaigns?",
      answer: "Three tiers work best: headline prizes for top 3 (creates competition), guaranteed merch for mid-tier (creates motivation), and recognition badge for anyone with 1+ referral (creates participation). Recognition emails had our highest open rates."
    },
    {
      question: "How important is real-time tracking?",
      answer: "Critical. When referrers can see their stats and leaderboard position update in real-time, engagement compounds. They share more because they can see immediate results. Delayed reporting kills momentum."
    },
    {
      question: "What conversion rate should we expect?",
      answer: "We achieved 28% visit-to-registration conversion on our referral landing page. The key: make it clear, not clever. One line about what it is, who it's for, what they get, the date, and a single CTA."
    },
    {
      question: "How many referrers will actually refer?",
      answer: "Expect power law distribution. In our campaign, 7 people (0.7%) drove 46% of conversions. 65% of referrers brought 0 conversions. Design for your champions, not your averages."
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
  
  const { data, error } = await supabase
    .from('referrers')
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
  await supabase.from('referral_visits').insert({
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
  const { data, error } = await supabase
    .from('referrers')
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
    supabase.from('referrers').select('id', { count: 'exact' }),
    supabase.from('referral_visits').select('id', { count: 'exact' }),
    supabase.from('referral_conversions').select('id', { count: 'exact' }),
    supabase
      .from('referral_conversions')
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

  return (
    <>
      <SEO
        title="HR Katalyst Referral Playbook — 10K to 25K in 5 Seasons | utm.one"
        description="The behind-the-scenes story of how a nerdy HR conference built a community-led growth engine. Real numbers, system architecture, and a step-by-step guide to copy."
        canonical="https://utm.one/resources/playbooks/hr-katalyst-referral"
        ogType="article"
        publishedTime="2025-12-01"
        keywords={["referral marketing", "community-led growth", "event marketing", "HR conference", "viral growth", "referral campaign"]}
      />
      <ArticleSchema
        headline="HR Katalyst Referral Playbook: From 10K to 25K Registrations"
        description="How we went from 10K to 25K registrations in 5 seasons using community-led referral growth"
        author="utm.one"
        datePublished="2025-12-01"
        dateModified="2025-12-13"
      />
      <FAQSchema questions={faqItems} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href ? `https://utm.one${b.href}` : "" }))} />
      <HowToSchema
        name="How to Build a Referral Campaign for Events"
        description="6-step process for implementing community-led referral growth"
        steps={howToSteps}
      />
      <SpeakableSchema headline="HR Katalyst Referral Playbook" summary="Community-led growth from 10K to 25K" cssSelectors={['.speakable-content']} />
      
      <GuideLayout
        title="The HR Katalyst Referral Playbook"
        subtitle="How we went from 10K to 25K registrations in 5 seasons"
        readTime="25 min read"
        lastUpdated="December 2025"
        breadcrumbs={breadcrumbs}
        relatedResources={[
          { title: "Event-Led Growth Playbook", href: "/resources/playbooks/event-led-growth-playbook", description: "Campaign tracking for events" },
          { title: "UTM Governance Playbook", href: "/resources/playbooks/utm-governance-playbook", description: "Enforce UTM standards" },
          { title: "Naming Convention Playbook", href: "/resources/playbooks/naming-convention-playbook", description: "Taxonomy design" },
        ]}
      >
        {/* Hero Summary */}
        <ProgressiveReveal>
          <p className="text-xl text-foreground leading-relaxed mb-8 speakable-content">
            This is the behind-the-scenes story of how a nerdy HR conference turned into a 25K person movement. Real numbers, real architecture, and a step-by-step guide you can copy.
          </p>
        </ProgressiveReveal>

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

        {/* ================================================ */}
        {/* PART 1: THE STORY */}
        {/* ================================================ */}
        <PartDivider 
          part={1} 
          title="The Story" 
          subtitle="What happened and what we learned"
          icon={BookOpen}
        />

        {/* 1.1 The Scene */}
        <section className="mb-16" id="the-scene">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Scene: A Ceiling We Couldn't Break
          </h2>
          
          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Five seasons back, HR Katalyst was already "successful": ~10,000 registrations, packed chat window, decent social buzz. From the outside it looked big. From the inside it felt… capped.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Every season the graphs looked the same: organic list + partners gave a spike, paid ads did their job, then registrations flattened out long before we ran out of time or content. More effort, same shape.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg mb-6">
              <p className="text-lg text-foreground italic">
                "What is the <strong>system</strong> that will let HR Katalyst grow every year without killing the team?"
              </p>
            </div>
          </ProgressiveReveal>
        </section>

        {/* 1.2 The Bet */}
        <section className="mb-16" id="the-bet">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Bet: Community as Primary Channel
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              We had obvious truths staring at us: people who attended once loved it, they told friends anyway, and our strongest registrations came from "my friend forwarded this."
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="bg-primary/10 border border-primary/20 p-6 rounded-xl mb-6">
              <p className="text-xl text-foreground font-semibold text-center">
                Treat referrals as the <strong>primary</strong> growth channel, not a side campaign.
              </p>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4 bg-card border-border">
                <h4 className="font-semibold text-foreground mb-2">No spammy hacks</h4>
                <p className="text-sm text-muted-foreground">Had to feel like a gift, not a pyramid scheme.</p>
              </Card>
              <Card className="p-4 bg-card border-border">
                <h4 className="font-semibold text-foreground mb-2">Trust the data</h4>
                <p className="text-sm text-muted-foreground">Clean tracking with UTMs, naming rules, governance.</p>
              </Card>
              <Card className="p-4 bg-card border-border">
                <h4 className="font-semibold text-foreground mb-2">Build like a product</h4>
                <p className="text-sm text-muted-foreground">Everything had to work together as a system.</p>
              </Card>
            </div>
          </ProgressiveReveal>
        </section>

        {/* 1.3 The Dual Funnels */}
        <section className="mb-16" id="referrer-funnel">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Referrer Journey
          </h2>
          <p className="text-muted-foreground mb-6">982 people signed up as referrers. Here's what happened to them:</p>
          <ProgressiveReveal>
            <div className="bg-card border border-border rounded-xl p-8">
              <ReferrerFunnel />
            </div>
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

        {/* 1.4 Power Law with Podium */}
        <section className="mb-16" id="power-law">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Power Law: Champions Drive Results
          </h2>
          <ProgressiveReveal>
            <div className="bg-card border border-border rounded-xl p-8">
              <OlympicPodium />
            </div>
          </ProgressiveReveal>
        </section>

        {/* 1.5 Registration Velocity */}
        <section className="mb-16" id="velocity">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Campaign Momentum Over Time
          </h2>
          <ProgressiveReveal>
            <VelocityGraph />
          </ProgressiveReveal>
        </section>

        {/* 1.6 Key Lessons */}
        <section className="mb-16" id="lessons">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            5 Things That Actually Moved the Needle
          </h2>

          <ProgressiveReveal>
            <div className="space-y-4">
              {[
                { num: 1, title: "Treated referrals as a product", desc: "Separate backlog, clear architecture, edge functions, database tables, dashboard—all built intentionally." },
                { num: 2, title: "Trusted power laws, not averages", desc: "A tiny percentage of referrers drove the majority of registrations. We designed for champions." },
                { num: 3, title: "Made the loop obvious", desc: "Register → get link → share → see your name move → get rewarded. No jargon." },
                { num: 4, title: "Clean tracking from day one", desc: "UTMs, naming, governance meant everyone saw the same numbers." },
                { num: 5, title: "Respected the audience", desc: "No fake scarcity, no shady tactics. HR folks sniff out bad incentives." },
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

        {/* ================================================ */}
        {/* PART 2: THE PLAYBOOK */}
        {/* ================================================ */}
        <PartDivider 
          part={2} 
          title="The Playbook" 
          subtitle="How to build this yourself"
          icon={Wrench}
        />

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

        {/* FAQ */}
        <section className="mb-16" id="faq">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={faqItems} />
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
