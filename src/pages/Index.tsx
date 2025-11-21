import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Link as LinkIcon, 
  QrCode, 
  BarChart3, 
  Zap, 
  Shield, 
  Globe,
  XCircle,
  Sparkles,
  Users,
  Code,
  ArrowRight,
  Check
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">utm.one</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#solutions" className="text-sm font-medium hover:text-primary transition-colors">Solutions</a>
              <a href="#integrations" className="text-sm font-medium hover:text-primary transition-colors">Integrations</a>
              <Link to="/docs" className="text-sm font-medium hover:text-primary transition-colors">Docs</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-primary hover:bg-primary/90">Get Early Access</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <HeroVariantManager>
        {(variant) => (
          <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-br from-background via-background to-muted/30">
            <div className="container relative mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Badge variant="secondary" className="mb-4">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Stop fighting with 7 tools. Start with one.
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                  {variant.headline}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  {variant.subheadline}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link to="/auth">
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90 text-lg px-8 h-12"
                      onClick={() => trackCTAClick('hero-primary')}
                    >
                      {variant.cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 h-12"
                    onClick={() => trackCTAClick('hero-secondary')}
                  >
                    Watch Demo
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {variant.microcopy}
                </p>
              </div>
            </div>
          </section>
        )}
      </HeroVariantManager>

      {/* The Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 lowercase">
              marketing breaks when links break.
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              bad utms. scattered tools. random short links. missing data.
              <br />
              <br />
              none of this should be normal.
              <br />
              <br />
              utm.one replaces the chaos with a single, clean workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Core Product Blocks */}
      <section className="py-24 bg-background" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 lowercase">the foundation of accurate marketing.</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Branded Short Links */}
            <div className="bg-card p-8 rounded-xl border border-border hover:shadow-xl transition-all hover:border-primary/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <LinkIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 lowercase">branded short links</h3>
                  <p className="text-lg text-muted-foreground lowercase">
                    your domain. your trust.
                  </p>
                </div>
              </div>
            </div>

            {/* 5-UTM Builder */}
            <div className="bg-card p-8 rounded-xl border border-border hover:shadow-xl transition-all hover:border-accent/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 lowercase">airtight utms</h3>
                  <p className="text-lg text-muted-foreground lowercase">
                    consistent by default.
                  </p>
                </div>
              </div>
            </div>

            {/* Branded QR Generator */}
            <div className="bg-card p-8 rounded-xl border border-border hover:shadow-xl transition-all hover:border-secondary/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <QrCode className="h-8 w-8 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 lowercase">simple qr codes</h3>
                  <p className="text-lg text-muted-foreground lowercase">
                    beautiful. on brand. ready to use.
                  </p>
                </div>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="bg-card p-8 rounded-xl border border-border hover:shadow-xl transition-all hover:border-primary/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 lowercase">clear analytics</h3>
                  <p className="text-lg text-muted-foreground lowercase">
                    see what matters. ignore the noise.
                  </p>
                </div>
              </div>
            </div>

            {/* Enterprise Governance */}
            <div className="bg-card p-8 rounded-xl border border-border hover:shadow-xl transition-all lg:col-span-2 hover:border-accent/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 lowercase">enterprise control</h3>
                  <p className="text-lg text-muted-foreground lowercase">
                    roles, sso, audit — everything in place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Single Benefit Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold lowercase">
              one system for every campaign.
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed lowercase">
              from link creation to tracking, utm.one keeps your entire marketing workflow clean, consistent, and accurate.
              <br />
              <br />
              no hacks. no spreadsheets. nothing to fix later.
            </p>
          </div>
        </div>
      </section>

      {/* Role-Based Teaser Section */}
      <section className="py-20 bg-background" id="solutions">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 lowercase">built for every team.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 lowercase">marketing</h3>
              <p className="text-muted-foreground lowercase">
                create campaigns with perfect utms.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-all hover:border-accent/50 cursor-pointer group">
              <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4 group-hover:bg-accent/20 transition-colors">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2 lowercase">sales</h3>
              <p className="text-muted-foreground lowercase">
                share clean links without the setup.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-all hover:border-secondary/50 cursor-pointer group">
              <div className="p-3 bg-secondary/10 rounded-lg w-fit mb-4 group-hover:bg-secondary/20 transition-colors">
                <Shield className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2 lowercase">ops</h3>
              <p className="text-muted-foreground lowercase">
                govern domains, rules, and templates.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 lowercase">developers</h3>
              <p className="text-muted-foreground lowercase">
                integrate links and analytics with a clean api.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Governance Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold lowercase">
              simple control for complex teams.
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed lowercase">
              define domains. set rules. assign roles.
              <br />
              <br />
              super admin, workspace admin, editor, viewer.
              <br />
              <br />
              everyone sees exactly what they need.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-background" id="integrations">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 lowercase">
              works with what you already use.
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground lowercase">
              ga4, hubspot, salesforce, slack, sso, webhooks.
              <br />
              <br />
              everything connects. nothing breaks.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-5xl mx-auto items-center">
            <div className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <div className="w-20 h-20 bg-card rounded-lg border border-border flex items-center justify-center">
                <Globe className="h-10 w-10" />
              </div>
              <span className="text-sm font-medium">Google Analytics 4</span>
            </div>

            <div className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <div className="w-20 h-20 bg-card rounded-lg border border-border flex items-center justify-center">
                <Users className="h-10 w-10" />
              </div>
              <span className="text-sm font-medium">HubSpot</span>
            </div>

            <div className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <div className="w-20 h-20 bg-card rounded-lg border border-border flex items-center justify-center">
                <BarChart3 className="h-10 w-10" />
              </div>
              <span className="text-sm font-medium">Salesforce</span>
            </div>

            <div className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <div className="w-20 h-20 bg-card rounded-lg border border-border flex items-center justify-center">
                <Zap className="h-10 w-10" />
              </div>
              <span className="text-sm font-medium">Slack</span>
            </div>

            <div className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <div className="w-20 h-20 bg-card rounded-lg border border-border flex items-center justify-center">
                <Code className="h-10 w-10" />
              </div>
              <span className="text-sm font-medium">Webhooks</span>
            </div>

            <div className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <div className="w-20 h-20 bg-card rounded-lg border border-border flex items-center justify-center">
                <Sparkles className="h-10 w-10" />
              </div>
              <span className="text-sm font-medium text-center">+ More Coming</span>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Need a custom integration?</p>
            <Button variant="outline">View API Documentation</Button>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need. Nothing You Don't.</h2>
            <p className="text-xl text-muted-foreground">Comprehensive features for enterprise link management</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-card p-6 rounded-lg border border-border">
              <LinkIcon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold mb-2">Custom Domains</h3>
              <p className="text-sm text-muted-foreground">Add your own domains with DNS verification</p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <Users className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-bold mb-2">Multi-Workspace</h3>
              <p className="text-sm text-muted-foreground">Organize by teams, departments, or campaigns</p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <Zap className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-bold mb-2">UTM Templates</h3>
              <p className="text-sm text-muted-foreground">Pre-built templates for every marketing channel</p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <QrCode className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold mb-2">QR Styling</h3>
              <p className="text-sm text-muted-foreground">Colors, logos, frames for perfect brand match</p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <BarChart3 className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-bold mb-2">Advanced Analytics</h3>
              <p className="text-sm text-muted-foreground">Campaign rollups, geo data, device breakdown</p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <Code className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-bold mb-2">REST API</h3>
              <p className="text-sm text-muted-foreground">Programmatic link creation and management</p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold mb-2">Audit Logs</h3>
              <p className="text-sm text-muted-foreground">Track every change with full audit trail</p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <Globe className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-bold mb-2">Link Expiry</h3>
              <p className="text-sm text-muted-foreground">Time-based or click-based expiration rules</p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <Sparkles className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-bold mb-2">Bulk Import</h3>
              <p className="text-sm text-muted-foreground">CSV upload for migrating existing links</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof (Placeholder) */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Marketing Teams</h2>
            <p className="text-xl text-muted-foreground">Join 500+ teams on the early access waitlist</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-xl border border-border text-center">
              <p className="text-lg text-muted-foreground italic mb-4">
                "We were using 7 different tools to manage our links, QR codes, and UTM tracking. utm.one consolidates everything into one powerful platform. Game changer for our marketing ops team."
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Marketing Leader</p>
                  <p className="text-sm text-muted-foreground">Early Access Beta Tester</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white lowercase">
              start with a cleaner link.
            </h2>
            <p className="text-xl md:text-2xl text-white/90 lowercase">
              and watch your entire marketing stack fall into place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8 h-12 lowercase"
                  onClick={() => trackCTAClick('final-cta-primary')}
                >
                  get early access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 lowercase"
                onClick={() => trackCTAClick('final-cta-secondary')}
              >
                watch demo
              </Button>
            </div>
            <p className="text-white/80 text-sm">
              No credit card required · Early access pricing available · Priority support
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <LinkIcon className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">utm.one</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enterprise URL shortener with branded QR codes and built-in analytics.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#integrations" className="hover:text-primary transition-colors">Integrations</a></li>
                <li><a href="/pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="/docs" className="hover:text-primary transition-colors">API Docs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3">Solutions</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/for-marketers" className="hover:text-primary transition-colors">For Marketers</a></li>
                <li><a href="/for-sales" className="hover:text-primary transition-colors">For Sales</a></li>
                <li><a href="/for-ops" className="hover:text-primary transition-colors">For Ops & Admins</a></li>
                <li><a href="/for-developers" className="hover:text-primary transition-colors">For Developers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="/blog" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                &copy; 2025 utm.one. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
                <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
                <a href="/security" className="hover:text-primary transition-colors">Security</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
