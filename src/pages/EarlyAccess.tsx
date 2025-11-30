import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/magnetic";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { WhitespaceAdvantageCard } from "@/components/early-access/WhitespaceAdvantageCard";
import { OnboardingTimeline } from "@/components/early-access/OnboardingTimeline";
import { TrustNarrativeCard } from "@/components/early-access/TrustNarrativeCard";
import { PublicLeaderboard } from "@/components/early-access/PublicLeaderboard";
import { SocialProofStats } from "@/components/early-access/SocialProofStats";
import { DiagonalLines, FloatingShapes, GridOverlay, GradientDivider } from "@/components/early-access/EarlyAccessDecorations";
import { EarlyAccessStepForm } from "@/components/early-access/EarlyAccessStepForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Sparkles, Shield, Zap, Users, Code, Building2, BarChart3, Clock, Trophy } from "lucide-react";
import { useTrackPageView } from "@/hooks/useWaitlistEngagement";
import { getOrCreateEarlyAccessVariant } from "@/lib/heroVariants";
import { useQuery } from "@tanstack/react-query";

const BenefitItem = ({ icon: Icon, title, description, delay = 0 }: { 
  icon: any; 
  title: string; 
  description: string; 
  delay?: number;
}) => (
  <AnimatedHeadline delay={delay}>
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-display font-semibold mb-1">{title}</h2>
        <p className="text-base text-secondary-label">{description}</p>
      </div>
    </div>
  </AnimatedHeadline>
);

const AudienceItem = ({ icon: Icon, label, delay = 0, color = "primary" }: { 
  icon: any; 
  label: string; 
  delay?: number;
  color?: string;
}) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary hover:border-primary/30",
    blazeOrange: "bg-blazeOrange/10 text-blazeOrange hover:border-blazeOrange/30",
    deepSea: "bg-deepSea/10 text-deepSea hover:border-deepSea/30",
  };

  const iconColorClasses = {
    primary: "text-primary",
    blazeOrange: "text-blazeOrange",
    deepSea: "text-deepSea",
  };

  return (
    <AnimatedHeadline delay={delay}>
      <div className={`flex items-center gap-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-border/50 hover:shadow-md transition-all duration-300 group ${colorClasses[color as keyof typeof colorClasses]}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className={`w-6 h-6 ${iconColorClasses[color as keyof typeof iconColorClasses]}`} />
        </div>
        <span className="text-base font-medium text-foreground">{label}</span>
      </div>
    </AnimatedHeadline>
  );
};

export default function EarlyAccess() {
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [heroVariant, setHeroVariant] = useState(getOrCreateEarlyAccessVariant());
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const prefillEmail = searchParams.get('email');
  const refCode = searchParams.get('ref');

  // Engagement tracking
  useTrackPageView('/early-access');

  // Fetch referrer info if ref code exists
  useEffect(() => {
    if (refCode) {
      fetchReferrerInfo(refCode);
    }
  }, [refCode]);

  const fetchReferrerInfo = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('early_access_requests')
        .select('name')
        .eq('referral_code', code)
        .single();
      
      if (!error && data) {
        setReferrerName(data.name);
      }
    } catch (error) {
      console.error('Error fetching referrer:', error);
    }
  };

  // Fetch waitlist stats for FOMO counter using edge function (bypasses RLS)
  const { data: stats } = useQuery({
    queryKey: ["waitlist-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-waitlist-stats");
      if (error) {
        console.error("Error fetching waitlist stats:", error);
        return { total: 0 };
      }
      return { total: data?.totalCount || 0 };
    },
  });

  const handleSuccess = (data: { id: string; referral_code: string }) => {
    setReferralCode(data.referral_code);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Get Early Access"
        description="Join the early circle for utm.one — the cleanest way to manage links, UTMs, QR codes, and analytics. Request early access to transform your campaign tracking."
        canonical="https://utm.one/early-access"
        keywords={['early access', 'utm tracking', 'link management', 'QR codes', 'campaign analytics', 'UTM builder']}
      />
      <Navigation />
      <FloatingNavigation />
      {/* FOLD 1 - Hero (A/B tested) */}
      <section className="relative bg-white py-24 md:py-32 px-6 overflow-hidden">
        <DiagonalLines />
        <div className="hero-glow" />
        <div className="max-w-[900px] mx-auto text-center relative z-10">
          <AnimatedHeadline>
            <h1 className="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl mb-8 tracking-tighter hero-gradient leading-[1.05]">
              {heroVariant.headline}
            </h1>
          </AnimatedHeadline>
          <AnimatedHeadline delay={200}>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
              {heroVariant.subheadline}
            </p>
          </AnimatedHeadline>
          <AnimatedHeadline delay={300}>
            <MagneticButton 
              size="lg" 
              className="rounded-full px-10 py-7 text-lg shadow-lg hover:shadow-xl bg-blazeOrange hover:bg-blazeOrange/90 text-white font-bold"
              onClick={() => {
                document.getElementById('early-access-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              strength={0.25}
            >
              {heroVariant.cta}
            </MagneticButton>
            <p className="text-sm text-muted-foreground/70 mt-4">
              {heroVariant.microcopy}
            </p>
          </AnimatedHeadline>
          
          {/* FOMO Counter */}
          <AnimatedHeadline delay={400}>
            <a 
              href="#leaderboard"
              className="inline-block mt-6 text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#leaderboard')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="font-bold text-foreground">
                {stats?.total && stats.total >= 1000 
                  ? `${Math.floor(stats.total / 1000)}K+` 
                  : stats?.total || 0} waiting
              </span> • <span className="underline">see where you stand</span>
            </a>
          </AnimatedHeadline>
        </div>
        {/* Hero glow effect - brand colors */}
        <div className="absolute inset-0 bg-gradient-radial from-blazeOrange/10 via-transparent to-transparent opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-wildSand to-transparent pointer-events-none" />
      </section>

      {/* Stats Bar */}
      <SocialProofStats />

      <GradientDivider />

      {/* FOLD 2 - Why Early Access Exists */}
      <section className="bg-muted/20 py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-deepSea/10 text-deepSea text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              limited availability
            </div>
            <AnimatedHeadline>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
                we want the right people in first
              </h2>
            </AnimatedHeadline>
          </div>
          
          <AnimatedHeadline delay={100}>
            <p className="text-xl md:text-2xl text-muted-foreground text-center mb-12">
              utm.one is built for teams who
            </p>
          </AnimatedHeadline>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              "value clarity",
              "care about tracking hygiene",
              "want safer links",
              "need better attribution",
              "believe trust should be part of every click"
            ].map((value, index) => (
              <AnimatedHeadline key={index} delay={150 + index * 50}>
                <div className="text-center">
                  <p className="text-lg text-label">{value}</p>
                </div>
              </AnimatedHeadline>
            ))}
          </div>
          
          <AnimatedHeadline delay={500}>
            <p className="text-lg text-secondary-label text-center">
              the early access program helps us onboard these teams thoughtfully.
            </p>
          </AnimatedHeadline>
        </div>
      </section>

      <GradientDivider />

      {/* FOLD 3 - What You Get (gray background with icons) */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-[1000px] mx-auto">
          <AnimatedHeadline>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-16 text-center tracking-tight">
              you get more than a login
            </h2>
          </AnimatedHeadline>
          
          <div className="space-y-8">
            <BenefitItem
              icon={Sparkles}
              title="priority access"
              description="first to try new features"
              delay={0}
            />
            <BenefitItem
              icon={Shield}
              title="governed onboarding"
              description="we set your naming rules & clean-track foundations"
              delay={100}
            />
            <BenefitItem
              icon={Zap}
              title="private roadmap previews"
              description="see what's coming before anyone else"
              delay={200}
            />
            <BenefitItem
              icon={Users}
              title="direct product influence"
              description="your feedback shapes our priorities"
              delay={300}
            />
            <BenefitItem
              icon={CheckCircle2}
              title="founding member badge"
              description="visible on your workspace"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* FOLD 4 - Whitespace Advantage (split screen) */}
      <WhitespaceAdvantageCard />

      {/* FOLD 5 - Onboarding Flow (vertical timeline) */}
      <OnboardingTimeline />

      {/* FOLD 6 - Trust Narrative (soft gradient card) */}
      <TrustNarrativeCard />

      <GradientDivider />

      {/* Referral Leaderboard */}
      <PublicLeaderboard />

      <GradientDivider />

      {/* FOLD 7 - Who This Is For (audience grid) */}
      <section className="bg-muted/20 py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-[800px] mx-auto relative z-10">
          <AnimatedHeadline>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-16 text-center tracking-tight">
              who this is for
            </h2>
          </AnimatedHeadline>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <AudienceItem 
              icon={Users} 
              label="marketing teams who need governance" 
              delay={0}
              color="blazeOrange"
            />
            <AudienceItem 
              icon={Zap} 
              label="sales teams who need speed" 
              delay={50}
              color="deepSea"
            />
            <AudienceItem 
              icon={Shield} 
              label="compliance-focused organizations" 
              delay={100}
              color="primary"
            />
            <AudienceItem 
              icon={BarChart3} 
              label="data teams who need clean UTMs" 
              delay={150}
              color="blazeOrange"
            />
            <AudienceItem 
              icon={CheckCircle2} 
              label="agencies managing multiple clients" 
              delay={200}
              color="deepSea"
            />
            <AudienceItem 
              icon={Clock} 
              label="teams tired of broken links" 
              delay={250}
              color="primary"
            />
          </div>
          
          <AnimatedHeadline delay={350}>
            <p className="text-lg text-muted-foreground text-center mb-4">
              anyone who is tired of cleaning data at the end
            </p>
            <p className="text-xl text-foreground text-center font-semibold">
              if you care about clarity, you'll feel at home here.
            </p>
          </AnimatedHeadline>
        </div>
      </section>

      {/* FOLD 8 - Final CTA with Comprehensive Form */}
      <section id="early-access-form" className="bg-white py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-[680px] mx-auto">
          {!isSubmitted ? (
            <>
              {/* Referral Banner */}
              {referrerName && (
                <AnimatedHeadline>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-green-600" />
                      <p className="font-semibold text-green-900">
                        you've been invited by {referrerName}
                      </p>
                    </div>
                    <p className="text-sm text-green-700">
                      join now to get <strong>1 month of Pro free</strong> when we launch
                    </p>
                  </div>
                </AnimatedHeadline>
              )}
              
              <AnimatedHeadline>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 text-center tracking-tight text-muted-foreground">
                  join the early circle
                </h2>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-12 text-center tracking-tight">
                  be among the first to use utm.one
                </h1>
              </AnimatedHeadline>
              
              <AnimatedHeadline delay={200}>
                <EarlyAccessStepForm onSuccess={handleSuccess} prefillEmail={prefillEmail} />
              </AnimatedHeadline>
            </>
          ) : (
            <AnimatedHeadline>
              <div className="text-center space-y-6 py-12">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
                <h2 className="text-3xl md:text-4xl font-display font-bold">
                  thanks — we'll reach out soon.
                </h2>
                <p className="text-lg text-secondary-label">
                  your request has been received. we'll be in touch when a spot opens.
                </p>
                {referralCode && (
                  <div className="mt-8 p-6 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">share your referral link</p>
                    <code className="text-sm bg-white px-4 py-2 rounded border">
                      {window.location.origin}/early-access?ref={referralCode}
                    </code>
                  </div>
                )}
              </div>
            </AnimatedHeadline>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
