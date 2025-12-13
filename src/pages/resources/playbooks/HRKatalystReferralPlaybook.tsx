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
import { Users, MousePointerClick, Target, ShieldCheck, TrendingUp, Award } from "lucide-react";

export default function HRKatalystReferralPlaybook() {
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
    { icon: MousePointerClick, label: "Total Clicks", value: "24,044", color: "text-blue-500" },
    { icon: Users, label: "Unique Sessions", value: "19,689", color: "text-purple-500" },
    { icon: Target, label: "Conversions", value: "6,903", color: "text-green-500" },
    { icon: TrendingUp, label: "Conversion Rate", value: "28%", color: "text-amber-500" },
    { icon: Award, label: "Active Referrers", value: "982", color: "text-pink-500" },
    { icon: ShieldCheck, label: "Integrity Rate", value: "96.6%", color: "text-cyan-500" },
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

        {/* Step Tracker */}
        <PlaybookSteps steps={steps} currentStep={1} className="mb-16" />

        {/* Metrics Dashboard */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Campaign Results at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.label} className="p-4 text-center bg-card border-border">
                <metric.icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* Referrals Funnel Diagram */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Referrals Funnel
          </h2>
          <ProgressiveReveal>
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                  <div className="text-sm text-muted-foreground">Entry Point</div>
                  <div className="font-bold text-foreground">~5,000 Landing Page Visitors</div>
                </div>
                <div className="text-2xl text-muted-foreground">↓</div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div className="text-sm text-muted-foreground">Take Rate</div>
                  <div className="font-bold text-foreground">982 Signed Up as Referrers (19.6%)</div>
                </div>
                <div className="text-2xl text-muted-foreground">↓</div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                  <div className="text-sm text-muted-foreground">Active Sharers</div>
                  <div className="font-bold text-foreground">339 Referrers with 1+ Conversion (34.5%)</div>
                </div>
                <div className="text-2xl text-muted-foreground">↓</div>
                <div className="p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg border border-pink-200 dark:border-pink-900">
                  <div className="text-sm text-muted-foreground">Link Clicks</div>
                  <div className="font-bold text-foreground">24,044 Total Referral Link Visits</div>
                </div>
                <div className="text-2xl text-muted-foreground">↓</div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
                  <div className="text-sm text-muted-foreground">Registrations</div>
                  <div className="font-bold text-foreground">6,903 Completed Sign-ups (28.7% conv)</div>
                </div>
                <div className="text-2xl text-muted-foreground">↓</div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  <div className="text-sm text-muted-foreground">Valid Conversions</div>
                  <div className="font-bold text-foreground">6,665 After Fraud Checks (96.5% integrity)</div>
                </div>
              </div>
            </div>
          </ProgressiveReveal>
        </section>

        {/* Step 1: The Scene */}
        <section className="mb-16" id="step-1">
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

        {/* Step 2: The Bet */}
        <section className="mb-16" id="step-2">
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

        {/* Step 3: The Numbers */}
        <section className="mb-16" id="step-3">
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

        {/* Power Law Distribution */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            The Power Law: Champions Drive Results
          </h2>
          <ProgressiveReveal>
            <div className="bg-card border border-border rounded-xl p-8 mb-6">
              <h3 className="text-lg font-semibold text-foreground text-center mb-6">Conversion Distribution by Referrer Tier</h3>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-500"></div>
                  <span className="text-sm text-foreground">100+ refs: 3,173 (46%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-zinc-400"></div>
                  <span className="text-sm text-foreground">10-99 refs: 909 (13%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-500"></div>
                  <span className="text-sm text-foreground">1-9 refs: 823 (12%)</span>
                </div>
              </div>
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

        {/* Step 4: Clean Pipes */}
        <section className="mb-16" id="step-4">
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

        {/* Step 5: Designing the Loop */}
        <section className="mb-16" id="step-5">
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

        {/* System Architecture Diagram */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            System Architecture
          </h2>
          <ProgressiveReveal>
            <div className="bg-card border border-border rounded-xl p-8">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="font-bold text-foreground text-sm">External Website</div>
                  <div className="text-xs text-muted-foreground mt-2">Landing Page → Thank You</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
                  <div className="text-2xl mb-2">💜</div>
                  <div className="font-bold text-foreground text-sm">Referral App</div>
                  <div className="text-xs text-muted-foreground mt-2">GetLink • ShareModal • Leaderboard • Admin</div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-bold text-foreground text-sm">Edge Functions</div>
                  <div className="text-xs text-muted-foreground mt-2">track-visit • track-conversion • send-email</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                  <div className="text-2xl mb-2">🗄️</div>
                  <div className="font-bold text-foreground text-sm">Database</div>
                  <div className="text-xs text-muted-foreground mt-2">referrers • visits • conversions</div>
                </div>
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

        {/* Step 6: Protecting Integrity */}
        <section className="mb-16" id="step-6">
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

        {/* Step 7: The Human Side */}
        <section className="mb-16" id="step-7">
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

        {/* Step 8: What Moved the Needle */}
        <section className="mb-16" id="step-8">
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

        {/* Step 9: How to Copy This */}
        <section className="mb-16" id="step-9">
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

        {/* Campaign Timeline */}
        <section className="mb-16">
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

        {/* Step 10: Closing the Loop */}
        <section className="mb-16" id="step-10">
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
              metrics: ["10K registrations", "Same growth curve every season"]
            }}
            after={{
              title: "After: Community-Led Engine",
              items: [
                "25,000+ registrations in season 5",
                "982 active referrers driving growth",
                "28% conversion rate on referral landing page",
                "96.6% data integrity rate",
              ],
              metrics: ["25K registrations", "2.5x growth", "150% increase"]
            }}
            highlightMetric={{
              value: "+150%",
              label: "Registration growth from community-led referrals"
            }}
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

        {/* FAQ */}
        <section className="mb-16">
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
