import { SEO } from "@/components/seo/SEO";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/ui/CTAButton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Link as LinkIcon,
  Sparkles,
  Zap,
  CheckCircle,
  Eye,
  Shield,
  Type,
  Accessibility,
  History,
  Users,
  Cpu,
  Code,
  Target,
  TrendingUp,
  LineChart,
  ArrowRight
} from "lucide-react";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { WorkflowTimeline } from "@/components/solutions/WorkflowTimeline";
import { BenefitCardsGrid } from "@/components/solutions/BenefitCardsGrid";
import { CleanTrackScoreQuiz } from "@/components/growth/CleanTrackScoreQuiz";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";

const HowItWorks = () => {
  const workflowSteps = [
    { icon: LinkIcon, label: "Create link" },
    { icon: Sparkles, label: "Validate UTMs" },
    { icon: CheckCircle, label: "Generate QR" },
    { icon: Eye, label: "Track clicks" },
    { icon: LineChart, label: "Sync analytics" }
  ];

  const benefits = [
    {
      icon: Eye,
      title: "machine-readable metadata",
      description: "Every link carries structured data that humans, machines, AI models, and search engines can understand and interpret correctly."
    },
    {
      icon: Shield,
      title: "trust by design",
      description: "Full destination preview, safety scans, SSL validation, and blacklist checks before anyone clicks. No surprises."
    },
    {
      icon: Accessibility,
      title: "accessibility built-in",
      description: "WCAG AAA compliance, semantic slugs, descriptive ARIA labels, and keyboard-first navigation. Links that include everyone."
    },
    {
      icon: History,
      title: "permanent links",
      description: "Your links last forever with permanent redirect paths, exportable history, GitHub backup, and optional self-hosting."
    },
    {
      icon: Users,
      title: "cross-team governance",
      description: "Sales, marketing, ops, developers, and partners follow the same standard. Clean-track ensures discipline everywhere."
    },
    {
      icon: TrendingUp,
      title: "AI-powered analytics",
      description: "Predictive analytics, attribution graphs, smart routing, and link immunity. Intelligence embedded throughout the platform."
    }
  ];

  const roleCards = [
    {
      role: "marketers",
      title: "marketers",
      description: "launch campaigns with clean UTMs, branded QR codes, and reliable analytics",
      path: "/solutions/marketers"
    },
    {
      role: "sales",
      title: "sales",
      description: "track outreach performance, see engagement signals, time your calls perfectly",
      path: "/solutions/sales"
    },
    {
      role: "marketing-ops",
      title: "marketing ops",
      description: "enforce UTM templates, automate reporting, maintain data governance",
      path: "/solutions/marketing-ops"
    },
    {
      role: "developers",
      title: "developers",
      description: "type-safe API, reliable metadata, webhooks for automation",
      path: "/solutions/developers"
    },
    {
      role: "partner-managers",
      title: "partner managers",
      description: "fixed attribution, transparent reporting, partner-specific domains",
      path: "/solutions/partner-managers"
    },
    {
      role: "rev-ops",
      title: "rev ops",
      description: "unified tracking, predictable metrics, attribution without guesswork",
      path: "/solutions/rev-ops"
    }
  ];

  const faqs = [
    {
      question: "how does the clean-track framework work?",
      answer: (
        <div className="space-y-2">
          <p>Clean-track is a four-layer system that turns chaotic link creation into governed, reliable data:</p>
          <ul className="space-y-1 ml-4">
            <li>• <strong>Syntax layer:</strong> Enforces proper URL structure, UTM parameter formats, and naming rules</li>
            <li>• <strong>Naming rules layer:</strong> Validates utm_campaign patterns, required fields, and consistent terminology</li>
            <li>• <strong>Governance layer:</strong> Applies workspace templates, permission controls, and approval workflows</li>
            <li>• <strong>Reporting layer:</strong> Ensures clean data flows into GA4, HubSpot, Salesforce, and other analytics platforms</li>
          </ul>
          <p className="pt-2">This happens automatically at link creation—not after campaigns launch.</p>
        </div>
      )
    },
    {
      question: "what makes utm.one different from bit.ly or rebrandly?",
      answer: (
        <div className="space-y-2">
          <p>Most link shorteners are just redirects. utm.one is a link governance platform:</p>
          <ul className="space-y-1 ml-4">
            <li>• <strong>UTM builder first-class:</strong> Templates, validation, normalization—not an afterthought</li>
            <li>• <strong>Branded QR codes:</strong> Multiple variants per link, print-ready exports, utm.one watermark on free tier</li>
            <li>• <strong>Trust by design:</strong> Destination preview, safety scans, SSL validation before clicks</li>
            <li>• <strong>Accessibility:</strong> WCAG AAA compliance, semantic slugs, screen reader support</li>
            <li>• <strong>Permanence:</strong> Links never break with GitHub backup and optional self-hosting</li>
            <li>• <strong>AI analytics:</strong> Predictive insights, attribution graphs, smart routing built-in</li>
          </ul>
        </div>
      )
    },
    {
      question: "how do I get started?",
      answer: (
        <div className="space-y-2">
          <p>Getting started with utm.one takes under 2 minutes:</p>
          <ol className="space-y-1 ml-4">
            <li>1. Sign up and verify your email</li>
            <li>2. Set up your workspace (add team members, configure domain)</li>
            <li>3. Create your first link with clean UTMs</li>
            <li>4. Generate a branded QR code (optional)</li>
            <li>5. Install the tracking pixel on your website for conversion tracking</li>
          </ol>
          <p className="pt-2">Free plan includes 100 links, 10K clicks/month, and community support.</p>
        </div>
      )
    },
    {
      question: "does utm.one work with my existing analytics stack?",
      answer: (
        <div className="space-y-2">
          <p>Yes. utm.one enhances your existing tools, it doesn't replace them:</p>
          <ul className="space-y-1 ml-4">
            <li>• <strong>Google Analytics 4:</strong> Clean UTMs flow directly into GA4 reports</li>
            <li>• <strong>HubSpot:</strong> Native integration syncs links and contact attribution</li>
            <li>• <strong>Salesforce:</strong> API pushes link data to campaigns and opportunities</li>
            <li>• <strong>Segment:</strong> Events forwarded to your entire CDP stack</li>
            <li>• <strong>Webhooks:</strong> Push click events to Slack, custom dashboards, or internal BI</li>
          </ul>
          <p className="pt-2">utm.one is the governance layer—your existing tools get cleaner data.</p>
        </div>
      )
    },
    {
      question: "can I use my own custom domain?",
      answer: (
        <div className="space-y-2">
          <p>Yes. Custom domains are available on Pro and above:</p>
          <ul className="space-y-1 ml-4">
            <li>• <strong>Pro:</strong> 1 custom domain (e.g., go.yourcompany.com)</li>
            <li>• <strong>Business:</strong> 5 custom domains (e.g., events.company.com, partners.company.com)</li>
            <li>• <strong>Enterprise:</strong> Unlimited custom domains with multi-tenant support</li>
          </ul>
          <p className="pt-2">Setup requires DNS configuration (CNAME record + TXT verification). Full instructions provided in dashboard.</p>
        </div>
      )
    },
    {
      question: "what happens if utm.one shuts down?",
      answer: (
        <div className="space-y-2">
          <p>Your links are protected with multiple permanence guarantees:</p>
          <ul className="space-y-1 ml-4">
            <li>• <strong>Permanent redirects:</strong> Links never expire or break, even after campaigns end</li>
            <li>• <strong>Exportable history:</strong> Download all links, UTMs, QR codes, and analytics as CSV/JSON</li>
            <li>• <strong>GitHub backup:</strong> Optional daily backups to your GitHub repo</li>
            <li>• <strong>Self-hosting option:</strong> Run utm.one on your own infrastructure (Docker package available)</li>
          </ul>
          <p className="pt-2">If we ever shut down, you get 6 months notice + full data export + self-hosting migration support.</p>
        </div>
      )
    },
    {
      question: "how does pricing work?",
      answer: (
        <div className="space-y-2">
          <p>utm.one has four pricing tiers designed for teams at different stages:</p>
          <ul className="space-y-1 ml-4">
            <li>• <strong>Free:</strong> $0 — 100 links, 10K clicks/month, 90-day retention, community support</li>
            <li>• <strong>Pro:</strong> $20/month — 1,000 links, 100K clicks/month, 1 custom domain, 365-day retention</li>
            <li>• <strong>Business:</strong> $99/month — 10K links, unlimited clicks, 5 custom domains, priority support</li>
            <li>• <strong>Enterprise:</strong> $300/month — Unlimited links, unlimited domains, dedicated SLA, SSO</li>
          </ul>
          <p className="pt-2">All plans include UTM builder, QR generator, analytics, and API access.</p>
        </div>
      )
    },
    {
      question: "can I track conversions, not just clicks?",
      answer: (
        <div className="space-y-2">
          <p>Yes. Conversion tracking requires installing the utm.one tracking pixel on your website:</p>
          <ol className="space-y-1 ml-4">
            <li>1. Copy the tracking pixel code from Settings → Tracking</li>
            <li>2. Paste it in your website's &lt;head&gt; tag (or via Google Tag Manager)</li>
            <li>3. Define conversion events (form submissions, purchases, signups)</li>
            <li>4. utm.one automatically attributes conversions to source links</li>
          </ol>
          <p className="pt-2">Without the pixel, you only get click tracking. With it, you get full funnel attribution.</p>
        </div>
      )
    }
  ];

  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="How utm.one Works"
        description="Discover how utm.one creates clean links, structured UTMs, branded QR codes, and reliable analytics — all from one simple system. Learn the utm.one flow."
        canonical="https://utm.one/how-it-works"
        keywords={['how utm.one works', 'link shortener', 'UTM builder', 'QR generator', 'analytics platform']}
      />
      <LLMSchemaGenerator 
        type="howto" 
        data={{
          title: "How utm.one Works",
          description: "Learn how utm.one creates clean links with structured UTMs and branded QR codes",
          steps: [
            { name: "Create a link", description: "Simple, branded, semantic link creation" },
            { name: "Apply Clean-track rules", description: "Automatic syntax and naming validation" },
            { name: "Generate UTMs", description: "Consistent parameters without errors" },
            { name: "Create QR code", description: "Branded QR codes with attribution" },
            { name: "Track analytics", description: "Clear metrics and attribution" },
            { name: "Team synchronization", description: "Unified standards across organization" }
          ]
        }}
      />
      
      {/* Fold 1: Hero with Gradient Mesh */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="container max-w-[980px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-8 text-center"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter text-white lowercase">
              how utm.one works
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-[800px] mx-auto">
              a simple system that helps you create links people trust, data you can rely on, and structure your entire gtm engine can follow.
            </p>
            
            <div className="flex flex-col items-center gap-6 pt-4">
              <CTAButton href="/early-access" variant="primary">
                see it in action →
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fold 2: The Pain Moment */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="container max-w-[1000px] mx-auto px-6">
          <TheMomentStoryCard
            title="the campaign post-mortem where nobody could agree on what actually worked"
            scenario="marketing says email drove 40% of conversions. sales says outreach emails were the real driver. ops pulls the GA4 report—47 different utm_campaign variations for the same campaign. some with capital letters, some with spaces, some with underscores. nobody can trust the data. the meeting ends with 'let's try to be more consistent next time.'"
            timestamp="thursday, 2:47 pm"
          />
        </div>
      </section>

      {/* Fold 3: Before vs After */}
      <section className="py-24 md:py-32">
        <div className="container max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 lowercase text-white">
              before and after utm.one
            </h2>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
              the difference is obvious
            </p>
          </motion.div>

          <ContentComparison
            beforeTitle="before"
            afterTitle="after"
            beforeContent={
              <div className="space-y-4">
                <div className="text-sm font-mono p-3 rounded" style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)' }}>
                  <p style={{ color: 'rgba(255,100,100,0.9)' }}>utm_campaign=Q1-Launch</p>
                  <p style={{ color: 'rgba(255,100,100,0.9)' }}>utm_campaign=q1_launch</p>
                  <p style={{ color: 'rgba(255,100,100,0.9)' }}>utm_campaign=Q1%20Launch</p>
                  <p style={{ color: 'rgba(255,100,100,0.9)' }}>utm_campaign=q1launch</p>
                  <p style={{ color: 'rgba(255,100,100,0.6)' }}>+ 43 more variations...</p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ color: 'rgba(255,100,100,0.9)' }}>×</span> broken dashboards
                  </p>
                  <p className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ color: 'rgba(255,100,100,0.9)' }}>×</span> conflicting reports
                  </p>
                  <p className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ color: 'rgba(255,100,100,0.9)' }}>×</span> team arguments
                  </p>
                  <p className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ color: 'rgba(255,100,100,0.9)' }}>×</span> wasted time
                  </p>
                </div>
              </div>
            }
            afterContent={
              <div className="space-y-4">
                <div className="text-sm font-mono p-3 rounded" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.9)' }}>utm_campaign=q1-product-launch</p>
                  <p style={{ color: 'rgba(255,255,255,0.9)' }}>utm_campaign=q1-product-launch</p>
                  <p style={{ color: 'rgba(255,255,255,0.9)' }}>utm_campaign=q1-product-launch</p>
                  <p style={{ color: 'rgba(255,255,255,0.9)' }}>utm_campaign=q1-product-launch</p>
                  <p style={{ color: 'rgba(255,255,255,0.6)' }}>100% consistency</p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <CheckCircle className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} /> clean dashboards
                  </p>
                  <p className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <CheckCircle className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} /> reliable reports
                  </p>
                  <p className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <CheckCircle className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} /> team alignment
                  </p>
                  <p className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <CheckCircle className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} /> saved time
                  </p>
                </div>
              </div>
            }
            caption="one system, one standard, zero chaos"
          />
        </div>
      </section>

      {/* Fold 4: The utm.one Flow - Visual Timeline */}
      <section className="relative py-24 md:py-32 bg-mirage overflow-hidden">
        <WorkflowBackground />
        
        <div className="container max-w-[1000px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 lowercase">
              your workflow, transformed
            </h2>
            <p className="text-lg text-white/70">
              from creation to analytics, all automated
            </p>
          </motion.div>

          <WorkflowTimeline 
            steps={workflowSteps}
            description="one link creation triggers the entire clean-track flow — validation, QR generation, analytics, and team sync happen automatically."
          />
        </div>
      </section>

      {/* Fold 5: What Makes Links Different - Consolidated Features */}
      <section className="py-24 md:py-32">
        <div className="container max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 lowercase text-white">
              what makes links different
            </h2>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
              six features that turn links into assets
            </p>
          </motion.div>

          <BenefitCardsGrid benefits={benefits} />
        </div>
      </section>

      {/* Fold 6: Who It's For - Clickable Role Cards */}
      <section className="py-24 md:py-32">
        <div className="container max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 lowercase text-white">
              who it's for
            </h2>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
              different roles, same clean-track foundation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roleCards.map((card, index) => (
              <motion.div
                key={card.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={card.path}>
                  <div className="group h-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all hover:bg-zinc-900/60 cursor-pointer">
                    <div className="space-y-3">
                      <h3 className="text-xl font-display font-bold text-white group-hover:text-white/80 transition-colors lowercase">
                        {card.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {card.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium pt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        <span>learn more</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 7: Growth Loop - Clean Track Score Quiz */}
      <section className="py-24 md:py-32">
        <div className="container max-w-[900px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 lowercase text-white">
              how clean are your links?
            </h2>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
              take the 60-second clean-track assessment
            </p>
          </motion.div>

          <CleanTrackScoreQuiz />
        </div>
      </section>

      {/* Fold 8: FAQ */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <RoleSpecificFAQ
            role="teams using utm.one"
            faqs={faqs}
          />
        </div>
      </section>

      {/* Fold 9: Final CTA */}
      <PremiumCTASection
        headline="ready to make your links work harder?"
        subheadline="join teams using utm.one to create clean links, reliable analytics, and governance that scales."
        primaryCTA="get started →"
      />
    </MainLayout>
  );
};

export default HowItWorks;
