import { Navigation } from "@/components/landing/Navigation";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Glossary = () => {
  const terms = [
    {
      slug: "utm",
      term: "UTM",
      definition: "Urchin Tracking Module — standardized parameters appended to URLs to track campaign performance across analytics platforms.",
      category: "Core Concept"
    },
    {
      slug: "taxonomy",
      term: "Taxonomy",
      definition: "Structured naming system for organizing campaigns, channels, and content in a consistent, scalable hierarchy.",
      category: "Organization"
    },
    {
      slug: "source",
      term: "utm_source",
      definition: "Parameter identifying where traffic originated — platform or referrer sending visitors to your content.",
      category: "UTM Parameter"
    },
    {
      slug: "medium",
      term: "utm_medium",
      definition: "Parameter categorizing the type of traffic — paid, organic, social, email, referral, or affiliate.",
      category: "UTM Parameter"
    },
    {
      slug: "campaign",
      term: "utm_campaign",
      definition: "Parameter naming the specific marketing campaign, product launch, or promotion driving traffic.",
      category: "UTM Parameter"
    },
    {
      slug: "attribution",
      term: "Attribution",
      definition: "Process of assigning credit to marketing touchpoints that influenced a conversion or purchase decision.",
      category: "Analytics"
    }
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
              glossary
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
              canonical definitions for utm, taxonomy, attribution, and campaign structure.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="space-y-6">
            {terms.map((item) => (
              <Link
                key={item.slug}
                to={`/resources/glossary/${item.slug}`}
                className="block group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-2xl font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.term}
                    </h2>
                    <span className="text-xs text-muted-foreground font-medium px-3 py-1 rounded-full bg-muted/50">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12 bg-background">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center">
            <span className="text-[13px] text-muted-foreground">
              © 2024 utm.one. clarity creates confidence.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Glossary;
