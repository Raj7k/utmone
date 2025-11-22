import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Link as LinkIcon, 
  QrCode, 
  BarChart3, 
  TrendingUp,
  Shield, 
  Users,
  ArrowRight,
} from "lucide-react";
import { HeroVariantManager } from "@/components/landing/HeroVariantManager";
import { Navigation } from "@/components/landing/Navigation";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { GlowingFeatureCard } from "@/components/landing/GlowingFeatureCard";
import { DataFlowVisualization } from "@/components/landing/DataFlowVisualization";
import { NumberedPrinciple } from "@/components/landing/NumberedPrinciple";
import { BeforeAfterComparison } from "@/components/landing/BeforeAfterComparison";
import { 
  useTrackPageView, 
  useTrackCTAClick, 
  useTrackScrollDepth, 
  useTrackTimeOnPage 
} from "@/hooks/useLandingPageAnalytics";

const Index = () => {
  useTrackPageView();
  useTrackScrollDepth();
  useTrackTimeOnPage();
  const trackCTAClick = useTrackCTAClick();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <HeroVariantManager>
        {(variant) => (
          <section className="py-32 bg-white">
            <div className="max-w-[980px] mx-auto px-8">
              <div className="text-center space-y-6">
                <h1 className="text-4xl md:text-hero text-foreground font-extrabold tracking-tight text-balance">
                  {variant.headline}
                </h1>
                <p className="text-body text-muted-foreground max-w-[640px] mx-auto text-balance">
                  {variant.subheadline}
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Link to="/early-access">
                    <Button 
                      size="lg" 
                      variant="glow-pink"
                      className="text-[17px] font-medium px-8 h-12 rounded-full hover:scale-[1.02] transition-transform"
                      onClick={() => trackCTAClick('hero')}
                    >
                      get early access
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </HeroVariantManager>

      {/* Problem Section */}
      <section className="py-40 bg-white">
        <div className="max-w-[900px] mx-auto px-8">
          <NumberedPrinciple number="1" title="clear strategy">
            <AnimatedHeadline>
              <h2 className="text-5xl md:text-6xl lg:text-8xl text-foreground font-extrabold text-center">
                marketing breaks when links break.
              </h2>
            </AnimatedHeadline>
          </NumberedPrinciple>
        </div>
      </section>

      {/* Before/After Comparison Section */}
      <section className="py-32 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <NumberedPrinciple number="10" title="easy to scan">
            <h2 className="text-4xl md:text-5xl text-foreground font-bold text-center mb-4">
              people skim. the value needs to land in 3 seconds.
            </h2>
            <div className="mt-12">
              <BeforeAfterComparison
                beforeImage="/src/assets/screenshots/messy-utms-spreadsheet.png"
                afterImage="/src/assets/screenshots/clean-utm-builder.png"
                caption="from chaos to clarity in one platform"
                beforeLabel="before"
                afterLabel="after"
              />
            </div>
          </NumberedPrinciple>
        </div>
      </section>

      {/* Core Features Section - Glowing Cards */}
      <section className="py-32 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl md:text-4xl text-foreground font-bold">
              why utm.one?
            </h2>
          </div>

          {/* Glowing Feature Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-[1100px] mx-auto">
            <GlowingFeatureCard
              icon={<LinkIcon className="h-7 w-7 text-white" />}
              title="branded short links"
              description="utm.one/summer not bit.ly/x7k2p4"
              glowColor="teal"
              delay={0}
            />
            <GlowingFeatureCard
              icon={<TrendingUp className="h-7 w-7 text-white" />}
              title="perfect UTMs"
              description="every link tracked. every campaign measured."
              glowColor="yellow-green"
              delay={100}
            />
            <GlowingFeatureCard
              icon={<QrCode className="h-7 w-7 text-white" />}
              title="on-brand QR codes"
              description="your colors. your logo. your campaign."
              glowColor="mint"
              delay={200}
            />
            <GlowingFeatureCard
              icon={<BarChart3 className="h-7 w-7 text-white" />}
              title="clear analytics"
              description="see what's working. optimize what's not."
              glowColor="teal"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="py-32 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <NumberedPrinciple number="2" title="custom visuals">
            <h2 className="text-4xl md:text-5xl text-foreground font-bold text-center mb-4">
              see your link performance at a glance.
            </h2>
            <p className="text-xl text-muted-foreground text-center max-w-[640px] mx-auto mb-12">
              $300 sections use stock images. $3k ones feel designed.
            </p>
            <DataFlowVisualization />
          </NumberedPrinciple>
        </div>
      </section>

      {/* Single Benefit Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[640px] mx-auto px-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl text-foreground font-bold tracking-tight">
              One system for every campaign.
            </h2>
            <p className="text-lg text-muted-foreground">
              from link creation to tracking, utm.one keeps your entire marketing workflow clean, consistent, and accurate.
            </p>
          </div>
        </div>
      </section>

      {/* Governance Section - Glowing Cards */}
      <section className="py-40 bg-muted/20">
        <div className="max-w-[900px] mx-auto px-8">
          <NumberedPrinciple number="7" title="emotional clarity">
            <AnimatedHeadline>
              <h2 className="text-5xl md:text-6xl lg:text-8xl text-foreground font-extrabold text-center mb-16">
                simple control for complex teams.
              </h2>
            </AnimatedHeadline>
            
            <div className="grid md:grid-cols-2 gap-6 mt-16">
              <GlowingFeatureCard
                icon={<Shield className="h-7 w-7 text-white" />}
                title="data vault"
                description="your links. your rules. your security."
                glowColor="teal"
                delay={0}
              />
              <GlowingFeatureCard
                icon={<Users className="h-7 w-7 text-white" />}
                title="team access"
                description="super admin, workspace admin, editor, viewer."
                glowColor="yellow-green"
                delay={200}
              />
            </div>
          </NumberedPrinciple>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-[640px] mx-auto px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl text-foreground font-bold">
            start with a cleaner link.
          </h2>
          <Link to="/early-access">
            <Button 
              variant="glow-pink"
              size="lg"
              className="text-[17px] font-medium px-8 h-12 rounded-full hover:scale-[1.02] transition-transform"
              onClick={() => trackCTAClick('bottom')}
            >
              get early access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-muted-foreground">utm.one</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[13px] text-muted-foreground">
                © 2024 utm.one. clarity creates confidence.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
