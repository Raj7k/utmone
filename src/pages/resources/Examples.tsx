import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Examples = () => {
  const examples = [
    {
      slug: "utm-examples",
      title: "UTM Examples Library",
      description: "Real UTM patterns across paid search, social, email, affiliates, offline, events, and product-led growth.",
      count: "150+ examples",
    },
    {
      slug: "naming-examples",
      title: "Naming Examples Library",
      description: "Real naming conventions for campaigns, audiences, objectives, variants, and lifecycle segments.",
      count: "100+ examples",
    },
    {
      slug: "dashboard-examples",
      title: "Dashboard Examples Library",
      description: "Practical dashboard structures for SaaS, B2B, and multi-channel marketing environments.",
      count: "12+ dashboards",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20 bg-background border-b border-border/50">
        <div className="max-w-[980px] mx-auto px-8">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            back to resources
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground lowercase">
              examples
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
              real-world utm examples, before/after tracking, and dashboard visualizations.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="space-y-6">
            {examples.map((example) => (
              <Link
                key={example.slug}
                to={`/resources/examples/${example.slug}`}
                className="block group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {example.title}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {example.description}
                  </p>
                  <div className="text-xs text-muted-foreground font-medium">
                    {example.count}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Examples;
