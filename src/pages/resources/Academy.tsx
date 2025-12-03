import { MainLayout } from "@/components/layout/MainLayout";
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
    <MainLayout showAnnouncement={false}>
      <section className="py-20 border-b border-white/10">
        <div className="max-w-[980px] mx-auto px-8">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white">
              Academy
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-[720px]">
              Micro lessons on UTM, analytics, frameworks, and naming conventions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="space-y-6">
            {lessons.map((lesson) => (
              <Link
                key={lesson.slug}
                to={`/resources/academy/${lesson.slug}`}
                className="block group bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-2xl font-display font-semibold text-white group-hover:text-primary transition-colors">
                      {lesson.title}
                    </h2>
                    <span className="text-xs text-white/60 font-medium px-3 py-1 rounded-full bg-white/10">
                      {lesson.level}
                    </span>
                  </div>
                  <p className="text-base text-white/60 leading-relaxed">
                    {lesson.description}
                  </p>
                  <div className="text-xs text-white/40 font-medium">
                    {lesson.duration}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Academy;
