import { useState, useEffect } from "react";
import { GuideLayout } from "@/components/resources/GuideLayout";
import { PlaybookSteps } from "@/components/resources/PlaybookSteps";
import { ActionChecklist } from "@/components/resources/ActionChecklist";
import { CaseStudyCard } from "@/components/resources/CaseStudyCard";
import { CTABanner } from "@/components/resources/CTABanner";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { ProgressiveReveal } from "@/components/landing/ProgressiveReveal";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MousePointerClick, Target, ShieldCheck, TrendingUp, Award, ChevronRight, Database, Code, Zap, Globe, Trophy, Settings, Mail, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Sticky Table of Contents Component
const TableOfContents = ({ activeSection }: { activeSection: string }) => {
  const sections = [
    { id: "metrics", label: "Results Dashboard" },
    { id: "funnel", label: "The Funnel" },
    { id: "step-1", label: "1. The Scene" },
    { id: "step-2", label: "2. The Bet" },
    { id: "step-3", label: "3. The Numbers" },
    { id: "power-law", label: "Power Law" },
    { id: "step-4", label: "4. Clean Pipes" },
    { id: "step-5", label: "5. Design Loop" },
    { id: "architecture", label: "Architecture" },
    { id: "step-6", label: "6. Integrity" },
    { id: "step-7", label: "7. Human Side" },
    { id: "step-8", label: "8. What Worked" },
    { id: "step-9", label: "9. Copy This" },
    { id: "build-lovable", label: "Build in Lovable" },
    { id: "timeline", label: "Timeline" },
    { id: "step-10", label: "10. Close Loop" },
    { id: "faq", label: "FAQ" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <nav className="hidden xl:block sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-foreground mb-4">On This Page</h4>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "block w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
              activeSection === section.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

// Proportional Funnel Component
const ReferralsFunnel = () => {
  const funnelSteps = [
    { label: "Total Link Clicks", value: "24,044", percentage: 100, color: "bg-primary" },
    { label: "Unique Sessions", value: "19,689", percentage: 82, color: "bg-blue-500" },
    { label: "Registrations", value: "6,903", percentage: 28.7, color: "bg-green-500" },
    { label: "Valid Conversions", value: "6,665", percentage: 27.7, color: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-3">
      {funnelSteps.map((step, index) => (
        <div key={step.label} className="relative">
          <div 
            className={cn(
              "relative h-16 rounded-lg flex items-center justify-between px-6 transition-all",
              step.color
            )}
            style={{ width: `${Math.max(step.percentage, 30)}%`, marginLeft: `${(100 - Math.max(step.percentage, 30)) / 2}%` }}
          >
            <span className="text-white font-semibold text-sm">{step.label}</span>
            <div className="text-right">
              <span className="text-white font-bold text-lg">{step.value}</span>
              {index > 0 && (
                <span className="text-white/80 text-xs block">{step.percentage.toFixed(1)}%</span>
              )}
            </div>
          </div>
          {index < funnelSteps.length - 1 && (
            <div className="flex justify-center py-1">
              <ChevronRight className="w-5 h-5 text-muted-foreground rotate-90" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Olympic Podium Component
const PowerLawPodium = () => {
  const tiers = [
    { position: 2, label: "High Performers", count: 28, range: "10-99 refs", conversions: 909, percentage: 13, color: "bg-zinc-400" },
    { position: 1, label: "Champions", count: 7, range: "100+ refs", conversions: 3173, percentage: 46, color: "bg-amber-500" },
    { position: 3, label: "Contributors", count: 304, range: "1-9 refs", conversions: 823, percentage: 12, color: "bg-orange-600" },
  ];

  return (
    <div className="flex items-end justify-center gap-2 h-64">
      {tiers.map((tier) => (
        <div key={tier.position} className="flex flex-col items-center">
          <div className="text-center mb-2">
            <div className="text-2xl font-bold text-foreground">{tier.count}</div>
            <div className="text-xs text-muted-foreground">{tier.range}</div>
          </div>
          <div 
            className={cn(
              "w-24 rounded-t-lg flex flex-col items-center justify-end pb-4",
              tier.color
            )}
            style={{ height: tier.position === 1 ? "160px" : tier.position === 2 ? "120px" : "80px" }}
          >
            <div className="text-white font-bold text-lg">{tier.position}</div>
            <div className="text-white/90 text-xs text-center px-2">{tier.percentage}%</div>
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center max-w-24">{tier.label}</div>
        </div>
      ))}
    </div>
  );
};

// Code Block Component
const CodeBlock = ({ code, language = "typescript" }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
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
  );
};

export default function HRKatalystReferralPlaybook() {
  const [activeSection, setActiveSection] = useState("metrics");

  // Track active section for TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const steps = [
    { number: 1, title: "The Scene" },
    { number: 2, title: "The Bet" },
    { number: 3, title: "The Numbers" },
    { number: 4, title: "Clean Pipes" },
    { number: 5, title: "Design Loop" },
    { number: 6, title: "Integrity" },
    { number: 7, title: "Human Side" },
    { number: 8, title: "What Worked" },
    { number: 9, title: "Copy This" },
    { number: 10, title: "Close Loop" },
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

  const rewardsChecklist = [
    { id: "reward-1", text: "Design headline prizes for top 3 referrers" },
    { id: "reward-2", text: "Set guaranteed merch threshold for mid-tier" },
    { id: "reward-3", text: "Create special badge for anyone with 1+ referral" },
    { id: "reward-4", text: "Send personalized thank you emails to top referrers" },
    { id: "reward-5", text: "Plan social shoutouts and event recognition" },
    { id: "reward-6", text: "Promise and deliver 'inside track' to future experiments" },
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
    { name: "Clean Your Tracking", text: "Define UTM source, medium, campaign, content for this event. Make every referral link follow these rules" },
    { name: "Design the Referral Loop", text: "What does someone see after registration? How do they get their unique link? What are rewards at 1, 5, 10, 25?" },
    { name: "Build Minimal Product", text: "Unique code generator, high-converting landing page, thank you page that logs referrals, simple leaderboard" },
    { name: "Protect Yourself", text: "Block fake domains, sanity check IPs, have manual review mechanism, publish integrity note" },
    { name: "Communicate Like Human", text: "Make emails feel personal: 'you brought 7 HR peers into a better conversation' not 'you earned 70 points'" },
  ];

  const metrics = [
    { icon: MousePointerClick, label: "Total Clicks", value: "24,044", scrollTo: "funnel" },
    { icon: Users, label: "Unique Sessions", value: "19,689", scrollTo: "funnel" },
    { icon: Target, label: "Conversions", value: "6,903", scrollTo: "funnel" },
    { icon: TrendingUp, label: "Conversion Rate", value: "28%", scrollTo: "step-5" },
    { icon: Award, label: "Active Referrers", value: "982", scrollTo: "power-law" },
    { icon: ShieldCheck, label: "Integrity Rate", value: "96.6%", scrollTo: "step-6" },
  ];

  // Lovable Build Phases
  const buildPhases = [
    {
      phase: 1,
      title: "Database Setup",
      icon: Database,
      description: "Create the core tables for referrers, visits, and conversions",
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
  utm_source TEXT,
  utm_medium TEXT,
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
);

-- Enable RLS
ALTER TABLE public.referrers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;`,
      checklist: [
        "Create referrers table with ref_code unique constraint",
        "Create referral_visits table for click tracking",
        "Create referral_conversions table with is_valid flag",
        "Enable RLS on all tables",
        "Add indexes on ref_code columns for fast lookups",
      ],
    },
    {
      phase: 2,
      title: "Referral Code Generation",
      icon: Code,
      description: "Generate unique, memorable referral codes for each participant",
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
const createReferrer = async (name: string, email: string, phone?: string) => {
  const ref_code = generateRefCode(name);
  
  const { data, error } = await supabase
    .from('referrers')
    .insert({ name, email, phone, ref_code })
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
      description: "Log every click and conversion with fraud protection",
      code: `// supabase/functions/track-visit/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { ref_code, utm_source, utm_medium } = await req.json()
  const ip_address = req.headers.get('x-forwarded-for') || 'unknown'
  const user_agent = req.headers.get('user-agent') || 'unknown'

  // Log the visit
  await supabase.from('referral_visits').insert({
    ref_code,
    ip_address,
    user_agent,
    utm_source,
    utm_medium,
  })

  // Increment referrer's visit count
  await supabase.rpc('increment_referrer_visits', { code: ref_code })

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
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
      description: "Connect your landing page and thank you page to the tracking system",
      code: `// Snippet for external landing page
<script>
(function() {
  // Get ref_code from URL
  const params = new URLSearchParams(window.location.search);
  const ref_code = params.get('ref');
  
  if (ref_code) {
    // Store in cookie for conversion tracking
    document.cookie = \`ref_code=\${ref_code};path=/;max-age=2592000\`;
    
    // Track the visit
    fetch('https://YOUR_PROJECT.supabase.co/functions/v1/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ref_code,
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
      }),
    });
  }
})();
</script>

// Snippet for thank you page (after registration)
<script>
(function() {
  const getCookie = (name) => {
    const value = \`; \${document.cookie}\`;
    const parts = value.split(\`; \${name}=\`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  
  const ref_code = getCookie('ref_code');
  if (ref_code) {
    fetch('https://YOUR_PROJECT.supabase.co/functions/v1/track-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ref_code,
        email: 'REGISTRANT_EMAIL', // Replace with actual
        name: 'REGISTRANT_NAME',   // Replace with actual
      }),
    });
  }
})();
</script>`,
      checklist: [
        "Add landing page snippet to track visits",
        "Store ref_code in cookie (30 day expiry)",
        "Add thank you page snippet for conversions",
        "Pass UTM parameters through the flow",
        "Test end-to-end tracking",
      ],
    },
    {
      phase: 5,
      title: "Leaderboard & Gamification",
      icon: Trophy,
      description: "Build a real-time leaderboard with ranks and badges",
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
  if (conversions >= 5) return 'bronze';
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
      description: "Monitor campaign health, review fraud, and manage rewards",
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
};

// Mark conversion as fraud
const markAsFraud = async (conversionId: string, reason: string) => {
  await supabase
    .from('referral_conversions')
    .update({ is_valid: false, fraud_reason: reason })
    .eq('id', conversionId);
    
  // Decrement referrer's count
  // ... (atomic decrement)
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
      description: "Keep referrers engaged with welcome, milestone, and winner emails",
      code: `// supabase/functions/send-referrer-email/index.ts
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const emailTemplates = {
  welcome: (name: string, refCode: string) => ({
    subject: "You're officially a Katalyst insider 🎉",
    html: \`
      <h1>Welcome, \${name}!</h1>
      <p>Your unique referral link is ready:</p>
      <p><strong>https://hrkatalyst.com/hr-katalyst-5?ref=\${refCode}</strong></p>
      <p>Share it and watch your leaderboard rank climb!</p>
    \`,
  }),
  
  milestone: (name: string, count: number) => ({
    subject: \`You just hit \${count} referrals! 🏆\`,
    html: \`
      <h1>Amazing work, \${name}!</h1>
      <p>You've brought \${count} HR peers into the conversation.</p>
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
};

// Trigger on milestone hits (1, 5, 10, 25, 50, 100)
const MILESTONES = [1, 5, 10, 25, 50, 100];`,
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
        {/* Summary */}
        <ProgressiveReveal>
          <p className="text-xl text-foreground leading-relaxed mb-8 speakable-content">
            This is the behind-the-scenes story of how a nerdy HR conference turned into a 25K person movement. Real numbers, real architecture, and a step-by-step guide you can copy.
          </p>
        </ProgressiveReveal>

        {/* Step Tracker - Clickable */}
        <div className="mb-16">
          <PlaybookSteps steps={steps} currentStep={1} className="mb-4" />
          <p className="text-xs text-muted-foreground text-center">Click any step to jump to that section</p>
        </div>

        {/* Metrics Dashboard - Clickable Cards */}
        <section className="mb-20" id="metrics">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Campaign Results at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map((metric) => (
              <Card 
                key={metric.label} 
                onClick={() => scrollToSection(metric.scrollTo)}
                className="p-4 text-center bg-card border-border cursor-pointer hover:bg-muted/50 hover:scale-105 hover:shadow-lg transition-all duration-200 group"
              >
                <metric.icon className="w-6 h-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
                <ChevronRight className="w-4 h-4 mx-auto mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">Click any metric to jump to related section</p>
        </section>

        {/* Referrals Funnel - Fixed with proportional widths */}
        <section className="mb-20" id="funnel">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Referrals Funnel
          </h2>
          <ProgressiveReveal>
            <div className="bg-card border border-border rounded-xl p-8">
              <p className="text-muted-foreground mb-6 text-center">
                From 24K clicks to 6.6K valid conversions — 28% conversion rate
              </p>
              <ReferralsFunnel />
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

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* Step 1: The Scene */}
        <section className="mb-20" id="step-1">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            1. The Scene: A Zoom Room, a Ceiling, and a Ceiling
          </h2>
          
          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Five seasons back, HR Katalyst was already "successful": ~10,000 registrations, packed chat window, decent social buzz. From the outside it looked big. From the inside it felt… capped.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Every season the graphs looked the same: organic list + partners gave a spike, paid ads did their job, then registrations flattened out long before we ran out of time or content. We were working harder, adding more speakers, more formats, more creative, yet the curves stayed similar. More effort, same shape.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="bg-muted/30 border-l-4 border-primary p-6 rounded-r-lg mb-6">
              <p className="text-lg text-foreground italic">
                At some point the question shifted from "how do we get more registrations" to "what is the <strong>system</strong> that will let HR Katalyst grow every year without killing the team?"
              </p>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              That question is how this playbook was born.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* Step 2: The Bet */}
        <section className="mb-20" id="step-2">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            2. The Bet: What If Community Was the Channel
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Before this season, HR Katalyst had a few obvious truths:
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <ul className="list-disc list-inside text-lg text-foreground space-y-2 mb-6">
              <li>People who attended once, loved it</li>
              <li>They told friends anyway, even with zero incentives</li>
              <li>Every season, our strongest registrations came from "my friend forwarded this"</li>
            </ul>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              We were already sitting on a community-led growth engine, we just had not built the rails. So the bet for season 5 was simple:
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
            <p className="text-lg text-foreground leading-relaxed mb-4">
              And to make that work, we made three non-negotiable rules:
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="space-y-4">
              <Card className="p-4 bg-card border-border">
                <h3 className="font-semibold text-foreground mb-2">1. No spammy growth hacks</h3>
                <p className="text-muted-foreground">This had to feel like a gift, not a pyramid scheme.</p>
              </Card>
              <Card className="p-4 bg-card border-border">
                <h3 className="font-semibold text-foreground mb-2">2. Trust in the data</h3>
                <p className="text-muted-foreground">If we could not track it cleanly, we would not scale it. We used the same clean tracking discipline that powers our campaigns, with a clear syntax, naming rules, governance, and reporting layers.</p>
              </Card>
              <Card className="p-4 bg-card border-border">
                <h3 className="font-semibold text-foreground mb-2">3. Design it like a product, not a one-time landing page</h3>
                <p className="text-muted-foreground">Sign up, referral link, leaderboard, fraud checks, rewards, emails, ops—everything had to work together.</p>
              </Card>
            </div>
          </ProgressiveReveal>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* Step 3: The Numbers */}
        <section className="mb-20" id="step-3">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            3. The Numbers Behind the Story
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Over 4 intense weeks this is what actually happened:
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="p-6 bg-card border-border">
                <div className="text-3xl font-bold text-foreground">24,044</div>
                <div className="text-muted-foreground">total link clicks</div>
              </Card>
              <Card className="p-6 bg-card border-border">
                <div className="text-3xl font-bold text-foreground">19,689</div>
                <div className="text-muted-foreground">unique sessions</div>
              </Card>
              <Card className="p-6 bg-card border-border">
                <div className="text-3xl font-bold text-foreground">6,903</div>
                <div className="text-muted-foreground">total conversions</div>
              </Card>
              <Card className="p-6 bg-card border-border">
                <div className="text-3xl font-bold text-foreground">≈28%</div>
                <div className="text-muted-foreground">visit to registration conversion</div>
              </Card>
              <Card className="p-6 bg-card border-border">
                <div className="text-3xl font-bold text-foreground">982</div>
                <div className="text-muted-foreground">people signed up as referrers</div>
              </Card>
              <Card className="p-6 bg-card border-border">
                <div className="text-3xl font-bold text-foreground">238</div>
                <div className="text-muted-foreground">fraudulent submissions blocked</div>
              </Card>
            </div>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              These are not "marketing projected" numbers. These came out of a proper tracking setup where every referral click, visit and registration was written into a database and rolled up into a live dashboard.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* Power Law Distribution with Podium */}
        <section className="mb-20" id="power-law">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Power Law: Champions Drive Results
          </h2>
          
          <ProgressiveReveal>
            <p className="text-lg text-muted-foreground mb-8 text-center">
              7 people drove 46% of all conversions. Design for your champions, not your averages.
            </p>
          </ProgressiveReveal>
          
          <ProgressiveReveal>
            <div className="bg-card border border-border rounded-xl p-8 mb-8">
              <PowerLawPodium />
            </div>
          </ProgressiveReveal>
          
          <ProgressiveReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                <Badge className="bg-amber-500 text-white mb-2">Champions</Badge>
                <div className="text-2xl font-bold text-foreground">7</div>
                <div className="text-xs text-muted-foreground">100+ referrals each</div>
                <div className="text-sm font-semibold text-amber-600 dark:text-amber-400">46% of conversions</div>
              </Card>
              <Card className="p-4 bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
                <Badge className="bg-zinc-500 text-white mb-2">High Performers</Badge>
                <div className="text-2xl font-bold text-foreground">28</div>
                <div className="text-xs text-muted-foreground">10-99 referrals each</div>
                <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">13% of conversions</div>
              </Card>
              <Card className="p-4 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900">
                <Badge className="bg-orange-600 text-white mb-2">Contributors</Badge>
                <div className="text-2xl font-bold text-foreground">304</div>
                <div className="text-xs text-muted-foreground">1-9 referrals each</div>
                <div className="text-sm font-semibold text-orange-600 dark:text-orange-400">12% of conversions</div>
              </Card>
              <Card className="p-4 bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800">
                <Badge variant="outline" className="mb-2">Inactive</Badge>
                <div className="text-2xl font-bold text-foreground">643</div>
                <div className="text-xs text-muted-foreground">0 referrals</div>
                <div className="text-sm text-muted-foreground">65% of referrers</div>
              </Card>
            </div>
          </ProgressiveReveal>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* Step 4: Clean Pipes */}
        <section className="mb-20" id="step-4">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            4. Season 0: Cleaning the Pipes Before Pouring Fuel
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              A lot of referral campaigns fail not because the idea is bad, but because the tracking is chaos. Before we designed the referral loop, we did something very boring and very important:
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <ul className="list-disc list-inside text-lg text-foreground space-y-2 mb-6">
              <li>Aligned UTMs, naming, and campaign structure</li>
              <li>Agreed on standard values for source, medium, campaign, content</li>
              <li>Wired the referral product into the same analytics stack as our paid and owned channels</li>
            </ul>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              That meant <strong>every referral link</strong> carried clean, consistent UTMs, <strong>every visit</strong> was stored with source and medium, and <strong>every registration</strong> could be tied back to a referrer or base campaign.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-6 rounded-xl">
              <p className="text-lg text-foreground">
                <strong>Pro tip:</strong> So when the numbers started coming in, there was no "why does HubSpot say 18K and GA say 12K" fight. The data was boringly consistent. If you are copying this playbook, copy this part first. The cool stuff depends on it.
              </p>
            </div>
          </ProgressiveReveal>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* Step 5: Designing the Loop */}
        <section className="mb-20" id="step-5">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            5. Designing the Loop, Not Just the Page
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              We borrowed a lot of thinking from Gustaf's Airbnb virality work: make the <strong>loop</strong> obvious, reduce friction at each step, reward the right behaviour, protect the system from abuse.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="bg-card border border-border p-6 rounded-xl mb-8">
              <p className="text-lg text-foreground text-center font-medium">
                The loop: <span className="text-primary">invite</span> → <span className="text-primary">click</span> → <span className="text-primary">register</span> → <span className="text-primary">attend</span> → <span className="text-primary">become a referrer next season</span>
              </p>
            </div>
          </ProgressiveReveal>

          {/* 5.1 Referrer Onboarding */}
          <div className="mb-8">
            <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
              5.1 The Referrer Onboarding
            </h3>
            <ProgressiveReveal>
              <p className="text-lg text-foreground leading-relaxed mb-4">
                Goal: make it emotionally rewarding to become a "Katalyst insider", not just "someone with a link".
              </p>
            </ProgressiveReveal>
            <ProgressiveReveal>
              <ul className="list-disc list-inside text-lg text-foreground space-y-2 mb-4">
                <li>One page where you enter name, email, phone</li>
                <li>Instant generation of a <strong>unique referral code</strong></li>
                <li>Redirect into a "share modal" with platform-specific copy</li>
                <li>Show starting stats (0 visits, 0 registrations, rank "rookie")</li>
                <li>Clearly show what happens at 1, 5, 10, 25 referrals</li>
              </ul>
            </ProgressiveReveal>
          </div>

          {/* 5.2 Landing Page */}
          <div className="mb-8">
            <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
              5.2 The Landing Page That Converts at 28%
            </h3>
            <ProgressiveReveal>
              <p className="text-lg text-foreground leading-relaxed mb-4">
                We did not try to make the referral landing page clever. We made it <strong>clear</strong>.
              </p>
            </ProgressiveReveal>
            <ProgressiveReveal>
              <div className="bg-muted/30 p-6 rounded-xl mb-4">
                <p className="font-semibold text-foreground mb-2">Above the fold:</p>
                <ul className="list-disc list-inside text-foreground space-y-1">
                  <li>What HR Katalyst is in one line</li>
                  <li>Who it is for</li>
                  <li>What they get (topics, speakers, certificate, fee)</li>
                  <li>The date + a single primary CTA</li>
                </ul>
              </div>
            </ProgressiveReveal>
          </div>

          {/* 5.3 Thank You Page */}
          <div className="mb-8">
            <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
              5.3 The Thank You Page That Closes the Loop
            </h3>
            <ProgressiveReveal>
              <p className="text-lg text-foreground leading-relaxed">
                The moment someone registered, two things happened: they were counted as a <strong>conversion</strong> for the referrer, and they were invited to <strong>become a referrer</strong> themselves. That meant the loop did not depend only on our email list. Every new attendee had a path to bring others.
              </p>
            </ProgressiveReveal>
          </div>

          {/* 5.4 Leaderboard */}
          <div className="mb-8">
            <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
              5.4 The Live Leaderboard
            </h3>
            <ProgressiveReveal>
              <p className="text-lg text-foreground leading-relaxed mb-4">
                This is where the fun started. We built a real-time leaderboard that showed top referrers by name and company, refreshed automatically as new registrations came in, and used badges and language that felt like a game, not a sales dashboard.
              </p>
            </ProgressiveReveal>
            <ProgressiveReveal>
              <p className="text-lg text-foreground leading-relaxed">
                This did two things: gave the heavy hitters a stage to compete on, and signalled to everyone else that referrals were real, not hand-waving.
              </p>
            </ProgressiveReveal>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* System Architecture Diagram */}
        <section className="mb-20" id="architecture">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            System Architecture
          </h2>
          <ProgressiveReveal>
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                  <Globe className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                  <div className="font-bold text-foreground text-sm">External Website</div>
                  <div className="text-xs text-muted-foreground mt-2">Landing Page → Thank You</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
                  <Code className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-bold text-foreground text-sm">Referral App</div>
                  <div className="text-xs text-muted-foreground mt-2">GetLink • ShareModal • Leaderboard • Admin</div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-bold text-foreground text-sm">Edge Functions</div>
                  <div className="text-xs text-muted-foreground mt-2">track-visit • track-conversion • send-email</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                  <Database className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="font-bold text-foreground text-sm">Database</div>
                  <div className="text-xs text-muted-foreground mt-2">referrers • visits • conversions</div>
                </div>
              </div>
              
              {/* Flow arrows */}
              <div className="flex justify-center items-center gap-2 mt-6 text-muted-foreground">
                <span className="text-sm">User visits landing page</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm">Edge function logs visit</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm">User registers</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm">Conversion tracked</span>
              </div>
            </div>
          </ProgressiveReveal>
        </section>

        <CTABanner
          title="Build your referral system with utm.one"
          description="Clean tracking, real-time attribution, and governance tools to power your community-led growth"
          buttonText="Get Early Access"
          buttonHref="/early-access"
          variant="primary"
        />

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* Step 6: Protecting Integrity */}
        <section className="mb-20" id="step-6">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            6. Protecting the Integrity of the Campaign
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              The dark side of referral campaigns is obvious: fake emails, bots, throwaway domains. We did not want to be the team that got 25,000 "registrations" and 3,000 people showing up.
            </p>
          </ProgressiveReveal>

          <ActionChecklist
            items={fraudProtectionChecklist}
            storageKey="hr-katalyst-fraud-protection"
            title="Fraud Protection Checklist"
          />

          <ProgressiveReveal>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-6 rounded-xl mt-6">
              <p className="text-lg text-foreground">
                <strong>Pro tip:</strong> Instead of deleting bad entries, we marked them as invalid and kept an audit trail. This let us clean the leaderboard without angering honest referrers, show integrity stats publicly, and learn where abuse was coming from.
              </p>
            </div>
          </ProgressiveReveal>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* Step 7: The Human Side */}
        <section className="mb-20" id="step-7">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            7. The Human Side: Rewards, Stories, and Recognition
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              No one wakes up wanting "points in someone else's CRM". People wake up wanting to feel: <strong>seen</strong>, <strong>useful</strong>, <strong>part of something bigger</strong>.
            </p>
          </ProgressiveReveal>

          <ActionChecklist
            items={rewardsChecklist}
            storageKey="hr-katalyst-rewards"
            title="Rewards & Recognition Checklist"
          />

          <ProgressiveReveal>
            <div className="mt-6 space-y-4">
              <Card className="p-4 bg-card border-border">
                <h4 className="font-semibold text-foreground mb-2">The Killers</h4>
                <p className="text-muted-foreground">Top 3 went purely for headline prizes. They drove 46% of conversions.</p>
              </Card>
              <Card className="p-4 bg-card border-border">
                <h4 className="font-semibold text-foreground mb-2">The Grinders</h4>
                <p className="text-muted-foreground">Pushed to cross the guaranteed merch line. Consistent, motivated sharers.</p>
              </Card>
              <Card className="p-4 bg-card border-border">
                <h4 className="font-semibold text-foreground mb-2">The Casuals</h4>
                <p className="text-muted-foreground">Made one or two referrals but felt emotionally part of the movement. All three groups matter.</p>
              </Card>
            </div>
          </ProgressiveReveal>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* Step 8: What Moved the Needle */}
        <section className="mb-20" id="step-8">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            8. What Actually Moved the Needle
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              When we stepped back after the dust settled, five things clearly mattered more than the rest:
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="space-y-4">
              {[
                { num: 1, title: "We treated the referral system as a product", desc: "Separate backlog, clear architecture, edge functions, database tables, dashboard—all built intentionally instead of hacked together." },
                { num: 2, title: "We trusted power laws, not averages", desc: "A tiny percentage of referrers drove the majority of registrations. Our job was to make those people dangerous (in a good way)." },
                { num: 3, title: "The loop was obvious to the user", desc: "Register, get link, share, see your name move, get rewarded. No jargon, no confusion." },
                { num: 4, title: "Tracking was clean from day one", desc: "UTMs, naming, governance, and reporting meant the founder, marketing, and finance saw the same numbers and could agree on what worked." },
                { num: 5, title: "We respected the audience", desc: "No fake scarcity, no shady tactics. HR folks are literally paid to sniff out bad incentives. Anything misaligned would have backfired." },
              ].map((item) => (
                <Card key={item.num} className="p-6 bg-card border-border">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {item.num}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ProgressiveReveal>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* Step 9: How to Copy This */}
        <section className="mb-20" id="step-9">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            9. How to Copy This for Your Own Event
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Here is a stripped-down version you can run, even if you do not have engineers on standby.
            </p>
          </ProgressiveReveal>

          <ActionChecklist
            items={preEventChecklist}
            storageKey="hr-katalyst-copy-this"
            title="6-Step Implementation Checklist"
          />

          <ProgressiveReveal>
            <div className="mt-8 bg-muted/30 border-l-4 border-primary p-6 rounded-r-lg">
              <h4 className="font-semibold text-foreground mb-2">Communication tip:</h4>
              <p className="text-foreground mb-4">Your emails to referrers should sound more like:</p>
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg mb-4">
                <p className="text-green-800 dark:text-green-200 italic">"You brought 7 HR peers into a better conversation this month. Here's what happens next."</p>
              </div>
              <p className="text-foreground mb-2">And less like:</p>
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                <p className="text-red-800 dark:text-red-200 italic">"Dear user, you have earned 70 points. Click here."</p>
              </div>
            </div>
          </ProgressiveReveal>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* NEW: How to Build This in Lovable - 7 Phase Guide */}
        <section className="mb-20" id="build-lovable">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-4">
            How to Build This in Lovable
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            A step-by-step technical guide to build the entire referral system using Lovable's AI-powered development platform.
          </p>

          <div className="space-y-8">
            {buildPhases.map((phase) => (
              <ProgressiveReveal key={phase.phase}>
                <Card className="p-6 bg-card border-border overflow-hidden">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <phase.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">Phase {phase.phase}</Badge>
                        <h3 className="text-xl font-semibold text-foreground">{phase.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{phase.description}</p>
                    </div>
                  </div>

                  {/* Code Block */}
                  <div className="mb-4">
                    <CodeBlock code={phase.code} />
                  </div>

                  {/* Checklist */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3">✅ Phase {phase.phase} Checklist</h4>
                    <ul className="space-y-2">
                      {phase.checklist.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </ProgressiveReveal>
            ))}
          </div>

          <ProgressiveReveal>
            <div className="mt-8 bg-primary/10 border border-primary/20 p-6 rounded-xl">
              <h4 className="font-semibold text-foreground mb-2">💡 Pro Tip: Build in Order</h4>
              <p className="text-foreground">
                Follow the phases sequentially. Each phase builds on the previous one. Start with database setup, then tracking, then UI. You can have a working referral system in 1-2 days with Lovable.
              </p>
            </div>
          </ProgressiveReveal>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* Campaign Timeline */}
        <section className="mb-20" id="timeline">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Campaign Timeline
          </h2>
          <ProgressiveReveal>
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Week 1: Build (7 days)</h4>
                  <div className="flex gap-2 flex-wrap">
                    {["Database Setup", "Referral Links", "Tracking Functions", "Integration", "Leaderboard", "Admin Dashboard", "Testing"].map((item) => (
                      <span key={item} className="px-3 py-1 bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-200 rounded-full text-xs">{item}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Weeks 2-5: Run Campaign (28 days)</h4>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 rounded-full text-xs">Launch Week: ~150/day</span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 rounded-full text-xs">Mid-Campaign: ~200/day</span>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-200 rounded-full text-xs">Final Week: ~400/day</span>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-200 rounded-full text-xs">Last 48hrs: ~800/day</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Week 6: Fulfill (7 days)</h4>
                  <div className="flex gap-2 flex-wrap">
                    {["Announce Winners", "Collect Addresses", "Ship Rewards"].map((item) => (
                      <span key={item} className="px-3 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 rounded-full text-xs">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ProgressiveReveal>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* Step 10: Closing the Loop */}
        <section className="mb-20" id="step-10">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            10. Closing the Loop: From 10K to 25K
          </h2>

          <CaseStudyCard
            title="HR Katalyst Season 5 Transformation"
            before={{
              title: "Before: Capped Growth",
              items: [
                "~10,000 registrations per season",
                "Organic + paid gave spike, then flattened",
                "More effort, same shape curve",
                "No systematic referral tracking",
              ],
              metrics: "10K registrations • Same growth curve every season"
            }}
            after={{
              title: "After: Community-Led Engine",
              items: [
                "25,000+ registrations in season 5",
                "982 active referrers driving growth",
                "28% conversion rate on referral landing page",
                "96.6% data integrity rate",
              ],
              metrics: "25K registrations • 2.5x growth • 150% increase"
            }}
            highlightMetric="+150% registration growth from community-led referrals"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-8 mb-6">
              HR Katalyst did not jump from 10K to 25K registrations because we found a magical ad set. It happened because:
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <ul className="list-disc list-inside text-lg text-foreground space-y-2 mb-6">
              <li>We treated community as the new gold, not a nice-to-have</li>
              <li>We turned that belief into a concrete growth system</li>
              <li>We built the boring plumbing that lets referrals compound year after year</li>
            </ul>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <div className="bg-primary/10 border border-primary/20 p-6 rounded-xl">
              <p className="text-lg text-foreground">
                <strong>The real asset:</strong> The next seasons will not start at zero—they will start from a base of hundreds of people who have already proved they are willing to put their name behind the event. That is the real asset you build when you do referrals right.
              </p>
            </div>
          </ProgressiveReveal>
        </section>

        {/* Divider */}
        <hr className="border-border my-16" />

        {/* FAQ */}
        <section className="mb-20" id="faq">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-8">
            Common Questions
          </h2>
          <FAQAccordion items={faqItems} />
        </section>

        {/* Final CTA */}
        <CTABanner
          title="Ready to build your referral engine?"
          description="utm.one provides the tracking, governance, and analytics to power community-led growth"
          buttonText="Get Early Access"
          buttonHref="/early-access"
          variant="accent"
        />
      </GuideLayout>
    </>
  );
}
