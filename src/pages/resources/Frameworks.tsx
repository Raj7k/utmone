import { Navigation } from "@/components/landing/Navigation";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Frameworks = () => {
  const frameworks = [
    {
      slug: "clean-track-model",
      title: "Clean Track Model — Data Architecture Framework",
      description: "Four-layer framework for building tracking systems that scale without breaking under complexity.",
      type: "Mental Model"
    },
    {
      slug: "minimal-analytics-stack",
      title: "Minimal Analytics Stack — Clarity Framework",
      description: "Four-layer framework for building analytics infrastructure that provides clarity without overwhelming teams.",
      type: "System Design"
    },
    {
      slug: "attribution-clarity-model",
      title: "Attribution Clarity Model — Decision Framework",
      description: "Four-layer framework for aligning teams on marketing attribution without political fights over credit.",
      type: "Decision Framework"
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
              frameworks
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
              proprietary mental models for clean tracking, minimal analytics, and utm governance.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="space-y-6">
            {frameworks.map((framework) => (
              <Link
                key={framework.slug}
                to={`/resources/frameworks/${framework.slug}`}
                className="block group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {framework.title}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {framework.description}
                  </p>
                  <div className="text-xs text-muted-foreground font-medium">
                    {framework.type}
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

export default Frameworks;
