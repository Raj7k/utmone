import { Navigation } from "@/components/landing/Navigation";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";

interface RelatedTerm {
  slug: string;
  term: string;
  category: string;
}

interface RelatedResource {
  title: string;
  url: string;
  type: string;
}

type DefinitionContent = string | { type: 'paragraph' | 'list'; content?: string; items?: string[] };

interface GlossaryTermLayoutProps {
  term: string;
  category: string;
  quickDefinition: string;
  fullDefinition: DefinitionContent[];
  whenToUse?: string;
  whenNotToUse?: string;
  commonMistakes?: string[];
  goodExamples?: string[];
  badExamples?: string[];
  relatedTerms: RelatedTerm[];
  relatedResources: RelatedResource[];
}

const categoryColors: Record<string, string> = {
  "Core Tracking": "hsl(217 91% 60%)", // Electric Blue
  "Governance": "hsl(271 81% 60%)", // Purple
  "Analytics": "hsl(173 58% 39%)", // Teal
  "Marketing Channels": "hsl(25 95% 53%)", // Orange
  "Sales & RevOps": "hsl(330 81% 60%)", // Pink
  "B2B SaaS": "hsl(142 76% 36%)", // Green
  "Operational": "hsl(215 20% 45%)", // Slate
  "PLG & Product-Led": "hsl(262 83% 58%)", // Purple-Blue
  "Customer Success": "hsl(199 89% 48%)", // Bright Blue
  "Marketing Operations": "hsl(340 82% 52%)", // Magenta
};

export const GlossaryTermLayout = ({
  term,
  category,
  quickDefinition,
  fullDefinition,
  whenToUse,
  whenNotToUse,
  commonMistakes,
  goodExamples,
  badExamples,
  relatedTerms,
  relatedResources,
}: GlossaryTermLayoutProps) => {
  const categoryColor = categoryColors[category] || "hsl(217 91% 60%)";

  useEffect(() => {
    // Add DefinedTerm schema markup
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": term,
      "description": quickDefinition,
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "name": "utm.one Glossary",
        "hasDefinedTerm": relatedTerms.map(rt => rt.term)
      },
      "url": `https://utm.one/resources/glossary/${term.toLowerCase().replace(/\s+/g, '-')}`,
      "dateModified": new Date().toISOString().split('T')[0]
    });
    document.head.appendChild(schemaScript);

    return () => {
      document.head.removeChild(schemaScript);
    };
  }, [term, quickDefinition, relatedTerms]);

  const handleCopyTerm = () => {
    navigator.clipboard.writeText(term);
    toast.success("term copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-background border-b border-border/50">
        <div className="max-w-[980px] mx-auto px-8">
          <Link
            to="/resources/glossary"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            back to glossary
          </Link>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4 flex-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground">
                  {term}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
                  {quickDefinition}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span 
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor
                  }}
                >
                  {category}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyTerm}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  copy term
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-20 bg-background">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Full Definition */}
              <section className="space-y-6">
                <h2 className="text-2xl font-display font-semibold text-foreground">
                  definition
                </h2>
                <div className="space-y-4">
                  {fullDefinition.map((item, index) => {
                    if (typeof item === 'string') {
                      return (
                        <p key={index} className="text-base text-muted-foreground leading-relaxed">
                          {item}
                        </p>
                      );
                    }
                    
                    if (item.type === 'paragraph') {
                      return (
                        <p key={index} className="text-base text-muted-foreground leading-relaxed">
                          {item.content}
                        </p>
                      );
                    }
                    
                    if (item.type === 'list' && item.items) {
                      return (
                        <ul key={index} className="space-y-2 ml-6">
                          {item.items.map((listItem, listIndex) => (
                            <li key={listIndex} className="text-base text-muted-foreground leading-relaxed list-disc">
                              {listItem}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    
                    return null;
                  })}
                </div>
              </section>

              {/* When to Use / When Not to Use */}
              {(whenToUse || whenNotToUse) && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-display font-semibold text-foreground">
                    usage guidelines
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {whenToUse && (
                      <div className="bg-card rounded-2xl p-6 border border-border/50">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          when to use
                        </h3>
                        <p className="text-sm text-muted-foreground">{whenToUse}</p>
                      </div>
                    )}
                    {whenNotToUse && (
                      <div className="bg-card rounded-2xl p-6 border border-border/50">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <X className="w-4 h-4 text-red-600" />
                          when not to use
                        </h3>
                        <p className="text-sm text-muted-foreground">{whenNotToUse}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Common Mistakes */}
              {commonMistakes && commonMistakes.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-display font-semibold text-foreground">
                    common mistakes
                  </h2>
                  <div className="space-y-3">
                    {commonMistakes.map((mistake, index) => (
                      <div key={index} className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border/50">
                        <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{mistake}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Examples */}
              {((goodExamples && goodExamples.length > 0) || (badExamples && badExamples.length > 0)) && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-display font-semibold text-foreground">
                    examples
                  </h2>
                  <div className="space-y-4">
                    {goodExamples && goodExamples.map((example, index) => (
                      <div key={`good-${index}`} className="bg-green-50 border-l-4 border-green-600 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <code className="text-sm text-foreground font-mono">{example}</code>
                        </div>
                      </div>
                    ))}
                    {badExamples && badExamples.map((example, index) => (
                      <div key={`bad-${index}`} className="bg-red-50 border-l-4 border-red-600 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <code className="text-sm text-muted-foreground font-mono line-through">{example}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Terms */}
              {relatedTerms.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-display font-semibold text-foreground">
                    related terms
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedTerms.map((relatedTerm) => {
                      const relatedColor = categoryColors[relatedTerm.category] || "hsl(217 91% 60%)";
                      return (
                        <Link
                          key={relatedTerm.slug}
                          to={`/resources/glossary/${relatedTerm.slug}`}
                          className="group bg-card rounded-xl p-4 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-base font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                                {relatedTerm.term}
                              </h3>
                              <span 
                                className="text-xs font-medium px-2 py-1 rounded-full"
                                style={{ 
                                  backgroundColor: `${relatedColor}20`,
                                  color: relatedColor
                                }}
                              >
                                {relatedTerm.category}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                <div className="bg-card rounded-2xl p-6 border border-border/50">
                  <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                    related resources
                  </h3>
                  <div className="space-y-3">
                    {relatedResources.map((resource, index) => (
                      <Link
                        key={index}
                        to={resource.url}
                        className="block group"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {resource.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {resource.type}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
