import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo/SEO";
import { ItemListSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { ResourcesLayout } from "@/components/layout/ResourcesLayout";

const Playbooks = () => {
  const playbooks = [
    {
      slug: "b2b-architects-2026",
      title: "25 B2B Marketing Architects Defining 2026",
      description: "The definitive guide to the 25 most influential B2B marketing leaders shaping the industry. Interactive flip-card profiles, category filters, and direct LinkedIn access.",
      readTime: "8 min read",
      badge: "FEATURED"
    },
    {
      slug: "llm-ranking",
      title: "LLM Ranking Playbook — The Complete Implementation Guide",
      description: "90-day step-by-step roadmap to rank your content in ChatGPT, Claude, Perplexity, and Gemini. Includes 9 interactive tools, 50+ optimization tactics, and real-world case studies.",
      readTime: "45 min read",
      badge: "NEW"
    },
    {
      slug: "ai-marketing",
      title: "AI Marketing Playbook — Content Creation in the AI Era",
      description: "Master AI-driven content marketing with 8-step workflow, 30+ tools, interactive examples, and proven strategies for thought leadership.",
      readTime: "22 min read"
    },
    {
      slug: "utm-governance-playbook",
      title: "UTM Governance Playbook — Team Enforcement",
      description: "Step-by-step playbook for implementing and enforcing UTM standards across marketing, sales, and ops teams.",
      readTime: "8 min read"
    },
    {
      slug: "startup-analytics-playbook",
      title: "Startup Analytics Playbook — Simple Setup",
      description: "Tactical guide for setting up analytics infrastructure from scratch without over-engineering.",
      readTime: "10 min read"
    },
    {
      slug: "event-led-growth-playbook",
      title: "Event-Led Growth Playbook — Campaign Tracking",
      description: "How to structure tracking for events, webinars, and in-person campaigns that drive conversions.",
      readTime: "12 min read"
    },
    {
      slug: "naming-convention-playbook",
      title: "Naming Convention Playbook — Taxonomy Design",
      description: "Practical steps for designing and rolling out a consistent naming taxonomy across your organization.",
      readTime: "9 min read"
    },
    {
      slug: "sales-marketing-alignment",
      title: "Sales & Marketing Alignment Playbook — The Simple Version",
      description: "90-day implementation plan to align sales and marketing with zero confusion. Includes interactive calculators, checklists, and templates.",
      readTime: "22 min read"
    }
  ];

  return (
    <>
      <SEO 
        title="Playbooks - utm.one"
        description="Tactical step-by-step implementation workflows for UTM governance, startup analytics, event-led growth, and sales-marketing alignment."
        canonical="https://utm.one/resources/playbooks"
        keywords={["utm playbook", "marketing playbook", "analytics playbook", "implementation guide"]}
      />
      <ItemListSchema 
        name="utm.one Playbooks"
        description="Step-by-step implementation playbooks for marketing and analytics."
        items={playbooks.map(p => ({
          name: p.title,
          url: `https://utm.one/resources/playbooks/${p.slug}`,
          description: p.description
        }))}
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one/' },
          { name: 'Resources', url: 'https://utm.one/resources' },
          { name: 'Playbooks', url: 'https://utm.one/resources/playbooks' }
        ]}
      />
      <ResourcesLayout>
        <section className="py-20 border-b border-zinc-200">
          <div className="max-w-[980px] mx-auto px-8">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Resources
            </Link>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-zinc-900">
                Playbooks
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 max-w-[720px]">
                Tactical, step-by-step workflows for UTM governance, analytics, and campaign execution.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-[980px] mx-auto px-8">
            <div className="space-y-6">
              {playbooks.map((playbook) => (
                <Link
                  key={playbook.slug}
                  to={`/resources/playbooks/${playbook.slug}`}
                  className="block group bg-white rounded-2xl p-8 border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-300 relative"
                >
                  {playbook.badge && (
                    <Badge className="absolute top-4 right-4 animate-pulse bg-zinc-900 text-white">
                      {playbook.badge}
                    </Badge>
                  )}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-display font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                      {playbook.title}
                    </h2>
                    <p className="text-base text-zinc-600 leading-relaxed">
                      {playbook.description}
                    </p>
                    <div className="text-xs text-zinc-400 font-medium">
                      {playbook.readTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ResourcesLayout>
    </>
  );
};

export default Playbooks;
