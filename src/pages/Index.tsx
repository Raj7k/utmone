import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Link as LinkIcon, 
  QrCode, 
  BarChart3, 
  Zap, 
  Shield, 
  ArrowRight,
} from "lucide-react";
import { HeroVariantManager } from "@/components/landing/HeroVariantManager";
import { Navigation } from "@/components/landing/Navigation";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
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
                  <Link to="/auth">
                    <Button 
                      size="lg" 
                      variant="gradient"
                      className="text-[17px] font-medium px-8 h-12 rounded-full hover:scale-[1.02]"
                      onClick={() => trackCTAClick('hero-primary')}
                    >
                      {variant.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </HeroVariantManager>

      {/* Problem Section */}
      <section className="py-40 bg-muted/20">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center space-y-12">
            <AnimatedHeadline>
              <h2 className="text-5xl md:text-6xl lg:text-8xl text-foreground font-extrabold tracking-tight leading-[1.05]">
                Marketing breaks when links break.
              </h2>
            </AnimatedHeadline>
            <div className="text-xl md:text-2xl text-muted-foreground max-w-[900px] mx-auto leading-relaxed space-y-6">
              <p>bad utms. scattered tools. random short links.</p>
              <p>none of this should be normal.</p>
              <p className="text-foreground font-medium">utm.one replaces the chaos with a single, clean workflow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-32 bg-white" id="features">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl text-foreground font-bold tracking-tight">
              The foundation of accurate marketing.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 max-w-[980px] mx-auto">
            {/* Branded Short Links */}
            <div className="bg-white border border-border rounded-2xl p-12 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group hover:border-accent-teal/30">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-gradient-nature-1 transition-all">
                  <LinkIcon className="h-7 w-7 text-primary group-hover:text-accent-forest" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-h3 text-foreground font-semibold">
                    branded short links
                  </h3>
                  <p className="text-body text-muted-foreground mt-2">
                    your domain. your trust.
                  </p>
                </div>
              </div>
            </div>

            {/* 5-UTM Builder */}
            <div className="bg-white border border-border rounded-2xl p-12 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group hover:border-accent-yellow-green/30">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center group-hover:bg-gradient-nature-2 transition-all">
                  <Zap className="h-7 w-7 text-secondary group-hover:text-accent-forest" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-h3 text-foreground font-semibold">
                    airtight utms
                  </h3>
                  <p className="text-body text-muted-foreground mt-2">
                    consistent by default.
                  </p>
                </div>
              </div>
            </div>

            {/* Branded QR Generator */}
            <div className="bg-white border border-border rounded-2xl p-12 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group hover:border-accent-teal/30">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-gradient-nature-3 transition-all">
                  <QrCode className="h-7 w-7 text-accent group-hover:text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-h3 text-foreground font-semibold">
                    simple qr codes
                  </h3>
                  <p className="text-body text-muted-foreground mt-2">
                    beautiful. on brand. ready to use.
                  </p>
                </div>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="bg-white border border-border rounded-2xl p-12 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group hover:border-accent-mint/30">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-gradient-nature-1 transition-all">
                  <BarChart3 className="h-7 w-7 text-primary group-hover:text-accent-forest" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-h3 text-foreground font-semibold">
                    clear analytics
                  </h3>
                  <p className="text-body text-muted-foreground mt-2">
                    see what matters. ignore the noise.
                  </p>
                </div>
              </div>
            </div>
          </div>
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

      {/* Governance Section */}
      <section className="py-40 bg-muted/20">
        <div className="max-w-[900px] mx-auto px-8">
          <div className="text-center space-y-12">
            <AnimatedHeadline delay={100}>
              <h2 className="text-5xl md:text-6xl lg:text-8xl text-foreground font-extrabold tracking-tight leading-[1.05]">
                Simple control for complex teams.
              </h2>
            </AnimatedHeadline>
            <div className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed space-y-8">
              <p className="text-foreground font-medium">define domains. set rules. assign roles.</p>
              
              <p>super admin, workspace admin, editor, viewer.</p>
              
              <p>everyone sees exactly what they need.</p>
            </div>
          </div>
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
