import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { SocialProofCounter } from "@/components/growth/SocialProofCounter";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { BenefitCardsGrid } from "@/components/solutions/BenefitCardsGrid";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { InteractiveWorkflowCard } from "@/components/solutions/InteractiveWorkflowCard";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";
import { AnimatedConnectingLine } from "@/components/solutions/AnimatedConnectingLine";
import { Code, Webhook, FileText, CheckCircle2, Layers, Terminal, Zap, Database, Rocket } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

const Developers = () => {
  const faqs = [
    {
      question: "Is there a GraphQL API?",
      answer: "Yes. utm.one provides both REST and GraphQL APIs. Use whichever fits your stack. Full documentation with copy-paste examples in 8 languages."
    },
    {
      question: "What's the rate limit on the free tier?",
      answer: "600 requests per minute on the free tier. Pro tier gets 6,000 req/min. Enterprise gets custom limits based on your needs."
    },
    {
      question: "Can I self-host utm.one?",
      answer: "Yes. utm.one provides a Docker image and full deployment guide for self-hosting on AWS, GCP, Azure, or your own infrastructure. You get the same features, just hosted on your servers."
    },
    {
      question: "Does utm.one have webhooks?",
      answer: "Yes. Webhooks fire on every click, scan, and conversion. You can stream events to your data warehouse, CRM, or internal systems in real-time."
    },
    {
      question: "How do I validate UTMs before creating links?",
      answer: "Use the Clean-Track validation endpoint. POST your UTM parameters and get back a validation result with errors/warnings before creating the link."
    },
    {
      question: "Can I generate QR codes via API?",
      answer: "Yes. Pass your link ID and design parameters (colors, logo, style) to the QR API. Returns PNG, SVG, or PDF. No frontend needed."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="utm.one for Developers"
        description="Type-safe APIs. Clean docs. utm.one gives developers reliable APIs, fast performance, and control over link structure."
        canonical="https://utm.one/solutions/developers"
        keywords={['developer API', 'link shortener API', 'REST API', 'GraphQL API', 'webhooks', 'developer tools']}
      />
      <WebPageSchema 
        name="utm.one for Developers"
        description="Type-safe APIs. Clean docs. utm.one gives developers reliable APIs, fast performance, and control over link structure."
        url="https://utm.one/solutions/developers"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Developers', url: 'https://utm.one/solutions/developers' }
        ]}
      />
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <SocialProofCounter role="developers" variant="minimal" />
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient leading-[1.05] lowercase">
              type-safe APIs. clean docs. zero surprises.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              utm.one gives developers reliable APIs, fast performance, clean metadata, and control over link structure. build once, ship fast.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                get early access
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Free for 14 days • No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: The Moment Story */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <TheMomentStoryCard
            title="the 3 AM PagerDuty alert"
            timestamp="Wednesday, 3:17 AM"
            scenario="Your link shortener API returns 500. Production is down. 50,000 campaign links are broken. Your CEO is awake. You're scrambling to find a replacement provider, but every other service requires migration, new DNS setup, and breaking changes to your codebase. By morning, you've lost $200K in campaign spend."
            visual={
              <div className="bg-[#1e1e1e] rounded-xl p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-gray-400 text-xs">PagerDuty Alert</span>
                </div>
                <div className="space-y-2 text-gray-300">
                  <div className="text-red-400">❌ API Error 500: Service Unavailable</div>
                  <div className="text-gray-500">Source: shortener-api.thirdparty.com</div>
                  <div className="text-gray-500">Impact: 50,000 production links</div>
                  <div className="text-gray-500">Status: CRITICAL</div>
                  <div className="mt-4 text-destructive">Campaign spend wasted: $200K</div>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Fold 3: Before vs After */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase">
              the problem vs the solution
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-[640px] mx-auto">
              manual errors vs reliable infrastructure.
            </p>
          </div>
          
          <ContentComparison
            beforeTitle="unreliable API"
            afterTitle="utm.one API"
            beforeContent={
              <div className="space-y-3">
                <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-xs">
                  <div className="text-red-400 mb-2 font-semibold">Error Response:</div>
                  <div className="space-y-1 text-gray-400">
                    <div>{'{'}</div>
                    <div className="pl-4">"error": "Internal Server Error",</div>
                    <div className="pl-4">"status": 500,</div>
                    <div className="pl-4">"message": "Something went wrong"</div>
                    <div>{'}'}</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700 text-red-400 text-xs">
                    ❌ 50,000 links broken
                  </div>
                </div>
              </div>
            }
            afterContent={
              <div className="space-y-3">
                <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-xs">
                  <div className="text-green-400 mb-2 font-semibold">Success Response:</div>
                  <div className="space-y-1 text-gray-300">
                    <div>{'{'}</div>
                    <div className="pl-4">"shortUrl": "utm.one/q4-sale",</div>
                    <div className="pl-4">"status": "active",</div>
                    <div className="pl-4">"clicks": 0</div>
                    <div>{'}'}</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700 text-primary text-xs">
                    ✓ 99.99% uptime SLA
                  </div>
                </div>
              </div>
            }
            caption="Production-grade infrastructure = no 3 AM PagerDuty alerts"
          />
        </div>
      </section>

      {/* Fold 4: What You Get */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              what you get
            </h2>
            <p className="text-xl text-muted-foreground">
              Fast. Predictable. Developer-friendly.
            </p>
          </div>
          
          <BenefitCardsGrid benefits={[
            {
              icon: Code,
              title: "GraphQL + REST",
              description: "Pick your preference. Both fully supported with same features."
            },
            {
              icon: Zap,
              title: "high rate limits",
              description: "600 req/min free, 6,000 on Pro. Enterprise gets custom limits."
            },
            {
              icon: Webhook,
              title: "real-time webhooks",
              description: "Stream clicks, scans, conversions to your warehouse or CRM."
            },
            {
              icon: Terminal,
              title: "API playground",
              description: "Test endpoints interactively before deploying to production."
            },
            {
              icon: Database,
              title: "metadata APIs",
              description: "Add structured meaning for AI systems. Open Graph, Schema.org."
            },
            {
              icon: CheckCircle2,
              title: "transparent errors",
              description: "Clear error messages. No cryptic 500s. Debug in minutes, not hours."
            }
          ]} />
        </div>
      </section>

      {/* Fold 5: Your Workflow Transformed */}
      <section className="relative py-24 md:py-32 bg-mirage overflow-hidden">
        <WorkflowBackground />
        
        <div className="relative max-w-6xl mx-auto px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white lowercase mb-4">
              your workflow, transformed
            </h2>
            <p className="text-lg text-white/70">
              How your day changes with utm.one
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            <div className="relative">
              <InteractiveWorkflowCard
                icon={Code}
                label="make API call"
                stepNumber="01"
                delay={0}
              />
              <AnimatedConnectingLine index={0} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={CheckCircle2}
                label="get typed response"
                stepNumber="02"
                delay={0.2}
              />
              <AnimatedConnectingLine index={1} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={Rocket}
                label="deploy integration"
                stepNumber="03"
                delay={0.4}
              />
              <AnimatedConnectingLine index={2} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={Webhook}
                label="monitor webhooks"
                stepNumber="04"
                delay={0.6}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fold 6: Code Example */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground lowercase mb-4">
              from idea to production in 3 minutes
            </h2>
            <p className="text-lg text-muted-foreground">
              Type-safe SDK with autocomplete. No guessing.
            </p>
          </div>
          
          <div className="bg-[#1e1e1e] rounded-2xl p-8 font-mono text-sm overflow-x-auto">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-gray-400 text-xs">api-example.ts</span>
            </div>
            <div className="space-y-2 text-gray-300">
              <div><span className="text-purple-400">import</span> {'{'} createLink {'}'} <span className="text-purple-400">from</span> <span className="text-green-400">'@utm-one/sdk'</span>;</div>
              <div className="h-4" />
              <div><span className="text-blue-400">const</span> link = <span className="text-blue-400">await</span> createLink({'{'}</div>
              <div className="pl-4">destination: <span className="text-green-400">"https://acme.com/campaign"</span>,</div>
              <div className="pl-4">slug: <span className="text-green-400">"q4-sale"</span>,</div>
              <div className="pl-4">utm: {'{'}</div>
              <div className="pl-8">source: <span className="text-green-400">"linkedin"</span>,</div>
              <div className="pl-8">medium: <span className="text-green-400">"cpc"</span>,</div>
              <div className="pl-8">campaign: <span className="text-green-400">"q4-2025-sale"</span></div>
              <div className="pl-4">{'}'}</div>
              <div>{'}'});</div>
              <div className="h-4" />
              <div className="text-green-400">// ✓ Link created: utm.one/q4-sale</div>
              <div className="text-gray-500">// ✓ UTMs validated against Clean-Track rules</div>
              <div className="text-gray-500">// ✓ Ready for production use</div>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 7: Feature Cards */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight lowercase">
              built for developers
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={Code}
              title="short links API"
              description="Create, edit, manage links programmatically"
              color="blazeOrange"
              delay={0}
              href="/features/short-links"
            />
            <FeatureMappedCard
              icon={Layers}
              title="clean-track API"
              description="Validate UTMs before saving"
              color="deepSea"
              delay={0.1}
              href="/features/clean-track"
            />
            <FeatureMappedCard
              icon={Database}
              title="metadata API"
              description="Add structured meaning for AI systems"
              color="primary"
              delay={0.2}
              href="/features/integrations"
            />
            <FeatureMappedCard
              icon={Code}
              title="QR API"
              description="Generate QR via code"
              color="blazeOrange"
              delay={0.3}
              href="/features/qr-generator"
            />
            <FeatureMappedCard
              icon={Webhook}
              title="webhooks"
              description="Listen to clicks, scans, conversions"
              color="deepSea"
              delay={0.4}
              href="/features/integrations"
            />
            <FeatureMappedCard
              icon={FileText}
              title="docs"
              description="Copy-paste examples in 8 languages"
              color="primary"
              delay={0.5}
              href="/features/integrations"
            />
          </div>
        </div>
      </section>

      {/* Fold 8: FAQs */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <RoleSpecificFAQ role="developers" faqs={faqs} />
        </div>
      </section>

      {/* Fold 9: CTA */}
      <PremiumCTASection
        headline="ready to build with utm.one?"
        subheadline="join developer teams who trust utm.one for reliable APIs and clean data."
        primaryCTA="get early access →"
      />

      <Footer />
    </div>
  );
};

export default Developers;
