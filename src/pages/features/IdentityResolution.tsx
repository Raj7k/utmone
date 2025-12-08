import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { ProductMockup } from "@/components/product/ProductMockup";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Users, Clock, Zap } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

const IdentityResolution = () => {
  const faqs = [
    {
      question: "How does Identity Stitching differ from cookies?",
      answer: "Cookies track devices. Identity Stitching tracks people. When a user signs up, we backfill their entire history across all devices and sessions, creating a unified identity graph."
    },
    {
      question: "Does this work without third-party cookies?",
      answer: "Yes. Identity Resolution is 100% first-party. We use deterministic matching (email, user ID) and probabilistic signals (IP + User Agent heuristics) to stitch sessions."
    },
    {
      question: "How far back does Time-Travel Stitching go?",
      answer: "We backfill up to 90 days of anonymous history by default. Enterprise plans can extend this to 365 days or longer with custom retention policies."
    },
    {
      question: "What triggers identity resolution?",
      answer: "Any moment the user identifies: form submission, login, OAuth sign-in, or custom events you send via our tracking pixel or API."
    },
    {
      question: "Is this GDPR compliant?",
      answer: "Yes. Identity Resolution is first-party only. We don't share data between customers. You can delete a user's entire identity graph via our 'Right to be Forgotten' API."
    },
    {
      question: "Can I see which anonymous visitors converted?",
      answer: "Yes. The Journey Timeline shows the full path: Anonymous Visit → Blog → Whitepaper → Sign Up → Sarah@Nike.com. Every step is visible after stitching."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Identity Resolution & Time-Travel Stitching | utm.one"
        description="De-anonymize your traffic. utm.one's Identity Resolution backfills user history the moment they identify, revealing the full journey from first visit to conversion."
        canonical="https://utm.one/features/identity-resolution"
        keywords={['identity resolution', 'user stitching', 'anonymous visitor tracking', 'first-party identity', 'cross-device tracking']}
      />
      <WebPageSchema 
        name="Identity Resolution"
        description="De-anonymize your traffic with Time-Travel Stitching that backfills anonymous visitor history."
        url="https://utm.one/features/identity-resolution"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Features', url: 'https://utm.one/features' },
          { name: 'Identity Resolution', url: 'https://utm.one/features/identity-resolution' }
        ]}
      />

      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter hero-gradient leading-[1.05] lowercase">
              de-anonymize your traffic.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              Time-Travel Stitching remembers that "Anonymous Visitor 582" who read your blog 3 weeks ago is actually Sarah from Nike. When she finally signs up, we backfill her history instantly.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                start stitching identities
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>100% first-party • GDPR compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: The Problem */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <TheMomentStoryCard 
            title="you're flying blind"
            scenario="Standard analytics show 'Anonymous Visitor 582' clicked your blog. Then 'Unknown User' downloaded a whitepaper. Then 'Direct Traffic' signed up. You have no idea these are the same person. When Sarah signs up with sarah@nike.com, we backfill her entire journey instantly."
          />
        </div>
      </section>

      {/* Fold 3: Visual Demonstration */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label mb-6 lowercase">
              how identity stitching works
            </h2>
            <p className="text-xl text-secondary-label max-w-2xl mx-auto">
              Sequential State Estimation in action.
            </p>
          </div>

          <div className="flex justify-center">
            <ProductMockup type="identity-stitching" size="large" />
          </div>
        </div>
      </section>

      {/* Fold 4: Benefits Grid */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-label lowercase">
                2.3x attribution lift
              </h3>
              <p className="text-secondary-label">
                Before: "Direct" drove 40% of signups. After: LinkedIn drove 42%. You finally know what's working.
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-label lowercase">
                instant backfill
              </h3>
              <p className="text-secondary-label">
                The moment a user identifies, we stitch up to 90 days of history. No waiting. No gaps.
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-label lowercase">
                cross-device unity
              </h3>
              <p className="text-secondary-label">
                Mobile visit → Desktop sign-up. We merge both sessions into one unified identity graph.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Fold 5: FAQ */}
      <section className="py-24 md:py-32 bg-muted/20">
        <RoleSpecificFAQ role="identity resolution users" faqs={faqs} />
      </section>

      {/* Fold 6: CTA */}
      <PremiumCTASection 
        headline="stop guessing. start knowing."
        subheadline="Join teams using Identity Resolution to attribute every conversion correctly."
        primaryCTA="get early access"
        secondaryCTA="see demo"
        secondaryCTALink="/early-access"
      />

      <Footer />
    </div>
  );
};

export default IdentityResolution;