import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid, BarChart3, BadgeCheck, Palette, Clock, Tags } from "lucide-react";
import { LinkPagePreview } from "@/components/features/visuals/LinkPagePreview";

export const LinkPagesShowcase = () => {
  const features = [
    { icon: LayoutGrid, text: "6 block types: links, headers, text, images, dividers, social" },
    { icon: BarChart3, text: "Built-in analytics: views, clicks, CTR per block" },
    { icon: BadgeCheck, text: "Verified badge to build trust" },
    { icon: Palette, text: "10+ themes to match your brand" },
    { icon: Clock, text: "Scheduled publishing for campaigns" },
    { icon: Tags, text: "Full UTM tracking on every click" },
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-medium text-primary uppercase tracking-wider">New Feature</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                one link to rule them all
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                link-in-bio pages with full UTM tracking and analytics—finally know where your bio clicks come from.
              </p>
            </div>

            {/* Feature list */}
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <feature.icon className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-foreground">&lt;30s</div>
                <div className="text-xs text-muted-foreground">to publish</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">10+</div>
                <div className="text-xs text-muted-foreground">themes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-xs text-muted-foreground">tracked</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/tools/link-page-builder"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Build Your Page
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/features/link-pages"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right: Phone Preview */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-full scale-75" />
              <LinkPagePreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
