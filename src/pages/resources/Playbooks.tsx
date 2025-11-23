import { Navigation } from "@/components/landing/Navigation";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Playbooks = () => {
  const playbooks = [
    {
      slug: "ai-marketing",
      title: "AI Marketing Playbook — Content Creation in the AI Era",
      description: "Master AI-driven content marketing with 8-step workflow, 30+ tools, interactive examples, and proven strategies for thought leadership.",
      readTime: "22 min read",
      badge: "NEW"
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
              playbooks
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
              tactical, step-by-step workflows for utm governance, analytics, and campaign execution.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="space-y-6">
            {playbooks.map((playbook) => (
              <Link
                key={playbook.slug}
                to={`/resources/playbooks/${playbook.slug}`}
                className="block group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 relative"
              >
                {playbook.badge && (
                  <Badge className="absolute top-4 right-4 bg-primary text-white">
                    {playbook.badge}
                  </Badge>
                )}
                <div className="space-y-3">
                  <h2 className="text-2xl font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {playbook.title}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {playbook.description}
                  </p>
                  <div className="text-xs text-muted-foreground font-medium">
                    {playbook.readTime}
                  </div>
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

export default Playbooks;
