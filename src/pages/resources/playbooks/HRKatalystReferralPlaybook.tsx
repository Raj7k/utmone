import { GuideLayout } from "@/components/resources/GuideLayout";
import { PlaybookSteps } from "@/components/resources/PlaybookSteps";
import { ActionChecklist } from "@/components/resources/ActionChecklist";
import { CaseStudyCard } from "@/components/resources/CaseStudyCard";
import { CTABanner } from "@/components/resources/CTABanner";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, MousePointerClick, Target, ShieldCheck, TrendingUp, Award, BookOpen, Code2, Rocket } from "lucide-react";

// New Apple-style components
import { AppleReveal, StaggeredReveal, StaggeredItem } from "@/components/playbook/AppleReveal";
import { PlaybookHero } from "@/components/playbook/PlaybookHero";
import { FunnelVisualization } from "@/components/playbook/FunnelVisualization";
import { PowerLawPodium } from "@/components/playbook/PowerLawPodium";
import { ROICalculator } from "@/components/playbook/ROICalculator";
import { LeaderboardDemo } from "@/components/playbook/LeaderboardDemo";
import { PhaseTimeline } from "@/components/playbook/PhaseTimeline";
import { CodeBlock } from "@/components/playbook/CodeBlock";

export default function HRKatalystReferralPlaybook() {
  const steps = [
    { number: 1, title: "The Story" },
    { number: 2, title: "Campaign Playbook" },
    { number: 3, title: "Build in Lovable" },
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

  // Campaign Playbook phases (Gustaf style)
  const campaignPhases = [
    {
      id: "phase-0",
      title: "Phase 0: Define Success & Constraints",
      icon: "🎯",
      color: "blue",
      steps: [
        { id: "0-1", title: "Pick your north star", description: "Decide what 'win' means: X registrations, Y% conversion, Z% integrity rate" },
        { id: "0-2", title: "Choose who can be referrers", description: "Existing attendees, customers, partners, employees? Tag each pool for performance tracking" },
      ]
    },
    {
      id: "phase-1",
      title: "Phase 1: Design the Referral Loop",
      icon: "🔄",
      color: "purple",
      steps: [
        { id: "1-1", title: "Define the trigger", description: "When to ask: immediately after registration, email follow-up, during/after sessions" },
        { id: "1-2", title: "Define the action", description: "Get unique link and share with friends. One form: name + email + optional phone" },
        { id: "1-3", title: "Define the reward", description: "Status (leaderboard), Tangible (gadgets for top 3, merch for 10+), Access (early access to next event)" },
        { id: "1-4", title: "Design the investment", description: "Name (public sharing), Reputation (vouching), Time (watching leaderboard)" },
      ]
    },
    {
      id: "phase-2",
      title: "Phase 2: Build Comms & Assets",
      icon: "📝",
      color: "green",
      steps: [
        { id: "2-1", title: "Create referrer landing", description: "Headline: 'become a Katalyst insider', form for name/email/phone, instant referral link generation" },
        { id: "2-2", title: "Create event landing", description: "Clear promise, for whom, what they get, date + time, single CTA. Target 25-30% conversion" },
        { id: "2-3", title: "Create thank you page", description: "Confirm registration, invite to become referrer, add-to-calendar buttons" },
      ]
    },
    {
      id: "phase-3",
      title: "Phase 3: Leaderboards, Rewards, Fraud",
      icon: "🛡️",
      color: "amber",
      steps: [
        { id: "3-1", title: "Decide leaderboard rules", description: "Start/end dates, what counts as valid, how ties are broken" },
        { id: "3-2", title: "Agree fraud rules", description: "Disposable domains blocked, fake names blocked, IP rate limiting, suspicious patterns flagged" },
        { id: "3-3", title: "Define winner timeline", description: "Leaderboard lock date, winner email date, prize shipping SLA" },
      ]
    },
    {
      id: "phase-4",
      title: "Phase 4: Launch, Run, Close",
      icon: "🚀",
      color: "pink",
      steps: [
        { id: "4-1", title: "Launch to warm base", description: "Email past attendees, customers, employees. All traffic → referrer landing" },
        { id: "4-2", title: "Run weekly rhythms", description: "Weekly stats, leaderboard updates on LinkedIn, recognition mails to top 50" },
        { id: "4-3", title: "Final 72-hour sprint", description: "Announce cut-off time, 'last chance' email, shoutouts to top 10" },
        { id: "4-4", title: "Close & celebrate", description: "Freeze leaderboard, email winners, feature top referrers as case studies" },
      ]
    },
  ];

  // Lovable Build phases
  const lovablePhases = [
    {
      id: "lovable-1",
      title: "Phase 1: Project + Database Setup",
      icon: "🗄️",
      color: "blue",
      steps: [
        { id: "l1-1", title: "Create Lovable project", description: "New Lovable app with React + Supabase starter template" },
        { id: "l1-2", title: "Create core tables", description: "referrers, referral_visits, referral_conversions tables in Supabase" },
        { id: "l1-3", title: "Set Row Level Security", description: "Public can SELECT limited fields, service role can insert/update" },
      ]
    },
    {
      id: "lovable-2",
      title: "Phase 2: Referral Code + Onboarding",
      icon: "🔗",
      color: "purple",
      steps: [
        { id: "l2-1", title: "Add generateRefCode util", description: "Normalize to uppercase, strip special characters, ensure uniqueness" },
        { id: "l2-2", title: "Build /get-link page", description: "Form: name, email, phone. Check if referrer exists, generate new code if not" },
        { id: "l2-3", title: "Build ShareModal component", description: "Show referral URL, copy button, share buttons for WhatsApp, LinkedIn, Twitter, Email" },
      ]
    },
    {
      id: "lovable-3",
      title: "Phase 3: Tracking Visits & Conversions",
      icon: "📊",
      color: "green",
      steps: [
        { id: "l3-1", title: "Add track-visit edge function", description: "Validate origin, validate ref_code, rate limit per IP, insert into referral_visits" },
        { id: "l3-2", title: "Add track-conversion edge function", description: "Validate campaign end date, block disposables, insert into referral_conversions" },
        { id: "l3-3", title: "Integrate with event website", description: "Read ref from URL, store in cookie, fire POST on visit and conversion" },
      ]
    },
    {
      id: "lovable-4",
      title: "Phase 4: Leaderboard + Dashboard",
      icon: "🏆",
      color: "amber",
      steps: [
        { id: "l4-1", title: "Create get_leaderboard_data SQL", description: "Filter is_valid = true, add bonus_points, order by total_points" },
        { id: "l4-2", title: "Build /leaderboard page", description: "Call RPC, display table with rank, name, email, registrations, points" },
        { id: "l4-3", title: "Build admin dashboard", description: "Secure via user_roles, show key stats, top referrers, fraud flags" },
      ]
    },
    {
      id: "lovable-5",
      title: "Phase 5: Gamification + Bonus",
      icon: "⭐",
      color: "pink",
      steps: [
        { id: "l5-1", title: "LinkedIn bonus submissions", description: "Form to submit LinkedIn post URL, admin approves for +15 bonus points" },
        { id: "l5-2", title: "Compute total points", description: "total_points = valid_conversions + bonus_points" },
      ]
    },
    {
      id: "lovable-6",
      title: "Phase 6: Email Automation",
      icon: "📧",
      color: "cyan",
      steps: [
        { id: "l6-1", title: "Connect Resend", description: "Set RESEND_API_KEY, implement send-referrer-campaign edge function" },
        { id: "l6-2", title: "Add webhook handler", description: "Update opened_at, clicked_at in email_campaigns table" },
      ]
    },
    {
      id: "lovable-7",
      title: "Phase 7: Reward Claims",
      icon: "🎁",
      color: "orange",
      steps: [
        { id: "l7-1", title: "Use reward_claims table", description: "Insert rows for winners with rank and prize type on campaign close" },
        { id: "l7-2", title: "Build /claim-reward page", description: "Verify winner, multi-step form for shipping details, update status to claimed" },
      ]
    },
  ];

  const generateRefCodeSnippet = `// src/lib/generateRefCode.ts
export function generateRefCode(name: string): string {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
  
  const random = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();
  
  return \`\${initials}_\${random}\`;
}`;

  const trackVisitSnippet = `// supabase/functions/track-visit/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const { ref_code, session_id, page, user_agent } = await req.json()
  
  // Validate ref_code format
  if (!/^[A-Z]{2,3}_[A-Z0-9]{4}$/.test(ref_code)) {
    return new Response('Invalid ref code', { status: 400 })
  }
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // Check referrer exists
  const { data: referrer } = await supabase
    .from('referrers')
    .select('id')
    .eq('ref_code', ref_code)
    .single()
  
  if (!referrer) {
    return new Response('Referrer not found', { status: 404 })
  }
  
  // Insert visit
  await supabase.from('referral_visits').insert({
    ref_code,
    session_id,
    page,
    user_agent,
    ip_address: req.headers.get('x-forwarded-for')
  })
  
  return new Response('OK', { status: 200 })
})`;

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
        title=""
        subtitle=""
        readTime="25 min read"
        lastUpdated="December 2025"
        breadcrumbs={breadcrumbs}
        relatedResources={[
          { title: "Event-Led Growth Playbook", href: "/resources/playbooks/event-led-growth-playbook", description: "Campaign tracking for events" },
          { title: "UTM Governance Playbook", href: "/resources/playbooks/utm-governance-playbook", description: "Enforce UTM standards" },
          { title: "Naming Convention Playbook", href: "/resources/playbooks/naming-convention-playbook", description: "Taxonomy design" },
        ]}
      >
        {/* Hero Section */}
        <PlaybookHero />

        {/* Tabs for 3 parts */}
        <section className="mb-16">
          <AppleReveal>
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="story" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden md:inline">The Story</span>
                </TabsTrigger>
                <TabsTrigger value="campaign" className="flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  <span className="hidden md:inline">Campaign Playbook</span>
                </TabsTrigger>
                <TabsTrigger value="build" className="flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  <span className="hidden md:inline">Build in Lovable</span>
                </TabsTrigger>
              </TabsList>

              {/* Part 1: The Story */}
              <TabsContent value="story" className="space-y-16">
                {/* Summary */}
                <AppleReveal>
                  <p className="text-xl text-foreground leading-relaxed speakable-content">
                    This is the behind-the-scenes story of how a nerdy HR conference turned into a 25K person movement. Real numbers, real architecture, and a step-by-step guide you can copy.
                  </p>
                </AppleReveal>

                {/* The Visual Funnel */}
                <section>
                  <AppleReveal>
                    <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
                      The Referral Funnel
                    </h2>
                  </AppleReveal>
                  <FunnelVisualization />
                </section>

                {/* Power Law Podium */}
                <section>
                  <AppleReveal>
                    <h2 className="text-3xl font-display font-semibold text-foreground mb-4">
                      The Power Law: Champions Drive Results
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      7 people (0.7%) drove 46% of all conversions. Design for your champions.
                    </p>
                  </AppleReveal>
                  <PowerLawPodium />
                </section>

                {/* Interactive Widgets Row */}
                <section>
                  <AppleReveal>
                    <h2 className="text-3xl font-display font-semibold text-foreground mb-8">
                      Interactive Tools
                    </h2>
                  </AppleReveal>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ROICalculator />
                    <LeaderboardDemo />
                  </div>
                </section>

                {/* The Scene */}
                <section id="step-1">
                  <AppleReveal>
                    <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
                      The Scene: A Zoom Room and a Ceiling
                    </h2>
                  </AppleReveal>
                  
                  <AppleReveal delay={0.1}>
                    <p className="text-lg text-foreground leading-relaxed mb-6">
                      Five seasons back, HR Katalyst was already "successful": ~10,000 registrations, packed chat window, decent social buzz. From the outside it looked big. From the inside it felt… capped.
                    </p>
                  </AppleReveal>

                  <AppleReveal delay={0.2}>
                    <p className="text-lg text-foreground leading-relaxed mb-6">
                      Every season the graphs looked the same: organic list + partners gave a spike, paid ads did their job, then registrations flattened out long before we ran out of time or content. We were working harder, adding more speakers, more formats, more creative, yet the curves stayed similar.
                    </p>
                  </AppleReveal>

                  <AppleReveal delay={0.3}>
                    <div className="bg-muted/30 border-l-4 border-primary p-6 rounded-r-lg mb-6">
                      <p className="text-lg text-foreground italic">
                        At some point the question shifted from "how do we get more registrations" to "what is the <strong>system</strong> that will let HR Katalyst grow every year without killing the team?"
                      </p>
                    </div>
                  </AppleReveal>
                </section>

                {/* The Bet */}
                <section id="step-2">
                  <AppleReveal>
                    <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
                      The Bet: Community as the Channel
                    </h2>
                  </AppleReveal>

                  <AppleReveal delay={0.1}>
                    <p className="text-lg text-foreground leading-relaxed mb-6">
                      We were already sitting on a community-led growth engine, we just had not built the rails. The bet for season 5 was simple:
                    </p>
                  </AppleReveal>

                  <AppleReveal delay={0.2}>
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-xl mb-6">
                      <p className="text-xl text-foreground font-semibold text-center">
                        Treat referrals as the <strong>primary</strong> growth channel, not a side campaign.
                      </p>
                    </div>
                  </AppleReveal>

                  <StaggeredReveal className="space-y-4">
                    {[
                      { title: "No spammy growth hacks", desc: "This had to feel like a gift, not a pyramid scheme." },
                      { title: "Trust in the data", desc: "Clean tracking with clear syntax, naming rules, and governance." },
                      { title: "Design it like a product", desc: "Sign up, referral link, leaderboard, fraud checks, rewards—everything working together." },
                    ].map((item) => (
                      <StaggeredItem key={item.title}>
                        <Card className="p-4 bg-card border-border">
                          <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                          <p className="text-muted-foreground">{item.desc}</p>
                        </Card>
                      </StaggeredItem>
                    ))}
                  </StaggeredReveal>
                </section>

                {/* Clean Pipes */}
                <section id="step-4">
                  <AppleReveal>
                    <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
                      Cleaning the Pipes Before Pouring Fuel
                    </h2>
                  </AppleReveal>

                  <AppleReveal delay={0.1}>
                    <p className="text-lg text-foreground leading-relaxed mb-6">
                      A lot of referral campaigns fail not because the idea is bad, but because the tracking is chaos. Before we designed the referral loop, we did something very boring and very important:
                    </p>
                  </AppleReveal>

                  <AppleReveal delay={0.2}>
                    <ul className="list-disc list-inside text-lg text-foreground space-y-2 mb-6">
                      <li>Aligned UTMs, naming, and campaign structure</li>
                      <li>Agreed on standard values for source, medium, campaign, content</li>
                      <li>Wired the referral product into the same analytics stack</li>
                    </ul>
                  </AppleReveal>

                  <AppleReveal delay={0.3}>
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-6 rounded-xl">
                      <p className="text-lg text-foreground">
                        <strong>Pro tip:</strong> When the numbers started coming in, there was no "why does HubSpot say 18K and GA say 12K" fight. The data was boringly consistent.
                      </p>
                    </div>
                  </AppleReveal>
                </section>

                {/* Protecting Integrity */}
                <section id="step-6">
                  <AppleReveal>
                    <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
                      Protecting Campaign Integrity
                    </h2>
                  </AppleReveal>

                  <AppleReveal delay={0.1}>
                    <p className="text-lg text-foreground leading-relaxed mb-6">
                      The dark side of referral campaigns is obvious: fake emails, bots, throwaway domains. We did not want 25,000 "registrations" and 3,000 people showing up.
                    </p>
                  </AppleReveal>

                  <ActionChecklist
                    items={fraudProtectionChecklist}
                    storageKey="hr-katalyst-fraud-protection"
                    title="Fraud Protection Checklist"
                  />
                </section>

                {/* Before/After */}
                <CaseStudyCard
                  title="The Transformation"
                  before={{
                    title: "Before: Manual Growth",
                    items: [
                      "More effort, same shape curve",
                      "No systematic referral tracking",
                      "Relying on paid ads + organic list",
                    ],
                    metrics: "10K registrations • Same growth curve every season"
                  }}
                  after={{
                    title: "After: Community-Led Engine",
                    items: [
                      "982 active referrers driving growth",
                      "28% conversion rate on referral landing page",
                      "96.6% data integrity rate",
                    ],
                    metrics: "25K registrations • 2.5x growth • 150% increase"
                  }}
                  highlightMetric="+150% registration growth from community-led referrals"
                />

                {/* FAQ */}
                <FAQAccordion items={faqItems} />
              </TabsContent>

              {/* Part 2: Campaign Playbook (Gustaf Style) */}
              <TabsContent value="campaign" className="space-y-12">
                <AppleReveal>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      Referral Campaign Playbook
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      A Gustaf-inspired, step-by-step guide you can hand to your marketing team. Non-technical, repeat every season.
                    </p>
                  </div>
                </AppleReveal>

                <PhaseTimeline phases={campaignPhases} />

                {/* Pre-Event Checklist */}
                <AppleReveal>
                  <ActionChecklist
                    items={preEventChecklist}
                    storageKey="hr-katalyst-pre-event"
                    title="Pre-Event Setup Checklist"
                  />
                </AppleReveal>

                {/* Rewards Checklist */}
                <AppleReveal>
                  <ActionChecklist
                    items={rewardsChecklist}
                    storageKey="hr-katalyst-rewards"
                    title="Rewards & Recognition Checklist"
                  />
                </AppleReveal>

                {/* Key Insight */}
                <AppleReveal>
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
                    <p className="text-xl text-foreground font-medium mb-4">
                      "No one wakes up wanting points in someone else's CRM."
                    </p>
                    <p className="text-muted-foreground">
                      People want to feel <strong>seen</strong>, <strong>useful</strong>, and <strong>part of something bigger</strong>. Design your rewards around emotions, not transactions.
                    </p>
                  </div>
                </AppleReveal>
              </TabsContent>

              {/* Part 3: Build in Lovable */}
              <TabsContent value="build" className="space-y-12">
                <AppleReveal>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      Build in Lovable
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Step-by-step technical guide. Hand this to your product team or build it yourself in a weekend.
                    </p>
                  </div>
                </AppleReveal>

                <PhaseTimeline phases={lovablePhases} />

                {/* Code Examples */}
                <section>
                  <AppleReveal>
                    <h3 className="text-2xl font-display font-semibold text-foreground mb-6">
                      Code Examples
                    </h3>
                  </AppleReveal>

                  <div className="space-y-6">
                    <AppleReveal delay={0.1}>
                      <div>
                        <h4 className="text-lg font-medium text-foreground mb-3">Generate Referral Code</h4>
                        <CodeBlock code={generateRefCodeSnippet} filename="src/lib/generateRefCode.ts" />
                      </div>
                    </AppleReveal>

                    <AppleReveal delay={0.2}>
                      <div>
                        <h4 className="text-lg font-medium text-foreground mb-3">Track Visit Edge Function</h4>
                        <CodeBlock code={trackVisitSnippet} filename="supabase/functions/track-visit/index.ts" />
                      </div>
                    </AppleReveal>
                  </div>
                </section>

                {/* Database Schema */}
                <AppleReveal>
                  <Card className="p-6 bg-card border-border">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Database Schema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-mono text-sm font-bold text-foreground mb-2">referrers</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• id (uuid)</li>
                          <li>• name, email, phone</li>
                          <li>• ref_code (unique)</li>
                          <li>• utm_source, utm_medium</li>
                          <li>• created_at</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-mono text-sm font-bold text-foreground mb-2">referral_visits</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• id (uuid)</li>
                          <li>• ref_code (fk)</li>
                          <li>• session_id</li>
                          <li>• page, user_agent</li>
                          <li>• ip_address, visited_at</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-mono text-sm font-bold text-foreground mb-2">referral_conversions</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• id (uuid)</li>
                          <li>• ref_code (fk)</li>
                          <li>• email (converted user)</li>
                          <li>• is_valid (boolean)</li>
                          <li>• converted_at</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </AppleReveal>

                {/* Lovable CTA */}
                <AppleReveal>
                  <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                      Ready to Build?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Start building your referral system in Lovable. Full-stack, AI-powered, and ready in hours not weeks.
                    </p>
                    <a
                      href="https://lovable.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      Open Lovable
                      <Rocket className="w-4 h-4" />
                    </a>
                  </div>
                </AppleReveal>
              </TabsContent>
            </Tabs>
          </AppleReveal>
        </section>

        {/* Final CTA */}
        <CTABanner
          title="Build your referral system with utm.one"
          description="Clean tracking, real-time attribution, and governance tools to power your community-led growth"
          buttonText="Get Early Access"
          buttonHref="/early-access"
          variant="primary"
        />
      </GuideLayout>
    </>
  );
}
