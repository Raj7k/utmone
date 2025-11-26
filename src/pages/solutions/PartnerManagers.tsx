import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link as LinkIcon, QrCode, BarChart3, CheckCircle2, AlertCircle, Layers, Users, DollarSign, TrendingUp, UserPlus } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { GradientHeroBackground, VectorShapes, DiagonalAccent, DotPattern, HeroGlow } from "@/components/solutions/RolePageDecorations";
import { PainPointCard } from "@/components/solutions/PainPointCard";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { WorkflowTimeline } from "@/components/solutions/WorkflowTimeline";

const PartnerManagers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Fold 1: Hero with Gradient */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <GradientHeroBackground variant="orange-teal" />
        <VectorShapes variant="curves" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white leading-[1.1]">
              Clear Attribution, Zero Manual Work
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              partner-specific links. branded qr codes. clean attribution. 
              know exactly which partners drive results—without spreadsheets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/early-access">
                <Button size="lg" className="text-lg px-8 py-6 bg-white text-foreground hover:bg-white/90 transition-all">
                  Get Early Access
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: The Real Pain */}
      <section className="relative py-24 bg-wildSand overflow-hidden">
        <DotPattern />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
              The Real Pain
            </h2>
            <p className="text-xl text-muted-foreground italic">
              Partner managers deserve tools, not templates.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <PainPointCard icon={AlertCircle} text="Spreadsheet tracking" delay={0} />
            <PainPointCard icon={AlertCircle} text="Manual payouts" delay={0.1} />
            <PainPointCard icon={AlertCircle} text="Inconsistent partner links" delay={0.2} />
            <PainPointCard icon={AlertCircle} text="Unreliable attribution" delay={0.3} />
            <PainPointCard icon={AlertCircle} text="Confused partners" delay={0.4} />
            <PainPointCard icon={AlertCircle} text="Broken QR codes" delay={0.5} />
          </div>
        </div>
      </section>

      {/* Fold 3: What You Get */}
      <section className="py-24 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
              What You Get
            </h2>
            <p className="text-xl text-muted-foreground">
              Partners get clarity. You get peace of mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Partner-specific links",
              "QR codes for offline distribution",
              "Clean attribution",
              "Signup + conversion tracking",
              "Payout history",
              "Partner dashboards",
              "One-click reporting",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-deepSea flex-shrink-0 mt-1" strokeWidth={2} />
                <p className="text-lg text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 4: Mapped Features */}
      <section className="py-24 bg-gradient-to-b from-wildSand/50 to-background">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              Built for Partner Teams
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={Users}
              title="Partner Program"
              description="Links + QR + attribution"
              color="blazeOrange"
              delay={0}
            />
            <FeatureMappedCard
              icon={Layers}
              title="Clean-Track"
              description="Every partner follows the same tracking rules"
              color="deepSea"
              delay={0.1}
            />
            <FeatureMappedCard
              icon={BarChart3}
              title="Analytics"
              description="See performance by partner, channel, timeline"
              color="primary"
              delay={0.2}
            />
            <FeatureMappedCard
              icon={QrCode}
              title="QR Generator"
              description="Perfect for events, booths, flyers"
              color="blazeOrange"
              delay={0.3}
            />
            <FeatureMappedCard
              icon={LinkIcon}
              title="Short Links"
              description="Safe, clear, customizable"
              color="deepSea"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Fold 5: Workflow */}
      <section className="py-32 bg-mirage">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white mb-6">
              Your Workflow, Simplified
            </h2>
            <p className="text-xl text-white/70">
              Simple. Transparent. Scalable.
            </p>
          </div>
          
          <WorkflowTimeline
            steps={[
              { icon: UserPlus, label: "Invite" },
              { icon: LinkIcon, label: "Assign Link" },
              { icon: TrendingUp, label: "Track" },
              { icon: DollarSign, label: "Payout" },
            ]}
          />
        </div>
      </section>

      {/* Fold 6: CTA */}
      <section className="py-32 bg-gradient-to-br from-blazeOrange/10 to-deepSea/10">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              Ready to Scale Your Partner Program?
            </h2>
            <p className="text-xl text-muted-foreground max-w-[640px] mx-auto">
              Join partner teams who trust utm.one for clear attribution and zero manual work.
            </p>
            <div className="pt-4">
              <Link to="/early-access">
                <Button size="lg" className="bg-blazeOrange hover:bg-blazeOrange/90 text-white text-[17px] font-medium px-8 h-12 rounded-full transition-all hover:scale-[1.02]">
                  Explore utm.one for Partner Teams
                  <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerManagers;
