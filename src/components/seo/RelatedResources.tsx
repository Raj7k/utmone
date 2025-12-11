import { Link } from "react-router-dom";
import { ChevronRight, BookOpen, FileText, Lightbulb, BarChart3 } from "lucide-react";

interface Resource {
  title: string;
  path: string;
  type: "guide" | "playbook" | "tool" | "comparison";
  description?: string;
}

interface RelatedResourcesProps {
  resources: Resource[];
  title?: string;
  className?: string;
}

const resourceIcons = {
  guide: BookOpen,
  playbook: FileText,
  tool: Lightbulb,
  comparison: BarChart3,
};

const resourceLabels = {
  guide: "Guide",
  playbook: "Playbook",
  tool: "Tool",
  comparison: "Compare",
};

export const RelatedResources = ({ 
  resources, 
  title = "Related Resources",
  className = "" 
}: RelatedResourcesProps) => {
  if (resources.length === 0) return null;

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-8">
        <h2 className="text-2xl font-display font-bold text-white mb-8">{title}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((resource, idx) => {
            const Icon = resourceIcons[resource.type];
            return (
              <Link
                key={idx}
                to={resource.path}
                className="group p-5 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Icon className="w-5 h-5 text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/40 uppercase tracking-wide mb-1">
                      {resourceLabels[resource.type]}
                    </p>
                    <p className="text-white font-medium group-hover:text-white/90 transition-colors flex items-center gap-2">
                      {resource.title}
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </p>
                    {resource.description && (
                      <p className="text-sm text-white/50 mt-1 line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Auto-linking utility for glossary terms
export const glossaryTerms: Record<string, string> = {
  "UTM": "/resources/glossary#utm",
  "UTM parameters": "/resources/glossary#utm-parameters",
  "attribution": "/resources/glossary#attribution",
  "multi-touch attribution": "/resources/glossary#multi-touch-attribution",
  "first-touch": "/resources/glossary#first-touch",
  "last-touch": "/resources/glossary#last-touch",
  "QR code": "/resources/glossary#qr-code",
  "short link": "/resources/glossary#short-link",
  "branded link": "/resources/glossary#branded-link",
  "click tracking": "/resources/glossary#click-tracking",
  "conversion": "/resources/glossary#conversion",
  "CTR": "/resources/glossary#ctr",
  "click-through rate": "/resources/glossary#ctr",
  "ROI": "/resources/glossary#roi",
  "return on investment": "/resources/glossary#roi",
  "clean-track": "/resources/glossary#clean-track",
  "governance": "/resources/glossary#governance",
  "link permanence": "/resources/glossary#link-permanence",
  "semantic slug": "/resources/glossary#semantic-slug",
  "geo-targeting": "/resources/glossary#geo-targeting",
  "A/B testing": "/resources/glossary#ab-testing",
  "identity graph": "/resources/glossary#identity-graph",
  "halo effect": "/resources/glossary#halo-effect",
};

// Helper to auto-link glossary terms in text
export const autoLinkGlossaryTerms = (text: string): string => {
  let result = text;
  Object.entries(glossaryTerms).forEach(([term, path]) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    result = result.replace(regex, `<a href="${path}" class="text-white underline underline-offset-2 hover:text-white/80">${term}</a>`);
  });
  return result;
};

// Suggested resources based on current page context
export const getSuggestedResources = (currentPath: string): Resource[] => {
  const resourceMap: Record<string, Resource[]> = {
    "/compare": [
      { title: "UTM Governance Playbook", path: "/resources/playbooks/utm-governance", type: "playbook" },
      { title: "Clean Track Framework", path: "/resources/guides/clean-track-framework", type: "guide" },
      { title: "UTM Builder", path: "/tools/utm-builder", type: "tool" },
    ],
    "/features/utm-builder": [
      { title: "UTM Governance Playbook", path: "/resources/playbooks/utm-governance", type: "playbook" },
      { title: "UTM Builder for LinkedIn", path: "/tools/utm-builder-linkedin", type: "tool" },
      { title: "utm.one vs Bitly", path: "/compare/bitly", type: "comparison" },
    ],
    "/features/short-links": [
      { title: "Link Hygiene Scanner", path: "/tools/scanner", type: "tool" },
      { title: "utm.one vs Rebrandly", path: "/compare/rebrandly", type: "comparison" },
      { title: "B2B Attribution Framework", path: "/resources/playbooks/b2b-architects", type: "playbook" },
    ],
    "/features/qr-generator": [
      { title: "QR Crash Test", path: "/tools/qr-test", type: "tool" },
      { title: "Event-Led Growth Playbook", path: "/resources/playbooks/event-led-growth", type: "playbook" },
      { title: "utm.one vs Bitly", path: "/compare/bitly", type: "comparison" },
    ],
  };

  // Default resources if no specific mapping
  const defaultResources: Resource[] = [
    { title: "Clean Track Framework", path: "/resources/guides/clean-track-framework", type: "guide", description: "Master the foundation of clean link management" },
    { title: "UTM Governance Playbook", path: "/resources/playbooks/utm-governance", type: "playbook", description: "Enterprise-ready UTM governance strategies" },
    { title: "Link Hygiene Scanner", path: "/tools/scanner", type: "tool", description: "Check your link health score" },
  ];

  return resourceMap[currentPath] || defaultResources;
};

// People Also Read component for blog/guide pages
interface PeopleAlsoReadProps {
  currentPath: string;
  resources?: Resource[];
}

export const PeopleAlsoRead = ({ currentPath, resources }: PeopleAlsoReadProps) => {
  const suggestedResources = resources || getSuggestedResources(currentPath);
  
  return (
    <RelatedResources 
      resources={suggestedResources} 
      title="People Also Read"
      className="bg-white/[0.02]"
    />
  );
};
