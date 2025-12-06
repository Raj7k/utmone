import { MainLayout } from "@/components/layout/MainLayout";
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
  "Core Tracking": "hsl(217 91% 60%)",
  "Governance": "hsl(271 81% 60%)",
  "Analytics": "hsl(173 58% 39%)",
  "Marketing Channels": "hsl(25 95% 53%)",
  "Sales & RevOps": "hsl(330 81% 60%)",
  "B2B SaaS": "hsl(142 76% 36%)",
  "Operational": "hsl(215 20% 45%)",
  "PLG & Product-Led": "hsl(262 83% 58%)",
  "Customer Success": "hsl(199 89% 48%)",
  "Marketing Operations": "hsl(340 82% 52%)",
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
    <MainLayout showAnnouncement={false}>
      {/* Hero Section */}
      <section className="py-20 border-b border-white/10">
        <div className="max-w-[980px] mx-auto px-8">
          <Link
            to="/resources/glossary"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            back to glossary
          </Link>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4 flex-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold hero-gradient">
                  {term}
                </h1>
                <p className="text-lg md:text-xl text-white/60 max-w-[720px]">
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
                  className="gap-2 border-white/20 text-white hover:bg-white/10"
                >
                  <Copy className="w-4 h-4" />
                  copy term
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Full Definition */}
              <section className="space-y-6">
                <h2 className="text-2xl font-display font-semibold text-white">
                  definition
                </h2>
                <div className="space-y-4">
                  {fullDefinition.map((item, index) => {
                    if (typeof item === 'string') {
                      return (
                        <p key={index} className="text-base text-white/60 leading-relaxed">
                          {item}
                        </p>
                      );
                    }
                    
                    if (item.type === 'paragraph') {
                      return (
                        <p key={index} className="text-base text-white/60 leading-relaxed">
                          {item.content}
                        </p>
                      );
                    }
                    
                    if (item.type === 'list' && item.items) {
                      return (
                        <ul key={index} className="space-y-2 ml-6">
                          {item.items.map((listItem, listIndex) => (
                            <li key={listIndex} className="text-base text-white/60 leading-relaxed list-disc">
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
                  <h2 className="text-2xl font-display font-semibold text-white">
                    usage guidelines
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {whenToUse && (
                      <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          when to use
                        </h3>
                        <p className="text-sm text-white/60">{whenToUse}</p>
                      </div>
                    )}
                    {whenNotToUse && (
                      <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <X className="w-4 h-4 text-red-400" />
                          when not to use
                        </h3>
                        <p className="text-sm text-white/60">{whenNotToUse}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Common Mistakes */}
              {commonMistakes && commonMistakes.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-display font-semibold text-white">
                    common mistakes
                  </h2>
                  <div className="space-y-3">
                    {commonMistakes.map((mistake, index) => (
                      <div key={index} className="flex items-start gap-3 bg-zinc-900/40 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                        <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-white/60">{mistake}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Examples */}
              {((goodExamples && goodExamples.length > 0) || (badExamples && badExamples.length > 0)) && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-display font-semibold text-white">
                    examples
                  </h2>
                  <div className="space-y-4">
                    {goodExamples && goodExamples.map((example, index) => (
                      <div key={`good-${index}`} className="bg-green-500/10 border-l-4 border-green-500 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <code className="text-sm text-white font-mono">{example}</code>
                        </div>
                      </div>
                    ))}
                    {badExamples && badExamples.map((example, index) => (
                      <div key={`bad-${index}`} className="bg-red-500/10 border-l-4 border-red-500 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <code className="text-sm text-white/60 font-mono line-through">{example}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Terms */}
              {relatedTerms.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-display font-semibold text-white">
                    related terms
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedTerms.map((relatedTerm) => {
                      const relatedColor = categoryColors[relatedTerm.category] || "hsl(217 91% 60%)";
                      return (
                        <Link
                          key={relatedTerm.slug}
                          to={`/resources/glossary/${relatedTerm.slug}`}
                          className="group bg-zinc-900/40 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-base font-display font-semibold text-primary transition-colors">
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
                <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
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
                          <p className="text-sm font-medium text-primary transition-colors">
                            {resource.title}
                          </p>
                          <p className="text-xs text-white/40">
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
    </MainLayout>
  );
};
