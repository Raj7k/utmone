import { Navigation } from "@/components/landing/Navigation";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

const Glossary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryColors: Record<string, string> = {
    "Core Tracking": "hsl(217 91% 60%)", // Electric Blue
    "Governance": "hsl(271 81% 60%)", // Purple
    "Analytics": "hsl(173 58% 39%)", // Teal
    "Marketing Channels": "hsl(25 95% 53%)", // Orange
    "Sales & RevOps": "hsl(330 81% 60%)", // Pink
    "B2B SaaS": "hsl(142 76% 36%)", // Green
    "Operational": "hsl(215 20% 45%)", // Slate
  };

  const terms = [
    // Core Tracking (6 terms)
    {
      slug: "utm",
      term: "UTM",
      definition: "Urchin Tracking Module — standardized parameters appended to URLs to track campaign performance across analytics platforms.",
      category: "Core Tracking"
    },
    {
      slug: "source",
      term: "utm_source",
      definition: "Parameter identifying where traffic originated — platform or referrer sending visitors to your content.",
      category: "Core Tracking"
    },
    {
      slug: "medium",
      term: "utm_medium",
      definition: "Parameter categorizing the type of traffic — paid, organic, social, email, referral, or affiliate.",
      category: "Core Tracking"
    },
    {
      slug: "campaign",
      term: "utm_campaign",
      definition: "Parameter naming the specific marketing campaign, product launch, or promotion driving traffic.",
      category: "Core Tracking"
    },
    {
      slug: "content",
      term: "utm_content",
      definition: "Parameter identifying creative variants, ad copy versions, or placement details within a campaign.",
      category: "Core Tracking"
    },
    {
      slug: "term",
      term: "utm_term",
      definition: "Parameter capturing paid search keywords that triggered an ad impression and click.",
      category: "Core Tracking"
    },
    
    // Governance (3 terms)
    {
      slug: "taxonomy",
      term: "Taxonomy",
      definition: "Structured naming system for organizing campaigns, channels, and content in a consistent, scalable hierarchy.",
      category: "Governance"
    },
    {
      slug: "naming-convention",
      term: "Naming Convention",
      definition: "Structured pattern for constructing consistent, human-readable names across campaigns, links, and analytics entities.",
      category: "Governance"
    },
    {
      slug: "tracking-architecture",
      term: "Tracking Architecture",
      definition: "Comprehensive system design defining how data flows from user actions through UTMs, events, and analytics platforms to dashboards.",
      category: "Governance"
    },
    
    // Analytics (placeholder for future)
    {
      slug: "attribution",
      term: "Attribution",
      definition: "Process of assigning credit to marketing touchpoints that influenced a conversion or purchase decision.",
      category: "Analytics"
    }
  ];

  const categories = Array.from(new Set(terms.map(t => t.category)));

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    // Add ItemList schema markup
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "utm.one Glossary",
      "description": "Canonical definitions for UTM, taxonomy, attribution, and campaign tracking terminology.",
      "numberOfItems": terms.length,
      "itemListElement": terms.map((term, index) => ({
        "@type": "DefinedTerm",
        "@id": `#${term.slug}`,
        "position": index + 1,
        "name": term.term,
        "description": term.definition,
        "inDefinedTermSet": "https://utm.one/resources/glossary",
        "url": `https://utm.one/resources/glossary/${term.slug}`
      }))
    });
    document.head.appendChild(schemaScript);

    return () => {
      document.head.removeChild(schemaScript);
    };
  }, [terms]);

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
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground lowercase">
                  glossary
                </h1>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {terms.length} terms
                </span>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
                canonical definitions for utm, taxonomy, attribution, and campaign structure.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-card border-border/50"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                all terms
              </button>
              {categories.map((category) => {
                const color = categoryColors[category] || "hsl(217 91% 60%)";
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "text-white"
                        : "bg-card hover:bg-muted"
                    }`}
                    style={
                      selectedCategory === category
                        ? { backgroundColor: color }
                        : { color: color }
                    }
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                no terms found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTerms.map((item) => {
                const color = categoryColors[item.category] || "hsl(217 91% 60%)";
                return (
                  <Link
                    key={item.slug}
                    to={`/resources/glossary/${item.slug}`}
                    className="group bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                    style={{ borderLeftWidth: "4px", borderLeftColor: color }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.term}
                        </h2>
                        <span
                          className="text-xs font-medium px-3 py-1 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: `${color}20`,
                            color: color,
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {item.definition}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
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
