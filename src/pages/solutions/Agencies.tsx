import { Link } from "react-router-dom";
import { CTAButton } from "@/components/ui/CTAButton";
import { FolderKanban, Globe, Users, FileBarChart, Shield, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { ROICalculator } from "@/components/growth/ROICalculator";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { HeroFloatingShapes, DiagonalAccent, DotPattern, HeroGlow } from "@/components/solutions/RolePageDecorations";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { BenefitCardsGrid } from "@/components/solutions/BenefitCardsGrid";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { InteractiveWorkflowCard } from "@/components/solutions/InteractiveWorkflowCard";
import { AnimatedConnectingLine } from "@/components/solutions/AnimatedConnectingLine";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";

const Agencies = () => {
  return (
    <div className="dark min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#050505' }}>
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat' }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-[2]" style={{ background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.06) 0%, rgba(200,220,255,0.03) 30%, transparent 70%)' }} />
      <SEO
        title="utm.one for Agencies - Multi-Client Link Management"
        description="Workspaces, team invites, white-label reports, and client-branded domains. Manage dozens of clients without chaos."
        canonical="https://utm.one/solutions/agencies"
        keywords={["agency link management", "multi-client workspaces", "white-label reports", "agency utm tracking"]}
      />
      <WebPageSchema
        name="utm.one for Agencies"
        description="Workspaces, team invites, white-label reports, and client-branded domains. Manage dozens of clients without chaos."
        url="https://utm.one/solutions/agencies"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Agencies', url: 'https://utm.one/solutions/agencies' }
        ]}
      />
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient leading-[1.05] lowercase mt-8">
              manage every client from<br />one command center
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              multi-client workspaces, white-label QR codes, client-specific analytics, 
              and governance controls. built for agencies scaling fast.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/early-access" variant="primary" pulse>
                get started free
              </CTAButton>
              <CTAButton href="/pricing" variant="secondary" showArrow={false}>
                view pricing
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: The Moment Story */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <TheMomentStoryCard
            title="the client call where you couldn't explain the numbers"
            timestamp="Monday, 2:15 PM"
            scenario="Client asks about Q3 campaign performance. You have data from 4 different tools—Bitly, Google Analytics, HubSpot, and your agency's custom tracker. None of them match. Client A shows 12K clicks in Bitly, but GA4 shows 8.9K sessions. You're on the call scrambling to explain why the numbers don't align. Client asks: 'Are we paying for fake clicks?'"
            visual={
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border-2 border-destructive rounded-xl p-6">
                  <div className="text-destructive font-semibold mb-3 text-sm uppercase tracking-wide">Your Reality</div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bitly clicks:</span>
                      <span className="font-semibold">12,043</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GA4 sessions:</span>
                      <span className="font-semibold">8,912</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">HubSpot visits:</span>
                      <span className="font-semibold">10,287</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Your tracker:</span>
                      <span className="font-semibold">11,503</span>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-destructive">
                    Which number is real? You have no answer.
                  </div>
                </div>
                
                <div className="bg-primary/5 border-2 border-primary rounded-xl p-6">
                  <div className="text-primary font-semibold mb-3 text-sm uppercase tracking-wide">With utm.one</div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">utm.one clicks:</span>
                      <span className="font-semibold">12,043</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GA4 sessions:</span>
                      <span className="font-semibold">12,043</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">HubSpot visits:</span>
                      <span className="font-semibold">12,043</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client report:</span>
                      <span className="font-semibold">12,043</span>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-primary">
                    One source of truth. Every tool agrees.
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Fold 3: Before vs After */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase">
              the problem vs the solution
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-[640px] mx-auto">
              conflicting data vs one source of truth.
            </p>
          </div>
          
          <ContentComparison
            beforeTitle="4 dashboards, 4 different numbers"
            afterTitle="1 utm.one dashboard"
            beforeContent={
              <div className="space-y-3">
                <div className="bg-card rounded-lg p-4 font-mono text-xs">
                  <div className="text-destructive font-semibold mb-2 text-sm">Client A (conflicting data):</div>
                  <div className="space-y-1 text-muted-foreground">
                    <div>Bitly: 12,043 clicks</div>
                    <div>GA4: 8,912 sessions</div>
                    <div>HubSpot: 10,287 visits</div>
                    <div>Your tracker: 11,503 clicks</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border text-destructive text-xs">
                    Client asks: "Which is real?"
                  </div>
                </div>
              </div>
            }
            afterContent={
              <div className="space-y-3">
                <div className="bg-primary/10 rounded-lg p-4 font-mono text-xs">
                  <div className="text-primary font-semibold mb-2 text-sm">Client A (single source of truth):</div>
                  <div className="space-y-1 text-foreground">
                    <div>utm.one: 12,043 clicks</div>
                    <div>GA4: 12,043 sessions</div>
                    <div>HubSpot: 12,043 visits</div>
                    <div>Your report: 12,043 clicks</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-primary/20 text-primary text-xs">
                    Every tool agrees. Client trusts you.
                  </div>
                </div>
              </div>
            }
            caption="Same campaigns. One source of truth = zero client disputes."
          />
        </div>
      </section>

      {/* Fold 4: What You Get */}
      <section className="py-24 md:py-32">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              what you get
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to manage clients at scale
            </p>
          </div>
          
          <BenefitCardsGrid benefits={[
            {
              icon: FolderKanban,
              title: "unlimited workspaces",
              description: "One workspace per client. Data isolated, no cross-contamination."
            },
            {
              icon: FileBarChart,
              title: "white-label reports",
              description: "Branded PDF exports with your logo, their data, zero confusion."
            },
            {
              icon: Globe,
              title: "client-branded domains",
              description: "nike.com/go/, adidas.com/c/—their brand, your tracking."
            },
            {
              icon: Users,
              title: "team member invites",
              description: "Invite client teams to their workspace—they see only their data."
            },
            {
              icon: Shield,
              title: "role-based permissions",
              description: "Control who creates, edits, and views links across clients."
            },
            {
              icon: Zap,
              title: "automated reporting",
              description: "Scheduled reports delivered to clients—no manual work."
            }
          ]} />
        </div>
      </section>

      {/* Fold 4: Mapped Features */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-wildSand/50 to-background">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight lowercase">
              built for agency workflows
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={FolderKanban}
              title="Multi-Client Workspaces"
              description="Isolated data per client"
              color="blazeOrange"
              delay={0}
              href="/features/workspaces"
            />
            <FeatureMappedCard
              icon={FileBarChart}
              title="White-Label Reports"
              description="Branded PDF exports"
              color="deepSea"
              delay={0.1}
              href="/features/reporting"
            />
            <FeatureMappedCard
              icon={Globe}
              title="Custom Domains"
              description="Client-branded short links"
              color="primary"
              delay={0.2}
              href="/features/custom-domains"
            />
            <FeatureMappedCard
              icon={Shield}
              title="Team Permissions"
              description="Role-based access control"
              color="blazeOrange"
              delay={0.3}
              href="/features/governance"
            />
            <FeatureMappedCard
              icon={Zap}
              title="Automated Workflows"
              description="Scheduled reports & alerts"
              color="deepSea"
              delay={0.4}
              href="/features/automation"
            />
          </div>
        </div>
      </section>

      {/* Fold 5: Workflow */}
      <section className="relative py-24 md:py-32 bg-mirage overflow-hidden">
        <WorkflowBackground />
        
        <div className="relative max-w-[1200px] mx-auto px-8 z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white mb-6 lowercase">
              your workflow, simplified
            </h2>
            <p className="text-xl text-white/70">
              Onboard → Assign → Track → Report
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative">
            {[
              { icon: Users, label: "Onboard", step: "01" },
              { icon: Globe, label: "Assign", step: "02" },
              { icon: FileBarChart, label: "Track", step: "03" },
              { icon: Zap, label: "Report", step: "04" },
            ].map((workflow, index) => (
              <div key={index} className="relative">
                <InteractiveWorkflowCard
                  icon={workflow.icon}
                  label={workflow.label}
                  stepNumber={workflow.step}
                  delay={index * 0.15}
                />
                <AnimatedConnectingLine index={index} total={4} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 6: ROI Calculator */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-primary/5 via-blazeOrange/5 to-background">
        <div className="container mx-auto px-6">
          <ROICalculator />
        </div>
      </section>

      {/* Fold 7: CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <RetroGradientMesh />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl lowercase text-label mb-6">
              ready to scale your agency?
            </h2>
            <p className="text-xl text-secondary-label max-w-2xl mx-auto mb-12">
              join agencies managing millions of clicks for hundreds of clients. 
              start free, upgrade as you grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/early-access" variant="primary" pulse>
                get started free
              </CTAButton>
              <CTAButton href="/pricing" variant="secondary" showArrow={false}>
                view agency pricing
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Agencies;
