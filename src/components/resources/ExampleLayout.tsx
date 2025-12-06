import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";

interface ExampleLayoutProps {
  title: string;
  description: string;
  totalCount: string;
  children: ReactNode;
  relatedResources: {
    title: string;
    href: string;
  }[];
}

export const ExampleLayout = ({
  title,
  description,
  totalCount,
  children,
  relatedResources,
}: ExampleLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-block mb-6 rounded-full px-4 py-1.5 text-xs font-medium" style={{ background: 'rgba(59,130,246,0.1)', color: 'rgba(59,130,246,1)' }}>
              {totalCount}
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 hero-gradient">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1fr,300px]">
            {/* Examples */}
            <div>{children}</div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Related Resources */}
              <div className="rounded-2xl border border-border bg-card p-8">
                <h3 className="text-lg font-display font-semibold mb-4">
                  related resources
                </h3>
                <div className="space-y-3">
                  {relatedResources.map((resource) => (
                    <Link
                      key={resource.href}
                      to={resource.href}
                      className="group flex items-center justify-between rounded-lg p-3 hover:bg-muted transition-colors"
                    >
                      <span className="text-sm text-foreground">
                        {resource.title}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-all" style={{ color: 'rgba(59,130,246,1)' }} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-2xl border border-border p-8" style={{ background: 'linear-gradient(to bottom right, rgba(59,130,246,0.05), rgba(59,130,246,0.1))' }}>
                <h3 className="text-lg font-display font-semibold mb-2">
                  build with utm.one
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  create links that follow these patterns automatically.
                </p>
                <Button asChild className="w-full rounded-full">
                  <Link to="/early-access">get early access</Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
