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
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-8 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-[17px] font-semibold tracking-tight text-foreground">
                utm.one
              </span>
            </Link>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a 
                href="#features" 
                className="text-[14px] font-medium text-foreground/70 hover:text-foreground transition-apple"
              >
                Features
              </a>
              <Link 
                to="/pricing" 
                className="text-[14px] font-medium text-foreground/70 hover:text-foreground transition-apple"
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className="text-[14px] font-medium text-foreground/70 hover:text-foreground transition-apple"
              >
                About
              </Link>
              <Link 
                to="/docs" 
                className="text-[14px] font-medium text-foreground/70 hover:text-foreground transition-apple"
              >
                Docs
              </Link>
            </div>

            {/* Right Side CTAs */}
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button 
                  variant="ghost" 
                  className="text-[14px] font-medium text-foreground/80 hover:text-foreground hover:bg-transparent px-3"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/auth">
                <Button 
                  size="default"
                  className="bg-foreground hover:bg-foreground/90 text-background text-[14px] font-medium px-6 h-10 rounded-full transition-apple hover:scale-[1.02] hidden sm:flex"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

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
                      className="bg-foreground hover:bg-foreground/90 text-background text-[17px] font-medium px-8 h-12 rounded-full transition-apple hover:scale-[1.02]"
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
      <section className="py-24 bg-muted/30">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <h2 className="text-h2 text-foreground font-bold tracking-tight">
              Marketing Breaks When Links Break.
            </h2>
            <p className="text-body text-muted-foreground max-w-[720px] mx-auto">
              bad utms. scattered tools. random short links. missing data.
              <br /><br />
              none of this should be normal.
              <br /><br />
              utm.one replaces the chaos with a single, clean workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 bg-white" id="features">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-h2 text-foreground font-bold tracking-tight">
              The Foundation Of Accurate Marketing.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 max-w-[980px] mx-auto">
            {/* Branded Short Links */}
            <div className="bg-white border border-border rounded-2xl p-12 hover:shadow-apple-lg transition-apple">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center">
                  <LinkIcon className="h-6 w-6 text-foreground" strokeWidth={2} />
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
            <div className="bg-white border border-border rounded-2xl p-12 hover:shadow-apple-lg transition-apple">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-foreground" strokeWidth={2} />
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
            <div className="bg-white border border-border rounded-2xl p-12 hover:shadow-apple-lg transition-apple">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-foreground" strokeWidth={2} />
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
            <div className="bg-white border border-border rounded-2xl p-12 hover:shadow-apple-lg transition-apple">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-foreground" strokeWidth={2} />
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
      <section className="py-24 bg-muted/30">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <h2 className="text-h2 text-foreground font-bold tracking-tight">
              One System For Every Campaign.
            </h2>
            <p className="text-body text-muted-foreground max-w-[720px] mx-auto">
              from link creation to tracking, utm.one keeps your entire marketing workflow clean, consistent, and accurate.
              <br /><br />
              no hacks. no spreadsheets. nothing to fix later.
            </p>
          </div>
        </div>
      </section>

      {/* Governance Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <h2 className="text-h2 text-foreground font-bold tracking-tight">
              Simple Control For Complex Teams.
            </h2>
            <p className="text-body text-muted-foreground max-w-[720px] mx-auto">
              define domains. set rules. assign roles.
              <br /><br />
              super admin, workspace admin, editor, viewer.
              <br /><br />
              everyone sees exactly what they need.
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise Control */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="bg-white border border-border rounded-3xl p-16 text-center shadow-apple">
            <div className="max-w-[640px] mx-auto space-y-6">
              <div className="w-16 h-16 bg-foreground/5 rounded-3xl flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-foreground" strokeWidth={2} />
              </div>
              <h3 className="text-h3 text-foreground font-semibold">
                enterprise control
              </h3>
              <p className="text-body text-muted-foreground">
                roles, sso, audit — everything in place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <h2 className="text-h1 text-foreground font-bold tracking-tight">
              Start With A Cleaner Link.
            </h2>
            <p className="text-body text-muted-foreground max-w-[480px] mx-auto">
              clarity creates confidence.
            </p>
            <div className="pt-4">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  className="bg-foreground hover:bg-foreground/90 text-background text-[17px] font-medium px-8 h-12 rounded-full transition-apple hover:scale-[1.02]"
                  onClick={() => trackCTAClick('footer-cta')}
                >
                  get early access
                  <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
                </Button>
              </Link>
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
