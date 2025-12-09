import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { Link } from "react-router-dom";
import { ArrowLeft, Globe, MapPin, Smartphone, Check } from "lucide-react";

export default function GeoTargeting() {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Geo-Targeting - Documentation"
        description="Learn how to set up country-specific destination URLs with utm.one's geo-targeting feature."
        canonical="https://utm.one/docs/geo-targeting"
        keywords={['geo-targeting', 'country targeting', 'location routing', 'regional links']}
      />

      <div className="max-w-4xl mx-auto px-8 py-16">
        <Link to="/docs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          back to docs
        </Link>

        <div className="space-y-12">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground">Geo-Targeting</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              redirect visitors to different destinations based on their country.
            </p>
          </div>

          {/* How it works */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">How It Works</h2>
            
            <div className="bg-card border border-border rounded-xl p-8">
              <p className="text-muted-foreground mb-6">
                Geo-targeting allows you to specify different destination URLs for different countries. When a visitor clicks your link, utm.one detects their country and redirects them to the appropriate URL.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Visitor from USA clicks link</p>
                    <p className="text-sm text-muted-foreground">→ Redirects to example.com/us/product</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Visitor from UK clicks same link</p>
                    <p className="text-sm text-muted-foreground">→ Redirects to example.co.uk/product</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Visitor from any other country</p>
                    <p className="text-sm text-muted-foreground">→ Redirects to default destination</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Setup */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Setting Up Geo-Targeting</h2>
            
            <div className="space-y-4">
              {[
                { step: 1, title: "Open link settings", desc: "Navigate to your link and click the globe icon or go to the Targeting tab." },
                { step: 2, title: "Add country rules", desc: "Click 'Add Rule' and select a country from the dropdown." },
                { step: 3, title: "Enter destination URL", desc: "Provide the URL where visitors from that country should be redirected." },
                { step: 4, title: "Save changes", desc: "Click Save to activate your geo-targeting rules." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-6 bg-card border border-border rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Use cases */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Common Use Cases</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Regional pricing pages", desc: "Send visitors to localized pricing in their currency" },
                { title: "Language-specific content", desc: "Redirect to translated versions of your site" },
                { title: "Compliance redirects", desc: "Show region-specific legal or privacy notices" },
                { title: "Local stores", desc: "Direct visitors to their nearest regional store" },
              ].map((item) => (
                <div key={item.title} className="p-6 bg-card border border-border rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Plan note */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Pro Feature</h3>
                <p className="text-sm text-muted-foreground">
                  Geo-targeting is available on Starter plans and above. <Link to="/pricing" className="text-primary hover:underline">View pricing</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}