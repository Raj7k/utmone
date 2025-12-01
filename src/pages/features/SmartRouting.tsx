import { FeatureLayout } from "@/components/features/FeatureLayout";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { SocialProofCounter } from "@/components/growth/SocialProofCounter";
import { HorrorStorySection } from "@/components/solutions/HorrorStorySection";
import { PersonaCalloutCards } from "@/components/solutions/PersonaCalloutCards";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { RoutingMapPreview } from "@/components/features/RoutingMapPreview";
import { UseCasesGrid } from "@/components/features/UseCasesGrid";
import { Zap, Users, Code, Globe, Smartphone, Target, GitBranch, MapPin } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

export default function SmartRouting() {
  const useCases = [
    {
      title: "Localized pricing by country",
      scenario: "Your LinkedIn ad targets US enterprises. It goes viral in India. 10,000 clicks. Zero conversions. Why? They all landed on your USD pricing page.",
      solution: "Smart Routing: US visitors → /pricing-usd, India visitors → /pricing-inr, EU visitors → /pricing-eur. Conversion rate jumps 300%."
    },
    {
      title: "App store routing by device",
      scenario: "You're promoting your mobile app on social media. iOS users click and see Android Play Store link. They bounce. You paid $2 per click for nothing.",
      solution: "Smart Routing: iOS users → App Store, Android users → Play Store, Desktop users → Web signup page. Install rate increases 5x."
    },
    {
      title: "Language-specific landing pages",
      scenario: "Your EU campaign sends Spanish visitors to English landing pages. They can't understand your value prop. They leave immediately.",
      solution: "Smart Routing: ES visitors → /es, FR visitors → /fr, DE visitors → /de. Engagement time increases from 8 seconds to 3 minutes."
    },
    {
      title: "A/B testing by region",
      scenario: "You want to test two landing pages but don't want to confuse users. You need clean regional splits.",
      solution: "Smart Routing: US East → Landing A, US West → Landing B, track conversion rates by region. Clear winner emerges in 2 weeks."
    }
  ];

  const faqs = [
    {
      question: "How does geo-targeting work?",
      answer: "utm.one reads the visitor's country from their IP address (via Cloudflare headers) and routes them to the destination you've configured for that country. If no country-specific rule exists, they go to the default destination. Accuracy: 99%+ for country-level, 90%+ for city-level."
    },
    {
      question: "Can I A/B test different landing pages by country?",
      answer: "Yes. Set up different destinations for different countries, then track conversion rates by country to see which landing page performs best in each market. You can even run country-specific experiments with traffic split: US → 50% Page A, 50% Page B."
    },
    {
      question: "What if I want to route by device (mobile vs desktop)?",
      answer: "Smart Routing can route based on device type, OS, browser, or any combination. For example: iOS users → App Store, Android users → Play Store, Desktop users → Web version. Rules stack: 'US + iOS → App Store US' vs 'UK + iOS → App Store UK'."
    },
    {
      question: "Can I route based on time of day or day of week?",
      answer: "Yes. Set up time-based rules: 'Weekday 9am-5pm → Sales landing page' vs 'Weekend → Self-service signup page'. Or seasonal rules: 'Nov 20-30 → Black Friday landing page'."
    },
    {
      question: "What happens if a rule fails or the destination is down?",
      answer: "Smart Routing includes automatic fallback: Primary rule fails → Try fallback destination → If that fails → Go to default URL. Your links never break, even when specific destinations go down."
    },
    {
      question: "Can I route based on UTM parameters?",
      answer: "Yes. Route based on utm_source, utm_medium, utm_campaign, or any combination. Example: 'utm_source=linkedin + US → /enterprise-demo' vs 'utm_source=linkedin + India → /startup-trial'."
    },
    {
      question: "Does routing affect my analytics?",
      answer: "No. All routing logic happens server-side before the redirect. Analytics still capture the original click, destination, device, and geo data. You see exactly which routing rule was applied in your reports."
    },
    {
      question: "Can I use Smart Routing for affiliate programs?",
      answer: "Yes. Route by referrer or utm_content to send different affiliates to different landing pages with their unique tracking parameters preserved. Example: 'Affiliate A → /landing-a?ref=affiliateA' vs 'Affiliate B → /landing-b?ref=affiliateB'."
    }
  ];

  return (
    <FeatureLayout
      title="Smart Routing - One Link. Infinite Destinations."
      description="Sending US visitors to a UK pricing page? That's lost revenue. utm.one routes visitors to the right destination based on location, device, and behavior."
      canonical="https://utm.one/features/smart-routing"
      keywords={["smart routing", "geo targeting", "adaptive routing", "contextual routing"]}
      breadcrumbs={[
        { name: 'Home', url: 'https://utm.one' },
        { name: 'Features', url: 'https://utm.one/features' },
        { name: 'Smart Routing', url: 'https://utm.one/features/smart-routing' }
      ]}
    >
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        <div className="relative max-w-[980px] mx-auto px-8 z-10 text-center">
          <SocialProofCounter variant="minimal" />
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold hero-gradient lowercase mt-8 mb-6">
            one link. infinite destinations.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            sending US visitors to a UK pricing page? that's lost revenue. utm.one routes visitors to the right destination based on location, device, and behavior.
          </p>
          <CTAButton href="/early-access" variant="primary" pulse>get early access</CTAButton>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <HorrorStorySection
            title="your campaign goes viral... in the wrong country"
            description="Your LinkedIn ad targets US enterprises. It goes viral in India. 10,000 clicks. Zero conversions. Why? They all landed on your USD pricing page with US-only payment options. You just wasted $15K showing the wrong page to the wrong audience."
            stats={[
              { label: "Wasted clicks", value: "10K" },
              { label: "Ad spend lost", value: "$15K" },
              { label: "Conversion rate", value: "0%" }
            ]}
          />
        </div>
      </section>

      {/* Visual Routing Preview */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <RoutingMapPreview />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">how smart routing works</h2>
            <p className="text-xl text-muted-foreground">one link adapts to every visitor</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { num: "1", text: "User clicks link", icon: Target },
              { num: "2", text: "System reads location, device, OS", icon: MapPin },
              { num: "3", text: "Algorithm scores each destination", icon: GitBranch },
              { num: "4", text: "Routes to best match", icon: Zap }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 font-bold text-xl">{step.num}</div>
                <step.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>

          {/* Routing Rules Examples */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-display font-semibold lowercase">geo routing</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Route by country, region, or city to show localized content.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Example:</span> US → /en-us/pricing, UK → /en-gb/pricing, France → /fr/tarifs
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-display font-semibold lowercase">device routing</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Route by device type, OS, or browser for optimal experience.
              </p>
              <div className="bg-primary/10 rounded-lg p-4 text-sm">
                <span className="font-semibold text-primary">Example:</span> iOS → App Store, Android → Play Store, Desktop → Web app
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <GitBranch className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-display font-semibold lowercase">conditional routing</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Combine multiple conditions for precise targeting.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Example:</span> US + Mobile + Weekday → /enterprise-demo, US + Desktop + Weekend → /self-serve
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">real use cases</h2>
            <p className="text-xl text-muted-foreground">problems we actually solve</p>
          </div>
          <UseCasesGrid useCases={useCases} />
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">advanced routing features</h2>
            <p className="text-xl text-muted-foreground">go beyond simple geo-targeting</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border-2 border-border rounded-xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-display font-bold lowercase">traffic splitting</h3>
              </div>
              <p className="text-muted-foreground mb-4">Route 50% of US traffic to Page A, 50% to Page B for clean A/B testing.</p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm">
                <p className="font-semibold text-foreground mb-2">A/B test example:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• US East → Landing A (50%)</li>
                  <li>• US West → Landing B (50%)</li>
                  <li>• Track conversion rates by variant</li>
                </ul>
              </div>
            </div>

            <div className="bg-card border-2 border-border rounded-xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <GitBranch className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-display font-bold lowercase">cascade fallbacks</h3>
              </div>
              <p className="text-muted-foreground mb-4">If primary destination fails, automatically route to backup destination.</p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm">
                <p className="font-semibold text-foreground mb-2">Failover flow:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Try primary destination</li>
                  <li>• If down, try fallback 1</li>
                  <li>• If down, try fallback 2</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">for your role</h2>
          </div>
          <PersonaCalloutCards callouts={[
            { icon: Users, title: "for marketers", benefit: "Route by country for localized pricing—US visitors see USD, EU visitors see EUR, no manual links." },
            { icon: Code, title: "for developers", benefit: "One API endpoint, infinite routing rules—iOS → App Store, Android → Play Store, Desktop → Web." },
            { icon: Globe, title: "for enterprise", benefit: "Route by region, language, device, and more—personalize at scale without managing 50+ links." }
          ]} />
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-8">
          <RoleSpecificFAQ role="teams" faqs={faqs} />
        </div>
      </section>
    </FeatureLayout>
  );
}
