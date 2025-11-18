import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, QrCode, BarChart3, Zap, Shield, Globe } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import qrIcon from "@/assets/qr-icon.png";
import linkIcon from "@/assets/link-icon.png";
import analyticsIcon from "@/assets/analytics-icon.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">LinkHub</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Enterprise URL Shortener with <span className="bg-gradient-primary bg-clip-text text-transparent">Built-in Analytics</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Create branded short links, generate QR codes, and track campaign performance—all with comprehensive UTM management for your entire organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">Powerful features for modern marketing teams</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg shadow-lg border border-border hover:shadow-xl transition-shadow">
              <img src={linkIcon} alt="Short Links" className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">Custom Short Links</h3>
              <p className="text-muted-foreground">
                Create branded short URLs on your own domain. Support for multiple domains and custom paths like keka.com/go/campaign.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-lg border border-border hover:shadow-xl transition-shadow">
              <img src={qrIcon} alt="QR Codes" className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">Branded QR Codes</h3>
              <p className="text-muted-foreground">
                Generate beautiful QR codes with your logo and brand colors. Download in multiple formats for print and digital use.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-lg border border-border hover:shadow-xl transition-shadow">
              <img src={analyticsIcon} alt="Analytics" className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Track clicks, devices, locations, and referrers. Roll up data by campaign, source, and medium for comprehensive insights.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-lg border border-border hover:shadow-xl transition-shadow">
              <Zap className="h-16 w-16 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">UTM Builder</h3>
              <p className="text-muted-foreground">
                Built-in UTM parameter builder with templates. Ensure every link has proper campaign tracking for GA4 and your CRM.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-lg border border-border hover:shadow-xl transition-shadow">
              <Shield className="h-16 w-16 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">
                SSO integration, role-based access control, audit logs, and data governance for enterprise compliance.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-lg border border-border hover:shadow-xl transition-shadow">
              <Globe className="h-16 w-16 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Multi-Team Support</h3>
              <p className="text-muted-foreground">
                Organize links by workspaces, folders, and tags. Perfect for marketing, sales, HR, and events teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Transform Your Link Management?
            </h2>
            <p className="text-xl text-white/90">
              Join teams using LinkHub to create, track, and optimize their marketing campaigns.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 LinkHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
