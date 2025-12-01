import { FeatureLayout } from "@/components/features/FeatureLayout";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { SocialProofCounter } from "@/components/growth/SocialProofCounter";
import { HorrorStorySection } from "@/components/solutions/HorrorStorySection";
import { PersonaCalloutCards } from "@/components/solutions/PersonaCalloutCards";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { Zap, Users, Code, Globe } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

export default function SmartRouting() {
  const faqs = [
    {
      question: "How does geo-targeting work?",
      answer: "utm.one reads the visitor's country from their IP address and routes them to the destination you've configured for that country. If no country-specific rule exists, they go to the default destination."
    },
    {
      question: "Can I A/B test different landing pages by country?",
      answer: "Yes. Set up different destinations for different countries, then track conversion rates by country to see which landing page performs best in each market."
    },
    {
      question: "What if I want to route by device (mobile vs desktop)?",
      answer: "Smart Routing can route based on device type, OS, browser, or any combination. For example: iOS users → App Store, Android users → Play Store."
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

      {/* Solution */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">how smart routing works</h2>
            <p className="text-xl text-muted-foreground">one link adapts to every visitor</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { num: "1", text: "User clicks link" },
              { num: "2", text: "System reads location, device, OS" },
              { num: "3", text: "Algorithm scores each destination" },
              { num: "4", text: "Routes to best match" }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">{step.num}</div>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="py-24 bg-background">
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
      <section className="py-24 bg-muted/20">
        <div className="max-w-4xl mx-auto px-8">
          <RoleSpecificFAQ role="teams" faqs={faqs} />
        </div>
      </section>
    </FeatureLayout>
  );
}
