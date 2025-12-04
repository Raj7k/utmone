import { Helmet } from "react-helmet";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Users, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StageSelector } from "@/components/resources/StageSelector";
import { AttributionModelComparator } from "@/components/resources/AttributionModelComparator";
import { CRMImplementationWizard } from "@/components/resources/CRMImplementationWizard";
import { CaseStudyCarousel } from "@/components/resources/CaseStudyCarousel";
import { AttributionROICalculator } from "@/components/resources/AttributionROICalculator";
import { NinetyDayTimeline } from "@/components/resources/NinetyDayTimeline";
import { ToolRecommendationEngine } from "@/components/resources/ToolRecommendationEngine";
import { FrameworkPrinciple } from "@/components/resources/FrameworkPrinciple";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";

const B2BAttributionFramework = () => {
  const relatedResources = [
    { type: "Playbook", title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics-playbook" },
    { type: "Guide", title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics" },
    { type: "Playbook", title: "UTM Governance Playbook", url: "/resources/playbooks/utm-governance-playbook" },
    { type: "Examples", title: "Dashboard Examples", url: "/resources/examples/dashboard-examples" }
  ];

  return (
    <>
      <Helmet>
        <title>B2B Attribution Framework: From $0 to $100M+ | utm.one</title>
        <meta
          name="description"
          content="Complete B2B attribution playbook with 4-stage growth framework, real case studies (Airbnb, Dropbox, Slack, HubSpot), CRM implementation guides, and battle-tested insights from 50+ companies."
        />
        <meta name="keywords" content="B2B attribution, marketing attribution, multi-touch attribution, attribution modeling, CRM attribution, Salesforce attribution, HubSpot attribution" />
        
        {/* Schema.org markup for LLM optimization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "B2B Attribution Framework: From $0 to $100M+",
            "description": "Complete attribution playbook with 4-stage framework, CRM implementation guides, and real case studies from Airbnb, Dropbox, Slack, HubSpot, and Monday.com",
            "totalTime": "P90D",
            "step": [
              {
                "@type": "HowToStep",
                "position": 1,
                "name": "Foundation Phase ($0-1M)",
                "text": "Implement first-touch + self-reported attribution using free tools. Track lead sources with Google Analytics 4, HubSpot Free CRM, and spreadsheets.",
                "itemListElement": [
                  { "@type": "HowToDirection", "text": "Set up HubSpot Free CRM with custom attribution fields" },
                  { "@type": "HowToDirection", "text": "Create UTM parameter standards for all campaigns" },
                  { "@type": "HowToDirection", "text": "Implement self-reported attribution form on signup" }
                ],
                "tool": ["HubSpot", "Google Analytics", "Google Sheets"]
              },
              {
                "@type": "HowToStep",
                "position": 2,
                "name": "Growth Phase ($1-10M)",
                "text": "Implement U-shaped and linear hybrid attribution models. Automate multi-touch tracking across customer journey.",
                "tool": ["HubSpot Professional", "Ruler Analytics", "Segment"]
              },
              {
                "@type": "HowToStep",
                "position": 3,
                "name": "Scale Phase ($10-100M)",
                "text": "Deploy W-shaped attribution with custom ML models. Implement account-based measurement and predictive analytics.",
                "tool": ["Salesforce", "Bizible", "Custom ML"]
              },
              {
                "@type": "HowToStep",
                "position": 4,
                "name": "Enterprise Phase ($100M+)",
                "text": "Build AI-driven custom attribution with Shapley values and incrementality testing. Implement privacy-compliant measurement.",
                "tool": ["Custom Data Warehouse", "ML Platforms", "Media Mix Modeling"]
              }
            ],
            "about": [
              { "@type": "Thing", "name": "Marketing Attribution" },
              { "@type": "Thing", "name": "Multi-Touch Attribution" },
              { "@type": "Thing", "name": "CRM Implementation" }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": "B2B Attribution Framework",
            "author": { "@type": "Organization", "name": "utm.one" },
            "datePublished": "2024-01-15",
            "dependencies": ["HubSpot", "Salesforce", "Google Analytics"],
            "proficiencyLevel": "Beginner to Expert"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Hero Section */}
        <section className="py-20 bg-background border-b border-border/50">
          <div className="max-w-[1200px] mx-auto px-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/resources" className="hover:text-foreground transition-colors">Resources</Link>
              <span>/</span>
              <Link to="/resources/frameworks" className="hover:text-foreground transition-colors">Frameworks</Link>
              <span>/</span>
              <span className="text-foreground">B2B Attribution</span>
            </nav>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge className="text-white animate-pulse" style={{ background: 'rgba(59,130,246,1)' }}>NEW</Badge>
              <Badge variant="outline">25-page framework</Badge>
              <Badge variant="outline">5 case studies</Badge>
              <Badge variant="outline">4-stage model</Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground lowercase mb-6">
              b2b attribution framework: from $0 to $100m+
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-[800px] mb-8">
              real-world playbook with case studies, crm implementation & battle-tested insights from 50+ b2b companies
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span>35 min read</span>
              <span>Updated January 2025</span>
            </div>
          </div>
        </section>

        {/* Executive Summary */}
        <section className="py-20 bg-background">
          <div className="max-w-[900px] mx-auto px-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                the brutal reality
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 my-12">
                <div className="bg-card rounded-2xl p-6 border-2 border-border/50">
                  <div className="text-5xl font-display font-bold mb-2" style={{ color: 'rgba(59,130,246,1)' }}>76%</div>
                  <p className="text-sm text-muted-foreground">have or will have attribution capability within 12 months</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border-2 border-border/50">
                  <div className="text-5xl font-display font-bold mb-2" style={{ color: 'rgba(59,130,246,1)' }}>29%</div>
                  <p className="text-sm text-muted-foreground">consider themselves very successful at using attribution</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border-2 border-border/50">
                  <div className="text-5xl font-display font-bold mb-2" style={{ color: 'rgba(59,130,246,1)' }}>56</div>
                  <p className="text-sm text-muted-foreground">touchpoints average consumer needs before purchasing</p>
                </div>
              </div>

              <p className="text-lg text-foreground leading-relaxed">
                This disconnect costs businesses millions in misallocated marketing spend. A typical modern retail consumer needs 56 touchpoints on average before completing a purchase. In B2B, with 6.8 different stakeholders involved in the average purchase, attribution isn't optional—it's survival.
              </p>
            </div>
          </div>
        </section>

        {/* 4-Stage Framework */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-[900px] mx-auto px-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  the 4-stage growth framework
                </h2>
                <p className="text-lg text-muted-foreground max-w-[720px]">
                  attribution evolves as your revenue grows. each stage requires different models, tools, and complexity levels.
                </p>
              </div>

              <StageSelector />
            </div>
          </div>
        </section>

        {/* Attribution Models */}
        <section className="py-20 bg-background">
          <div className="max-w-[900px] mx-auto px-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  attribution models explained
                </h2>
                <p className="text-lg text-muted-foreground max-w-[720px]">
                  compare 7 attribution models side-by-side. understand when to use each model and avoid common pitfalls.
                </p>
              </div>

              <AttributionModelComparator />
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-[900px] mx-auto px-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  real company case studies
                </h2>
                <p className="text-lg text-muted-foreground max-w-[720px]">
                  learn from airbnb, dropbox, slack, hubspot, and monday.com. see exactly how they implemented attribution at each growth stage.
                </p>
              </div>

              <CaseStudyCarousel />
            </div>
          </div>
        </section>

        {/* CRM Implementation */}
        <section className="py-20 bg-background">
          <div className="max-w-[900px] mx-auto px-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  crm implementation wizard
                </h2>
                <p className="text-lg text-muted-foreground max-w-[720px]">
                  step-by-step setup guides for hubspot and salesforce. includes actual code you can copy-paste.
                </p>
              </div>

              <CRMImplementationWizard />
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-[900px] mx-auto px-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  calculate your attribution roi
                </h2>
                <p className="text-lg text-muted-foreground max-w-[720px]">
                  see exactly how much attribution could save you in wasted marketing spend. real numbers, real impact.
                </p>
              </div>

              <AttributionROICalculator />
            </div>
          </div>
        </section>

        {/* Success Patterns */}
        <section className="py-20 bg-background">
          <div className="max-w-[900px] mx-auto px-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  5 success patterns from 50+ b2b companies
                </h2>
              </div>

              <StaggerContainer className="space-y-6">
                <StaggerItem>
                  <FrameworkPrinciple
                    number={1}
                    title="Start Simple, Scale Smart"
                    description="Uber and Airbnb started with spreadsheets, not Salesforce. Begin with first-touch + self-reported attribution before building complex models. The best attribution system is one your team actually uses."
                  />
                </StaggerItem>

                <StaggerItem>
                  <FrameworkPrinciple
                    number={2}
                    title="Self-Reported Beats Algorithmic"
                    description="'How did you hear about us?' is more accurate than any tracking pixel. 42% of successful B2B companies use self-reported attribution as their primary source of truth. People know where they came from."
                  />
                </StaggerItem>

                <StaggerItem>
                  <FrameworkPrinciple
                    number={3}
                    title="Model Selection Follows Revenue Stage"
                    description="$0-1M: First-touch. $1-10M: U-shaped. $10-100M: W-shaped. $100M+: Custom ML. Jumping stages causes confusion. Your attribution model should match your go-to-market complexity, not your aspirations."
                  />
                </StaggerItem>

                <StaggerItem>
                  <FrameworkPrinciple
                    number={4}
                    title="Invest 5-10% of Marketing Budget"
                    description="Attribution infrastructure costs money. Budget 5-10% of total marketing spend for tools, implementation, and ongoing maintenance. Under-investing leads to broken systems and mistrust."
                  />
                </StaggerItem>

                <StaggerItem>
                  <FrameworkPrinciple
                    number={5}
                    title="90-Day ROI Timeline"
                    description="Expect 90 days to full implementation and first meaningful insights. Companies that rush see 50% higher failure rates. The first month is foundation, second month is integration, third month is optimization."
                  />
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* 90-Day Implementation */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-[900px] mx-auto px-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  90-day implementation roadmap
                </h2>
                <p className="text-lg text-muted-foreground max-w-[720px]">
                  tactical daily checklist from day 1 to day 90. track your progress and never miss a critical step.
                </p>
              </div>

              <NinetyDayTimeline />
            </div>
          </div>
        </section>

        {/* Tool Recommendations */}
        <section className="py-20 bg-background">
          <div className="max-w-[900px] mx-auto px-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  recommended tool stack
                </h2>
                <p className="text-lg text-muted-foreground max-w-[720px]">
                  get personalized tool recommendations based on your revenue stage and budget. includes cost breakdown and setup time.
                </p>
              </div>

              <ToolRecommendationEngine />
            </div>
          </div>
        </section>

        {/* Crisis Management */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-[900px] mx-auto px-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  crisis management: when attribution breaks
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card rounded-2xl p-6 border-2 border-red-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <h3 className="font-display font-semibold text-foreground">iOS 14.5 Kills Facebook</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Apple's ATT framework destroyed Facebook pixel tracking overnight.
                  </p>
                  <p className="text-sm text-foreground font-medium">
                    Fallback: Switch to first-party data + conversion API. Implement server-side tracking. Use Segment CDP.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 border-2 border-red-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <h3 className="font-display font-semibold text-foreground">Sales Won't Log Activities</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your beautiful attribution system is worthless if sales doesn't use the CRM.
                  </p>
                  <p className="text-sm text-foreground font-medium">
                    Solution: Automate everything. Use calendar integrations, email tracking, and call recording. Remove manual data entry.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 border-2 border-red-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <h3 className="font-display font-semibold text-foreground">Board Doesn't Trust Data</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    C-suite questions your attribution model credibility during budget season.
                  </p>
                  <p className="text-sm text-foreground font-medium">
                    Defense: Run incrementality tests. Show correlation vs causation. Present multiple models. Always include self-reported data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="py-20 bg-background">
          <div className="max-w-[900px] mx-auto px-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-display font-semibold text-foreground">
                related resources
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedResources.map((resource, index) => (
                  <Link
                    key={index}
                    to={resource.url}
                    className="group bg-card rounded-xl p-6 border border-border/50 hover:border-white/20 hover:shadow-lg transition-all"
                  >
                    <div className="text-xs font-medium mb-2" style={{ color: 'rgba(59,130,246,1)' }}>{resource.type}</div>
                    <div className="text-base font-semibold text-foreground group-hover:text-white/80 transition-colors">
                      {resource.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default B2BAttributionFramework;
