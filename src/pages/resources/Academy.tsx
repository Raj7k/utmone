import { Navigation } from "@/components/landing/Navigation";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Academy = () => {
  const lessons = [
    {
      slug: "utm-101",
      title: "UTM 101 — Foundation Course",
      description: "Everything you need to know about UTM parameters, tracking, and why they matter for marketing attribution.",
      duration: "6 lessons",
      level: "Beginner"
    },
    {
      slug: "analytics-101",
      title: "Analytics 101 — Simple Setup",
      description: "Micro-course on setting up clean analytics that provide clarity without overwhelming complexity.",
      duration: "5 lessons",
      level: "Beginner"
    },
    {
      slug: "naming-101",
      title: "Naming 101 — Taxonomy Design",
      description: "Short course on designing naming conventions that scale across campaigns, channels, and teams.",
      duration: "4 lessons",
      level: "Intermediate"
    },
    {
      slug: "frameworks-101",
      title: "Frameworks 101 — Mental Models",
      description: "Introduction to proprietary frameworks for clean tracking, governance, and analytics clarity.",
      duration: "7 lessons",
      level: "Advanced"
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
            Back to Resources
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground">
              Academy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
              Micro lessons on UTM, analytics, frameworks, and naming conventions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="space-y-6">
            {lessons.map((lesson) => (
              <Link
                key={lesson.slug}
                to={`/resources/academy/${lesson.slug}`}
                className="block group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-2xl font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {lesson.title}
                    </h2>
                    <span className="text-xs text-muted-foreground font-medium px-3 py-1 rounded-full bg-muted/50">
                      {lesson.level}
                    </span>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {lesson.description}
                  </p>
                  <div className="text-xs text-muted-foreground font-medium">
                    {lesson.duration}
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

export default Academy;
